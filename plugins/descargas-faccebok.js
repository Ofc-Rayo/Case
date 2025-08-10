const axios = require('axios');
const fetch = require('node-fetch');

const contextInfo = {
  externalAdReply: {
    title: '🎬 Facebook Ritual',
    body: 'Videos que cruzan el umbral del éter…',
    mediaType: 1,
    previewType: 0,
    mediaUrl: null,
    sourceUrl: 'https://facebook.com',
    thumbnailUrl: 'https://qu.ax/MvYPM.jpg' // miniatura evocadora por defecto
  }
};

async function handler(conn, { message, args }) {
  const jid = message.key.remoteJid;
  const quoted = message;
  const url = args[0];

  // Validación del enlace
  if (!url || !url.includes('facebook.com')) {
    return conn.sendMessage(
      jid,
      {
        text: '*🎥 ¿Dónde está el portal de Facebook?*\n\n> Proporciona un enlace válido de Facebook para invocar el video.',
        contextInfo
      },
      { quoted }
    );
  }

  // Mensaje ritual de invocación
  await conn.sendMessage(
    jid,
    {
      text: '⌛ *Invocando el ritual desde Facebook...*',
      contextInfo
    },
    { quoted }
  );

  try {
    // Llamada a la API
    const apiUrl = `https://api.dorratz.com/fbvideo?url=${encodeURIComponent(url)}`;
    const res = await axios.get(apiUrl);
    const videos = Array.isArray(res.data) ? res.data : [];

    if (!videos.length) {
      throw new Error('Respuesta vacía de la API');
    }

    // Elegir resolución para renderizar (shouldRender=true) o la primera
    const choice = videos.find(v => v.shouldRender) || videos[0];
    const videoUrl = choice.url;
    const thumbUrl = choice.thumbnail;

    // Descargar buffer de la miniatura
    const thumbBuffer = await fetch(thumbUrl).then(r => r.buffer());

    // Pie de caja ritual
    const caption = `
╭─「 🎬 𝙁𝘼𝘾𝙀𝘽𝙊𝙊𝙆 - 𝙍𝙄𝙏𝙐𝘼𝙇 」─╮
│ 🔗 Enlace: ${url}
│ 📺 Resolución: ${choice.resolution}
╰────────────────────────╯
*✨ Video invocado con éxito...*
`.trim();

    // Envío del video con miniatura y reply
    await conn.sendMessage(
      jid,
      {
        video: { url: videoUrl },
        caption,
        jpegThumbnail: thumbBuffer,
        contextInfo
      },
      { quoted }
    );

    // Confirmación final
    await conn.sendMessage(
      jid,
      {
        text: '✅ *Video enviado.* ¿Deseas invocar otro o explorar más portales?',
        contextInfo
      },
      { quoted }
    );

  } catch (err) {
    console.error('[fbvideo] Error:', err.message);
    await conn.sendMessage(
      jid,
      {
        text: '🚫 *Ups... algo falló al invocar el video de Facebook.*\n\n> Intenta más tarde o verifica el enlace.',
        contextInfo
      },
      { quoted }
    );
  }
}

module.exports = {
  command: 'fb',
  handler
};