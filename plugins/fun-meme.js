const axios = require('axios');

async function handler(conn, { message }) {
  try {
    const res = await axios.get('https://api.vreden.my.id/api/meme');
    if (res.data.status !== 200 || !res.data.result) {
      return conn.sendMessage(message.key.remoteJid, { text: '❌ No se pudo obtener un meme en este momento.' });
    }

    const memeUrl = res.data.result;

    await conn.sendMessage(message.key.remoteJid, {
      image: { url: memeUrl },
      caption: '🤣 Aquí tienes un meme para ti!',
    }, { quoted: message });
  } catch (e) {
    await conn.sendMessage(message.key.remoteJid, { text: '⚠️ Error al obtener el meme. Intenta más tarde.' });
  }
}

module.exports = {
  command: 'meme',
  handler,
};