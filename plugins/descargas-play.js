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
    newsletterJid:
'120363276986902836@newsletter',
    newsletterName: 'Toca aquí 👆🏻',
    serverMessageId: 143
  }
};

async function handler(conn, { message, args }) {
  const query = args.join(' ');
  if (!query) {
    return conn.sendMessage(message.key.remoteJid, {
      text: '⚡ *Lo uso mal*\n\n> Ejemplo de uso: `play Vamos albirroja`',
      contextInfo
    }, { quoted: message });
  }

  await conn.sendMessage(message.key.remoteJid, {
    text: `*Buscando su audio en YouTube...*`,
    contextInfo
  }, { quoted: message });

  try {
    const apiUrl = `https://api.vreden.my.id/api/ytplaymp3?query=${encodeURIComponent(query)}`;
    const res = await axios.get(apiUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
    const result = res.data?.result;

    if (!result?.status || !result.download?.status) {
      return conn.sendMessage(message.key.remoteJid, {
        text: `*Se produjo un error en la descarga intentalo mas tarde*`,
        contextInfo
      }, { quoted: message });
    }

    const { metadata, download } = result;

    const caption = `
╭─「 SIMPLE - BOT 」─╮
│ 🎬 *Título:* ${metadata.title}
│ 👤 *Autor:* ${metadata.author.name}
│ ⏱️ *Duración:* ${metadata.duration.timestamp}
│ 👁️ *Vistas:* ${metadata.views.toLocaleString()}
│ 🔗 *YouTube:* ${metadata.url}
│ 📋 Nota: *apóyame con el proyecto vía PayPal* https://paypal.me/black374673
╰────────────────────────────╯
`.trim();

    await conn.sendMessage(message.key.remoteJid, {
      image: { url: metadata.thumbnail },
      caption,
      contextInfo
    }, { quoted: message });

    await conn.sendMessage(message.key.remoteJid, {
      audio: { url: download.url },
      fileName: download.filename,
      mimetype: "audio/mp4",
      ptt: false,
      contextInfo
    }, { quoted: message });

  } catch (err) {
    console.error("⚠️ Error en el comando play:", err.message);
    await conn.sendMessage(message.key.remoteJid, {
      text: `*Error inesperado en la reproducción.*\n\n ${err.message}\n⚡ simple bot está revisando los cables del universo...`,
      contextInfo
    }, { quoted: message });
  }
}

module.exports = {
  command: 'play',
  handler,
};