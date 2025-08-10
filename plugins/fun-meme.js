const axios = require('axios');

async function handler(conn, { message }) {
  try {
    const res = await axios.get('https://meme-api.com/gimme/SpanishMemes');
    if (!res.data || !res.data.url) {
      return conn.sendMessage(message.key.remoteJid, { text: '❌ No pude obtener un meme ahora. Intenta luego.' });
    }

    const memeUrl = res.data.url;
    const title = res.data.title || 'Meme en español';

    await conn.sendMessage(message.key.remoteJid, {
      image: { url: memeUrl },
      caption: `🤣 *${title}*`,
    }, { quoted: message });

  } catch (e) {
    await conn.sendMessage(message.key.remoteJid, { text: '⚠️ Error obteniendo el meme. Intenta más tarde.' });
  }
}

module.exports = {
  command: 'memes',
  handler,
};