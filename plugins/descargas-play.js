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

    const apis = [
      `https://apis.davidcyriltech.my.id/youtube/mp3?url=${ytUrl}`,
      `https://api.ryzendesu.vip/api/downloader/ytmp3?url=${ytUrl}`
    ];

    let downloadInfo = null;

    for (const api of apis) {
      try {
        const dlRes = await axios.get(api);
        if (dlRes.data?.url || dlRes.data?.result?.url) {
          downloadInfo = dlRes.data.url ? dlRes.data : dlRes.data.result;
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (!downloadInfo?.url) {
      throw new Error("No se pudo descargar el audio desde ninguna API.");
    }

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
      audio: { url: downloadInfo.url },
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