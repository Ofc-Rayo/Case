const axios = require('axios');

async function handler(conn, { message, args }) {
  const query = args.join(' ');
  if (!query) {
    return conn.sendMessage(message.key.remoteJid, {
      text: '*😰 ¡Zenitsu necesita saber qué video buscar!*\n\n> Ejemplo: `xnxx bokep` 🔞',
    });
  }

  try {
    // Buscar videos
    const searchRes = await axios.get(`https://api.vreden.my.id/api/xnxxsearch?query=${encodeURIComponent(query)}`);
    if (!searchRes.data || searchRes.data.status !== 200 || !Array.isArray(searchRes.data.result) || searchRes.data.result.length === 0) {
      return conn.sendMessage(message.key.remoteJid, {
        text: '*🔍 Zenitsu no encontró resultados...*\n\n> Intenta con otro término, por favor.',
      });
    }

    // Tomar solo los primeros 3 resultados
    const top3 = searchRes.data.result.slice(0, 3);

    for (const video of top3) {
      try {
        // Descargar video
        const dlRes = await axios.get(`https://api.vreden.my.id/api/xnxxdl?query=${encodeURIComponent(video.link)}`);
        if (!dlRes.data || dlRes.data.status !== 200 || !dlRes.data.result || !dlRes.data.result.result) {
          await conn.sendMessage(message.key.remoteJid, {
            text: `❌ No se pudo descargar el video: ${video.title}`,
          });
          continue;
        }

        const videoData = dlRes.data.result.result;

        // Elegir calidad alta si existe, si no la baja
        const videoUrl = videoData.files.high || videoData.files.low;

        if (!videoUrl) {
          await conn.sendMessage(message.key.remoteJid, {
            text: `❌ No se encontró URL válida para el video: ${video.title}`,
          });
          continue;
        }

        // Enviar video con caption
        await conn.sendMessage(message.key.remoteJid, {
          video: { url: videoUrl },
          caption: `🎬 *${videoData.title}*\n⏳ Duración: ${videoData.duration}s\n🔗 ${videoData.URL}`,
        }, { quoted: message });
      } catch (e) {
        await conn.sendMessage(message.key.remoteJid, {
          text: `⚠️ Error descargando video: ${video.title}`,
        });
      }
    }
  } catch (err) {
    await conn.sendMessage(message.key.remoteJid, {
      text: '*❌ Algo salió mal en la búsqueda o descarga.*\n\n> Intenta de nuevo más tarde.',
    });
  }
}

module.exports = {
  command: 'xnxx',
  handler,
};