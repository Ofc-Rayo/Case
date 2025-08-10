const axios = require('axios');
const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'; // Miniatura ritual, puedes cambiarla por otra más dramática

const contextInfo = {
  externalAdReply: {
    title: '🎬 Facebook Ritual',
    body: 'Videos que cruzan el umbral del trueno...',
    mediaType: 1,
    previewType: 0,
    mediaUrl: null,
    sourceUrl: 'https://facebook.com',
    thumbnailUrl
  }
};

async function handler(conn, { message, args }) {
  const jid = message.key.remoteJid;
  const quoted = message;
  const url = args[0];

  if (!url || !url.includes('facebook.com')) {
    return conn.sendMessage(jid, {
      text: '*📘 ¿Dónde está el portal?*\n\n> Ingresa un enlace válido de Facebook para invocar el video.',
      contextInfo
    }, { quoted });
  }

  await conn.sendMessage(jid, {
    text: '⚡ *Zenitsu está cargando la respiración...*',
    contextInfo
  }, { quoted });

  try {
    const api = `https://api.dorratz.com/fbvideo?url=${encodeURIComponent(url)}`;
    const res = await axios.get(api);
    const videos = res.data;

    if (!Array.isArray(videos) || videos.length === 0) {
      return conn.sendMessage(jid, {
        text: '📭 *No se pudo abrir el portal del video.*\n\n> Verifica el enlace o intenta más tarde.',
        contextInfo
      }, { quoted });
    }

    const videoData = videos.find(v => v.resolution.includes('720p')) || videos[0];
    const videoUrl = videoData.url;
    const calidad = videoData.resolution;

    if (!videoUrl) {
      return conn.sendMessage(jid, {
        text: '🚫 *La API no devolvió un enlace válido.*\n\n> Intenta con otro video.',
        contextInfo
      }, { quoted });
    }

    const caption = `
╭─「 🎬 𝙁𝘼𝘾𝙀𝘽𝙊𝙊𝙆 - 𝙍𝙄𝙏𝙐𝘼𝙇 」─╮
│ 🔗 *Enlace:* ${url}
│ 📺 *Calidad:* ${calidad}
│ 🌐 *Fuente:* Facebook API
╰────────────────────────╯
*⚡ Video invocado con éxito...*
`.trim();

    await conn.sendMessage(jid, {
      video: { url: videoUrl },
      caption,
      contextInfo,
      quoted
    });

    await conn.sendMessage(jid, {
      text: '✅ *Video enviado.* ¿Deseas invocar otro portal?',
      contextInfo
    }, { quoted });

  } catch (err) {
    console.error('[fb] Error:', err.message);
    await conn.sendMessage(jid, {
      text: '🚫 *Ups... algo falló al intentar invocar el video.*\n\n> Intenta más tarde o revisa el enlace.',
      contextInfo
    }, { quoted });
  }
}

module.exports = {
  command: 'fb',
  handler
};