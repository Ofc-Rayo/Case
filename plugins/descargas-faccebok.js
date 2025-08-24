const axios = require('axios');
const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'; // Miniatura evocadora

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

  // 1. Validación del enlace
  if (!url || !url.includes('facebook.com')) {
    return conn.sendMessage(
      jid,
      {
        text: '📘 ¿Dónde está el portal?\n\n> Ingresa un enlace válido de Facebook para invocar el video.',
        contextInfo
      },
      { quoted }
    );
  }

  // 2. Mensaje de carga inicial
  await conn.sendMessage(
    jid,
    {
      text: '⚡ Zenitsu está cargando la respiración...',
      contextInfo
    },
    { quoted }
  );

  try {
    // 3. Llamada a la API de Vreden
    const api = `https://api.vreden.my.id/api/fbdl?url=${encodeURIComponent(url)}`;
    const res = await axios.get(api);
    const data = res.data?.data;

    // 4. Selección de URL de video y calidad
    const videoUrl = data?.hd_url || data?.sd_url;
    const calidad = data?.hd_url ? 'HD' : data?.sd_url ? 'SD' : 'Desconocida';

    if (!videoUrl) {
      return conn.sendMessage(
        jid,
        {
          text: '🚫 La API no devolvió un enlace válido.\n\n> Intenta con otro video.',
          contextInfo
        },
        { quoted }
      );
    }

    // 5. Validación ceremonial de disponibilidad y tipo
    try {
      const head = await axios.head(videoUrl);
      const contentType = head.headers['content-type'] || '';
      if (!contentType.includes('video')) {
        return conn.sendMessage(
          jid,
          {
            text: '🚫 El enlace no parece ser un video reproducible.\n\n> Intenta con otro.',
            contextInfo
          },
          { quoted }
        );
      }
    } catch {
      return conn.sendMessage(
        jid,
        {
          text: '🚫 No se pudo acceder al video.\n\n> Puede que esté protegido o haya expirado.',
          contextInfo
        },
        { quoted }
      );
    }

    // 6. Preparación de la leyenda
    const caption = `
╭─「 🎬 𝙁𝘼𝘾𝙀𝘽𝙊𝙊𝙆 - 𝙍𝙄𝙏𝙐𝘼𝙇 」─╮
│ 🔗 Enlace: ${url}
│ 📺 Calidad: ${calidad}
│ 🌐 Fuente: Vreden API
╰────────────────────────╯
⚡ Video invocado con éxito...
`.trim();

    // 7. Envío del video
    await conn.sendMessage(
      jid,
      {
        video: { url: videoUrl },
        caption,
        contextInfo
      },
      { quoted }
    );

    // 8. Mensaje de cierre
    await conn.sendMessage(
      jid,
      {
        text: '✅ Video enviado. ¿Deseas invocar otro portal?',
        contextInfo
      },
      { quoted }
    );

  } catch (err) {
    console.error('[fb-vreden] Error:', err.message);
    await conn.sendMessage(
      jid,
      {
        text: '🚫 Ups... algo falló al intentar invocar el video.\n\n> Intenta más tarde o revisa el enlace.',
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