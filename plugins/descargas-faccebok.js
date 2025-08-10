const axios = require('axios');
const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'; // Miniatura ritual

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
    const api = `https://delirius-apiofc.vercel.app/download/facebook?url=${encodeURIComponent(url)}`;
    const res = await axios.get(api);
    const data = res.data;

    const videoHd = data.urls?.[0]?.hd;
    const videoSd = data.urls?.[1]?.sd;
    const videoUrl = videoHd || videoSd;
    const calidad = videoHd ? 'HD' : videoSd ? 'SD' : 'Desconocida';

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
│ 🌐 *Fuente:* Delirius API
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
    console.error('[fb-delirius] Error:', err.message);
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