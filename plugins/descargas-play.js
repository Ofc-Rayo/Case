const axios = require('axios');

const thumbnailUrl = 'https://qu.ax/QuwNu.jpg';

const contextInfo = {
  externalAdReply: {
    title: "🎧 Reproductor YouTube",
    body: "Directo desde el mundo musical...",
    mediaType: 1,
    previewType: 0,
    mediaUrl: "https://youtube.com",
    sourceUrl: "https://youtube.com",
    thumbnailUrl
  }
};

const forwardedContextInfo = {
  forwardingScore: 999,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: '120363318767880951@newsletter',
    newsletterName: 'DEVELOPED AUDIO',
    serverMessageId: 143
  }
};

async function handler(conn, { message, args }) {
  const query = args.join(' ');
  if (!query) {
    return conn.sendMessage(message.key.remoteJid, {
      text: '*🎶 Escribe el nombre de una canción para reproducirla.*\n\n> Ejemplo: `play Peso Pluma - LUNA`',
      contextInfo
    }, { quoted: message });
  }

  await conn.sendMessage(message.key.remoteJid, {
    text: `🔍 *Buscando:* ${query}\n🎧 Preparando audio...`,
    contextInfo
  }, { quoted: message });

  try {
    const searchRes = await axios.get(`https://api.vreden.my.id/api/ytplaymp3?query=${encodeURIComponent(query)}`, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const result = searchRes.data?.result;

    if (!searchRes.data.status || !result || !result.download || !result.title || !result.thumbnail) {
      throw new Error("No se pudo obtener información válida del audio.");
    }

    const { title, thumbnail, download } = result;

    const caption = `
╭─「 🎶 *REPRODUCIENDO* 」─╮
│ 📌 *Título:* ${title}
│ 🔗 *YouTube:* https://youtube.com
╰──────────────────────╯`.trim();

    await conn.sendMessage(message.key.remoteJid, {
      image: { url: thumbnail },
      caption,
      contextInfo
    }, { quoted: message });

    await conn.sendMessage(message.key.remoteJid, {
      audio: { url: download },
      fileName: `${title}.mp3`,
      mimetype: "audio/mpeg",
      ptt: false,
      contextInfo: forwardedContextInfo
    }, { quoted: message });

  } catch (err) {
    console.error("Error completo:", err);
    await conn.sendMessage(message.key.remoteJid, {
      text: `❌ *Ocurrió un error al procesar la canción.*\n\n🛠️ ${err.message}`,
      contextInfo
    }, { quoted: message });
  }
}

module.exports = {
  command: 'play',
  handler,
};