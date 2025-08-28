const axios = require('axios');

async function handler(conn, { message, args }) {
  const jid = message.key.remoteJid;
  const isGroup = jid.endsWith('@g.us');
  
  
  if (isGroup) {
    const { getNsfwStatus } = require('../main');
    const nsfwEnabled = getNsfwStatus(jid);
    
    if (nsfwEnabled === 'off') {
      return conn.sendMessage(jid, {
        text: '🔞 *Contenido NSFW deshabilitado en este grupo.*\n\n> Los administradores pueden activarlo con: `nsfw on`\n\n> Zenitsu está aliviado... ¡estos comandos le dan mucha vergüenza! 😳',
      }, { quoted: message });
    }
  }

  const query = args.join(' ');
  if (!query) {
    return conn.sendMessage(jid, {
      text: '*😰 ¡Zenitsu necesita saber qué video buscar!*\n\n> Ejemplo: `xnxx bokep` 🔞',
    });
  }

  try {
    
    const searchRes = await axios.get(`https://api.vreden.my.id/api/xnxxsearch?query=${encodeURIComponent(query)}`);
    if (!searchRes.data || searchRes.data.status !== 200 || !Array.isArray(searchRes.data.result) || searchRes.data.result.length === 0) {
      return conn.sendMessage(message.key.remoteJid, {
        text: '*🔍 Zenitsu no encontró resultados...*\n\n> Intenta con otro término, por favor.',
      });
    }

    
    const top3 = searchRes.data.result.slice(0, 3);

    for (const video of top3) {
      try {
        
        const dlRes = await axios.get(`https://api.vreden.my.id/api/xnxxdl?query=${encodeURIComponent(video.link)}`);
        if (!dlRes.data || dlRes.data.status !== 200 || !dlRes.data.result || !dlRes.data.result.result) {
          await conn.sendMessage(jid, {
            text: `❌ No se pudo descargar el video: ${video.title}`,
          });
          continue;
        }

        const videoData = dlRes.data.result.result;

        
        const videoUrl = videoData.files.high || videoData.files.low;

        if (!videoUrl) {
          await conn.sendMessage(jid, {
            text: `❌ No se encontró URL válida para el video: ${video.title}`,
          });
          continue;
        }

        
        await conn.sendMessage(jid, {
          video: { url: videoUrl },
          caption: `🎬 *${videoData.title}*\n⏳ Duración: ${videoData.duration}s\n🔗 ${videoData.URL}`,
        }, { quoted: message });
      } catch (e) {
        await conn.sendMessage(jid, {
          text: `⚠️ Error descargando video: ${video.title}`,
        });
      }
    }
  } catch (err) {
    await conn.sendMessage(jid, {
      text: '*❌ Algo salió mal en la búsqueda o descarga.*\n\n> Intenta de nuevo más tarde.',
    });
  }
}

module.exports = {
  command: 'xnxx',
  handler,
};