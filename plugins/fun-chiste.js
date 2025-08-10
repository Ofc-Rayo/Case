const axios = require('axios');

async function handler(conn, { message }) {
  try {
    // Esta API da frases graciosas en español
    const res = await axios.get('https://api.adviceslip.com/advice');
    const advice = res.data.slip.advice;

    await conn.sendMessage(message.key.remoteJid, {
      text: `😂 Aquí tienes un chiste/frase divertida:\n\n"${advice}"`,
    }, { quoted: message });
  } catch (e) {
    await conn.sendMessage(message.key.remoteJid, { text: '⚠️ No pude obtener una frase divertida. Intenta luego.' });
  }
}

module.exports = {
  command: 'chiste',
  handler,
};