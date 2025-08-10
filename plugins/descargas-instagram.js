const axios = require('axios');
const fetch = require('node-fetch');

async function handler(conn, { message, args }) {
  const jid = message.key.remoteJid;
  const replyTo = message.key;
  const url = args[0];

  if (!url || !url.includes('instagram.com')) {
    return conn.sendMessage(jid, {
      text: '*📸 Zenitsu necesita un enlace válido de Instagram.*\n\n> Ejemplo: `ig https://www.instagram.com/reel/...`',
      quoted: message
    });
  }

  const traceId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  await conn.sendMessage(jid, {
    text: `🔮 *Invocando el reel...*\n> id: ${traceId}`,
    quoted: message
  });

  try {
    const api = `https://apis-starlights-team.koyeb.app/starlight/instagram-dl?url=${encodeURIComponent(url)}`;
    const res = await axios.get(api);
    const data = res.data?.data?.[0];

    if (!data || data.type !== 'video' || !data.dl_url) {
      throw new Error('No se pudo obtener el video.');
    }

    const videoUrl = data.dl_url;
    const thumbUrl = 'https://qu.ax/MvYPM.jpg'; // Puedes cambiarla por una dinámica si lo deseas
    const thumbBuffer = await fetch(thumbUrl).then(res => res.buffer());

    await conn.sendMessage(jid, {
      video: { url: videoUrl },
      caption: `🎥 *Reel invocado con éxito*\n🧩 Rastreo: ${traceId}\n🧙‍♂️ Fuente: Instagram`,
      quoted: message,
      jpegThumbnail: thumbBuffer,
      contextInfo: {
        externalAdReply: {
          title: 'Reel ritual',
          body: 'Zenitsu ha cruzado el portal de Instagram',
          mediaType: 1,
          previewType: 'VIDEO',
          thumbnailUrl: thumbUrl,
          sourceUrl: url,
          renderLargerThumbnail: true
        }
      }
    });

  } catch (err) {
    console.error(`[instadl][${traceId}]`, err?.message || err);
    await conn.sendMessage(jid, {
      text: '*⚠️ El portal de Instagram se cerró...*\n\n> Intenta nuevamente más tarde o verifica el enlace.',
      quoted: message,
      contextInfo: {
        externalAdReply: {
          title: 'Error de invocación',
          body: 'Zenitsu no pudo cruzar el umbral',
          thumbnailUrl: 'https://qu.ax/MvYPM.jpg'
        }
      }
    });
  }
}

module.exports = {
  command: 'ig',
  handler
};