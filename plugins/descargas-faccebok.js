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
    thumbnailUrl: 'https://qu.ax/MvYPM.jpg'
  }
};

async function handler(conn, { message, args }) {
  const jid    = message.key.remoteJid;
  const quoted = message;
  const url    = args[0];

  // 1. Validación del enlace
  if (!url || !url.includes('facebook.com')) {
    return conn.sendMessage(
      jid,
      {
        text: '*🎥 Invocación fallida*\n\n> Proporciona un enlace válido de Facebook para descargar el video.',
        contextInfo
      },
      { quoted }
    );
  }

  // 2. Mensaje ritual de inicio
  await conn.sendMessage(
    jid,
    {
      text: '⌛ *Abriendo el portal de Facebook...*',
      contextInfo
    },
    { quoted }
  );

  try {
    // 3. Llamada a la API v3/fb2
    const apiUrl = `https://api.dorratz.com/v3/fb2?url=${encodeURIComponent(url)}`;
    const res    = await axios.get(apiUrl);

    // 4. Dump completo para debug
    console.log('[fb][DEBUG] res.data =', JSON.stringify(res.data, null, 2));

    const data = res.data;
    // 5. Validación estricta de campos
    if (!data || (!data.hd && !data.sd)) {
      console.warn('[fb][WARN] Formato inesperado de la API:', data);
      throw new Error('Formato inesperado de la API');
    }

    // 6. Selección de calidad
    const videoUrl   = data.hd || data.sd;
    const resolution = data.hd ? 'HD' : 'SD';
    const thumbUrl   = data.thumbnail;
    const title      = data.title || 'Facebook Video';
    const durationMs = data.duration_ms || 0;
    const durationSec = Math.floor(durationMs / 1000);
    const minutes     = String(Math.floor(durationSec / 60)).padStart(2, '0');
    const seconds     = String(durationSec % 60).padStart(2, '0');

    // 7. Descarga de miniatura
    const thumbBuffer = await fetch(thumbUrl).then(r => r.buffer());

    // 8. Pie de caja ritual
    const caption = `
╭─「 🎬 𝙁𝘼𝘾𝙀𝘽𝙊𝙊𝙆 - 𝙍𝙄𝙏𝙐𝘼𝙇 」─╮
│ 🔗 Enlace: ${url}
│ 🏷️ Título: ${title}
│ 📺 Calidad: ${resolution}
│ ⏱️ Duración: ${minutes}:${seconds}
╰────────────────────────╯
*✨ Portal abierto con éxito…*
`.trim();

    // 9. Envío del video con miniatura
    await conn.sendMessage(
      jid,
      {
        video:         { url: videoUrl },
        caption,
        jpegThumbnail: thumbBuffer,
        contextInfo
      },
      { quoted }
    );

    // 10. Confirmación final
    await conn.sendMessage(
      jid,
      {
        text: '✅ *Video invocado.* ¿Deseas descargar otra joya de Facebook?',
        contextInfo
      },
      { quoted }
    );

  } catch (err) {
    // Detalle del error en consola
    console.error('[fb][ERROR DETALLE]', err.response?.data || err.message);

    // Mensaje dinámico al usuario
    const userMsg = err.message.includes('Formato inesperado')
      ? 'La API devolvió un formato inesperado. Revisa los logs.'
      : 'Verifica el enlace o intenta más tarde.';

    await conn.sendMessage(
      jid,
      {
        text: `
🚫 *Algo salió mal al invocar el video de Facebook.*

> ${userMsg}
`,
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