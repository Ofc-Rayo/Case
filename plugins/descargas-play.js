const axios = require('axios');

const thumbnailUrl = 'https://qu.ax/QuwNu.jpg';

const contextInfo = {
  externalAdReply: {
    title: "YouTube - Play",
    body: "Bot Hecho desde Cero Desarrollado por Rayo-ofc",
    mediaType: 1,
    previewType: 0,
    mediaUrl: "https://youtube.com",
    sourceUrl: "https://youtube.com",
    thumbnailUrl
  },
  forwardingScore: 999,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: '120363276986902836@newsletter',
    newsletterName: 'Toca aquí 👆🏻',
    serverMessageId: 143
  }
};

async function handler(conn, { message, args }) {
  const url = args.join(' ');
  if (!url || !url.includes('youtube.com') && !url.includes('youtu.be')) {
    return conn.sendMessage(message.key.remoteJid, {
      text: '⚡ *Lo usaste mal*\n\n> Debes ingresar un enlace de YouTube\n> Ej: `play https://youtu.be/P9iy6wjbOiQ`',
      contextInfo
    }, { quoted: message });
  }

  await conn.sendMessage(message.key.remoteJid, {
    text: `🎶 *Procesando tu enlace...*`,
    contextInfo
  }, { quoted: message });

  try {
    const apiUrl = `https://api.ryuu-dev.offc.my.id/download/ytplay?url=${encodeURIComponent(url)}`;
    const res = await axios.get(apiUrl, { headers: { "User-Agent": "Mozilla/5.0" } });

    const result = res.data?.output;

    if (!res.data.status || !result?.audioUrl) {
      return conn.sendMessage(message.key.remoteJid, {
        text: `❌ *No se pudo obtener el audio. Inténtalo más tarde.*`,
        contextInfo
      }, { quoted: message });
    }

    const caption = `
╭─「 SIMPLE - BOT 」─╮
│ 🎬 *Título:* ${result.title}
│ 👤 *Canal:* ${result.channel}
│ ⏱️ *Duración:* ${parseInt(result.duration / 60)}:${String(result.duration % 60).padStart(2, '0')} min
│ 👁️ *Vistas:* ${parseInt(result.views).toLocaleString()}
│ 🔗 *Enlace YouTube:* ${url}
╰────────────────────────────╯
`.trim();

    await conn.sendMessage(message.key.remoteJid, {
      image: { url: result.thumbnail },
      caption,
      contextInfo
    }, { quoted: message });

    await conn.sendMessage(message.key.remoteJid, {
      audio: { url: result.audioUrl },
      fileName: `${result.title}.mp3`,
      mimetype: "audio/mp4",
      ptt: false,
      contextInfo
    }, { quoted: message });

  } catch (err) {
    console.error("⚠️ Error en el comando play:", err.message);
    await conn.sendMessage(message.key.remoteJid, {
      text: `❌ *Error inesperado al reproducir el audio.*\n\n${err.message}`,
      contextInfo
    }, { quoted: message });
  }
}

module.exports = {
  command: 'play',
  handler,
};