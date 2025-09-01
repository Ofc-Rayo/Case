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

async function handler(conn, { message, args }) {
  const query = args.join(' ');
  if (!query) {
    return conn.sendMessage(message.key.remoteJid, {
      text: '*😰 Zenitsu se quedó sin ritmo...*\n\n> Ejemplo: `play DJ malam pagi slowed` 🎶',
      contextInfo
    }, { quoted: message });
  }

  // Aviso de búsqueda
  await conn.sendMessage(message.key.remoteJid, {
    text: `🔎 *Buscando en YouTube...*\n🎞️ Afinando melodías de *${query}*...`,
    contextInfo
  }, { quoted: message });

  try {
    // Llamada única a la API de búsqueda + conversión
    const apiUrl = `https://api.vreden.my.id/api/ytplaymp3?query=${encodeURIComponent(query)}`;
    const res = await axios.get(apiUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
    const result = res.data?.result;

    // Validación escénica
    if (!result?.status || !result.download?.status) {
      return conn.sendMessage(message.key.remoteJid, {
        text: `😢 *Zenitsu no pudo convertir el audio de:* ${query}\n\n🛠️ Converting error\n🎭 ¿Intentamos con otro título más claro o menos viral?`,
        contextInfo
      }, { quoted: message });
    }

    const { metadata, download } = result;

    // Mostrar miniatura y datos
    const caption = `
╭─「 🎧 𝙕𝙀𝙉𝙄𝙏𝙎𝙐 - 𝙔𝙏𝙋𝙇𝘼𝙔𝙈𝙋𝟯 」─╮
│ 🎬 *Título:* ${metadata.title}
│ 👤 *Autor:* ${metadata.author.name}
│ ⏱️ *Duración:* ${metadata.duration.timestamp}
│ 👁️ *Vistas:* ${metadata.views.toLocaleString()}
│ 🔗 *YouTube:* ${metadata.url}
╰────────────────────────────╯
`.trim();

    await conn.sendMessage(message.key.remoteJid, {
      image: { url: metadata.thumbnail },
      caption,
      contextInfo
    }, { quoted: message });

    // Envío del audio
    await conn.sendMessage(message.key.remoteJid, {
      audio: { url: download.url },
      fileName: download.filename,
      mimetype: "audio/mp4",
      ptt: false,
      contextInfo
    }, { quoted: message });

    // El audio es el cierre natural de Zenitsu

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