const axios = require('axios');

const thumbnailUrl = 'https://qu.ax/QuwNu.jpg';

const contextInfo = {
  externalAdReply: {
    title: "🎧 YouTube Music",
    body: "Reproducción directa desde el universo viral...",
    mediaType: 1,
    previewType: 0,
    mediaUrl: "https://youtube.com",
    sourceUrl: "https://youtube.com",
    thumbnailUrl
  }
};

const DELIRIUS_API = "https://delirius-apiofc.vercel.app/download/ytmp3?url=";
const VREDEN_API   = "https://api.vreden.my.id/api/ytmp3?url=";

async function handler(conn, { message, args }) {
  const query = args.join(' ');
  if (!query) {
    return conn.sendMessage(message.key.remoteJid, {
      text: '*😰 Zenitsu se quedó sin ritmo...*\n\n> Ejemplo: `play summertime sadness` 🎶',
      contextInfo
    }, { quoted: message });
  }

  // Aviso de búsqueda
  await conn.sendMessage(message.key.remoteJid, {
    text: `🔎 *Buscando en YouTube...*\n🎞️ Afinando melodías de *${query}*...`,
    contextInfo
  }, { quoted: message });

  try {
    // 1) Buscar video en YouTube
    const searchRes = await axios.get(
      `https://api.vreden.my.id/api/yts?query=${encodeURIComponent(query)}`
    );
    const video = searchRes.data?.result?.all?.[0];

    if (!video) {
      return conn.sendMessage(message.key.remoteJid, {
        text: `😢 *Zenitsu no encontró transmisiones para:* ${query}\n🌧️ El universo musical se quedó en silencio...`,
        contextInfo
      }, { quoted: message });
    }

    // 2) Mostrar miniatura y datos
    const caption = `
╭─「 🎧 𝙕𝙀𝙉𝙄𝙏𝙎𝙐 - 𝙔𝙊𝙐𝙏𝙐𝘽𝙀 」─╮
│ 🎬 *Título:* ${video.title}
│ 👤 *Autor:* ${video.author.name}
│ ⏱️ *Duración:* ${video.duration.timestamp}
│ 👁️ *Vistas:* ${video.views.toLocaleString()}
│ 🔗 *YouTube:* ${video.url}
╰────────────────────────────╯
`.trim();

    await conn.sendMessage(message.key.remoteJid, {
      image: { url: video.thumbnail },
      caption,
      contextInfo
    }, { quoted: message });

    // 3) Intento principal: Delirius
    let audioData;
    try {
      const delRes = await axios.get(
        `${DELIRIUS_API}${encodeURIComponent(video.url)}`,
        { headers: { "User-Agent": "Mozilla/5.0" } }
      );
      audioData = delRes.data?.data;
    } catch (err) {
      // Si Delirius bloquea con 403, Zenitsu invoca el plan B
      if (err.response?.status === 403) {
        await conn.sendMessage(message.key.remoteJid, {
          text: `🔒 *Hechizo Delirius bloqueado.*\n🛠️ Código 403\n🎭 Invocando plan B...`,
          contextInfo
        }, { quoted: message });

        const vreRes = await axios.get(
          `${VREDEN_API}${encodeURIComponent(video.url)}`,
          { headers: { "User-Agent": "Mozilla/5.0" } }
        );
        audioData = vreRes.data?.result;
      } else {
        throw err;
      }
    }

    // 4) Validación de resultado
    if (!audioData?.download?.url) {
      return conn.sendMessage(message.key.remoteJid, {
        text: `😢 *Zenitsu no pudo convertir el audio de:* ${video.title}\n\n🛠️ Converting error\n🎭 ¿Intentamos con otro título más claro o menos viral?`,
        contextInfo
      }, { quoted: message });
    }

    // 5) Envío del audio
    await conn.sendMessage(message.key.remoteJid, {
      audio: { url: audioData.download.url },
      fileName: audioData.download.filename,
      mimetype: "audio/mp4",
      ptt: false,
      contextInfo
    }, { quoted: message });

    // Fin natural: el audio es la última nota

  } catch (err) {
    console.error("⚠️ Error en el comando play:", err.message);
    await conn.sendMessage(message.key.remoteJid, {
      text: `❌ *Error inesperado en la reproducción.*\n\n🛠️ ${err.message}\n🌧️ Zenitsu está revisando los cables del universo...`,
      contextInfo
    }, { quoted: message });
  }
}

module.exports = {
  command: 'play',
  handler,
};