// plugins/fb.js
const axios = require('axios');
const fetch = require('node-fetch');

const THUMB_DEFAULT = 'https://qu.ax/MvYPM.jpg';

const responderError = async (conn, m, tipo, mensaje) => {
  await conn.sendMessage(m.chat, {
    text: `💥 *Ruptura en el flujo:*\n\n${mensaje}\n\n≡ 🧩 *Tipo:* ${tipo}`,
    contextInfo: {
      externalAdReply: {
        title: '⚠️ Zenitsu Bot - Error',
        body: 'Algo interrumpió la respiración...',
        thumbnailUrl: THUMB_DEFAULT,
        sourceUrl: 'https://facebook.com'
      }
    }
  }, { quoted: m });
};

let handler = async (m, { conn, args, usedPrefix, command }) => {
  const url = args?.[0];
  if (!url || !url.includes("facebook.com")) {
    return conn.sendMessage(m.chat, {
      text: `🧠 *Respiración interrumpida...*\n\nIngresa un enlace válido de Facebook.\n\n📌 Ejemplo:\n${usedPrefix}${command} https://www.facebook.com/share/v/12DoEUCoFji/`,
      contextInfo: {
        externalAdReply: {
          title: 'Zenitsu Bot - Validación',
          body: 'Solo enlaces del dominio Facebook son aceptados.',
          thumbnailUrl: THUMB_DEFAULT,
          sourceUrl: 'https://facebook.com'
        }
      }
    }, { quoted: m });
  }

  await m.react("⚡");

  try {
    const apiUrl = `https://api.dorratz.com/fbvideo?url=${encodeURIComponent(url)}`;
    console.log(`🔮 Zenitsu invoca: ${apiUrl}`);

    const res = await axios.get(apiUrl);
    const videos = res.data;

    if (!Array.isArray(videos) || videos.length === 0) {
      await m.react("❌");
      return responderError(conn, m, "Sin resultados", "No se encontró contenido descargable en el enlace.");
    }

    const videoData = videos.find(v => v.resolution.includes('720p')) || videos[0];
    const videoUrl = videoData.url;
    const thumbUrl = videoData.thumbnail || THUMB_DEFAULT;
    const calidad = videoData.resolution;

    if (!videoUrl) {
      await m.react("❌");
      return responderError(conn, m, "Enlace inválido", "La API no devolvió un video válido.");
    }

    const thumbBuffer = await fetch(thumbUrl).then(r => r.buffer());

    const caption = `
╭─〔 ⚡ 𝙁𝘼𝘾𝙀𝘽𝙊𝙊𝙆 - 𝙍𝙀𝙎𝙋𝙄𝙍𝘼𝘾𝙄𝙊𝙉 𝙁𝙄𝙉𝘼𝙇 ⚡ 〕─╮
│ 🎬 *Calidad:* ${calidad}
│ 🌐 *Fuente:* Facebook
│ 🔗 *Enlace:* ${url}
╰────────────────────────────╯
*Zenitsu ha cortado el enlace con precisión.*
`.trim();

    await conn.sendMessage(m.chat, {
      video: { url: videoUrl },
      caption,
      jpegThumbnail: thumbBuffer,
      contextInfo: {
        externalAdReply: {
          title: '⚡ Zenitsu Bot - Descarga completada',
          body: 'Respiración del trueno: Sexta forma',
          thumbnailUrl: thumbUrl,
          sourceUrl: url
        }
      }
    }, { quoted: m });

    await m.react("✅");

  } catch (err) {
    console.error("🔥 Zenitsu falló:", err);
    await responderError(conn, m, "Excepción", err.message);
  }
};

handler.command = 'fb';
module.exports = handler;