const axios = require('axios');
const yts = require('yt-search');

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
  const query = args.join(' ');
  if (!query) {
    return conn.sendMessage(message.key.remoteJid, {
      text: '⚡ *Lo usaste mal*\n\n> Debes ingresar el nombre o enlace de YouTube\n> Ej: `play vaicocota` o `play https://youtu.be/P9iy6wjbOiQ`',
      contextInfo
    }, { quoted: message });
  }

  await conn.sendMessage(message.key.remoteJid, {
    text: `🎶 *Buscando tu canción...*`,
    contextInfo
  }, { quoted: message });

  try {
    let youtubeUrl = query;

    if (!query.startsWith('http')) {
      const search = await yts(query);
      const video = search.videos[0];
      if (!video) throw new Error("No se encontraron resultados en YouTube.");
      youtubeUrl = video.url;
    }

    const apiUrl = `https://api.ryuu-dev.offc.my.id/download/ytplay?url=${encodeURIComponent(youtubeUrl)}`;
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
│ ☆ *Título:* ${result.title}
│ ☆ *Canal:* ${result.channel}
│ ☆ *Duración:* ${parseInt(result.duration / 60)}:${String(result.duration % 60).padStart(2, '0')} min
│ ☆ *Vistas:* ${parseInt(result.views).toLocaleString()}
│ ☆ *PayPal:* https://paypal.me/black374673
╰─────────────────╯
`.trim();

    await conn.sendMessage(message.key.remoteJid, {
      image: { url: result.thumbnail },
      caption,
      contextInfo
    }, { quoted: message });

    await conn.sendMessage(message.key.remoteJid, {
      react: { text: "🍁", key: message.key }
    });

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