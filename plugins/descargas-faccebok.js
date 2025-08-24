const axios = require('axios');
const thumbnailUrl = 'https://qu.ax/0XKxP.jpg'; // Miniatura simbólica del portal Facebook

const contextInfo = {
  externalAdReply: {
    title: '📘 Facebook Ritual',
    body: 'Videos que emergen del archivo emocional de Meta...',
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

  if (!url || !url.includes('facebook.com')) {
    return conn.sendMessage(jid, {
      text: '*📘 ¿Dónde está el portal de Meta?*\n\n> Ingresa un enlace válido de Facebook para invocar el video.',
      contextInfo
    }, { quoted });
  }

  await conn.sendMessage(jid, {
    text: '🔮 *Invocando el archivo emocional desde Facebook...*',
    contextInfo
  }, { quoted });

  try {
    const api = `https://api.vreden.my.id/api/fbdl?url=${encodeURIComponent(url)}`;
    const res = await axios.get(api);
    const data = res.data?.data;

    if (!data || !data.hd_url) {
      return conn.sendMessage(jid, {
        text: '📭 *No se pudo abrir el portal del recuerdo.*\n\n> Verifica el enlace o intenta más tarde.',
        contextInfo
      }, { quoted });
    }

    const caption = `
╭─「 📘 𝙁𝘼𝘾𝙀𝘽𝙊𝙊𝙆 - 𝙍𝙄𝙏𝙐𝘼𝙇 」─╮
│ 🔗 *Enlace:* ${url}
│ 🧠 *Origen:* api.vreden.my.id
╰────────────────────╯
*✨ Video invocado con éxito...*
`.trim();

    await conn.sendMessage(jid, {
      video: { url: data.hd_url },
      caption,
      contextInfo,
      quoted
    });

    await conn.sendMessage(jid, {
      text: '✅ *Video enviado.* ¿Deseas invocar otro recuerdo o abrir otro portal?',
      contextInfo
    }, { quoted });

  } catch (err) {
    console.error('[fbdl] Error:', err.message);
    await conn.sendMessage(jid, {
      text: '🚫 *Ups... el archivo emocional se resistió a ser invocado.*\n\n> Intenta más tarde o revisa el enlace.',
      contextInfo
    }, { quoted });
  }
}

module.exports = {
  command: 'fb',
  handler
};