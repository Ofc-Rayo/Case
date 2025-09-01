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

    if (!result?.status || !result.download?.url) {
      throw new Error("No se pudo obtener el audio.");
    }

    const { metadata } = result;
    const ytUrl = metadata.url;

    // test
    const newApi = `https://myapiadonix.vercel.app/download/yt?url=${encodeURIComponent(ytUrl)}&format=mp3`;

    const dlRes = await axios.get(newApi);

    if (!dlRes.data?.url) {
      throw new Error("La nueva API no devolvió un enlace válido.");
    }

    const downloadUrl = dlRes.data.url;

    const caption = `
╭─「 🎶 *REPRODUCIENDO* 」─╮
│ 📌 *Título:* ${metadata.title}
│ 🎤 *Autor:* ${metadata.author.name}
│ ⏱️ *Duración:* ${metadata.duration.timestamp}
│ 🔗 *YouTube:* ${metadata.url}
╰──────────────────────╯`.trim();

    await conn.sendMessage(message.key.remoteJid, {
      image: { url: metadata.thumbnail },
      caption,
      contextInfo
    }, { quoted: message });

    await conn.sendMessage(message.key.remoteJid, {
      audio: { url: downloadUrl },
      fileName: `${metadata.title}.mp3`,
      mimetype: "audio/mp4",
      ptt: false,
      contextInfo: forwardedContextInfo
    }, { quoted: message });

  } catch (err) {
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