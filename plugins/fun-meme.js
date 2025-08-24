const axios = require('axios');
const { default: fetch } = require('node-fetch');

async function handler(conn, { message }) {
  const from = message.key.remoteJid;

  try {
    const res = await axios.get('https://meme-api.com/gimme/SpanishMemes');

    if (!res.data || !res.data.url) {
      return conn.sendMessage(from, {
        text: '❌ No pude obtener un meme ahora. Intenta luego.',
      }, { quoted: message });
    }

    const memeUrl = res.data.url;
    const title = res.data.title || 'Meme en español';

    // 🧿 Descarga del contenido visual
    const response = await fetch(memeUrl);
    const buffer = await response.buffer();

    // 🎭 Envío del meme con atmósfera
    await conn.sendMessage(from, {
      image: buffer,
      caption: `🤣 *${title}*`,
    }, { quoted: message });

  } catch (e) {
    console.error('💥 [DEBUG] Error en comando memes:', e);
    await conn.sendMessage(from, {
      text: '⚠️ Error obteniendo el meme. Intenta más tarde.',
    }, { quoted: message });
  }
}

module.exports = {
  command: 'memes',
  handler,
};