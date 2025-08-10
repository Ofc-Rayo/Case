const axios = require('axios');
const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'; // Miniatura evocadora, puedes cambiarla por otra más acorde al reel

const contextInfo = {
  externalAdReply: {
    title: '🎥 Instagram Ritual',
    body: 'Reels que cruzan el umbral del éter...',
    mediaType: 1,
    previewType: 0,
    mediaUrl: null,
    sourceUrl: 'https://instagram.com',
    thumbnailUrl
  }
};

async function handler(conn, { message, args }) {
  const jid = message.key.remoteJid;
  const quoted = message;
  const url = args[0];

  if (!url || !url.includes('instagram.com')) {
    return conn.sendMessage(jid, {
      text: '*📸 ¿Dónde está el portal?*\n\n> Ingresa un enlace válido de Instagram para invocar el reel.',
      contextInfo
    }, { quoted });
  }

  await conn.sendMessage(jid, {
    text: '⌛ *Invocando el ritual desde Instagram...*',
    contextInfo
  }, { quoted });

  try {
    const api = `https://apis-starlights-team.koyeb.app/starlight/instagram-dl?url=${encodeURIComponent(url)}`;
    const res = await axios.get(api);
    const data = res.data?.data?.[0];

    if (!data || data.type !== 'video' || !data.dl_url) {
      return conn.sendMessage(jid, {
        text: '📭 *No se pudo abrir el portal del reel.*\n\n> Verifica el enlace o intenta más tarde.',
        contextInfo
      }, { quoted });
    }

    const caption = `
╭─「 🎥 𝙄𝙉𝙎𝙏𝘼𝙂𝙍𝘼𝙈 - 𝙍𝙄𝙏𝙐𝘼𝙇 」─╮
│ 🔗 *Enlace:* ${url}
│ 📡 *Fuente:* Instagram API
╰────────────────────╯
*✨ Reel invocado con éxito...*
`.trim();

    await conn.sendMessage(jid, {
      video: { url: data.dl_url },
      caption,
      contextInfo,
      quoted
    });

    await conn.sendMessage(jid, {
      text: '✅ *Reel enviado.* ¿Deseas invocar otro o explorar más portales?',
      contextInfo
    }, { quoted });

  } catch (err) {
    console.error('[instadl] Error:', err.message);
    await conn.sendMessage(jid, {
      text: '🚫 *Ups... algo falló al intentar invocar el reel.*\n\n> Intenta más tarde o revisa el enlace.',
      contextInfo
    }, { quoted });
  }
}

module.exports = {
  command: 'ig',
  handler
};