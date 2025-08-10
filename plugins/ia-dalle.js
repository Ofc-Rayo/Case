const axios = require('axios');

async function handler(conn, { message, args }) {
  const prompt = args.join(' ');
  if (!prompt) {
    return conn.sendMessage(message.key.remoteJid, {
      text: '*⚠️ Necesitas escribir un prompt para generar la imagen AI.*\n\nEjemplo: .aiimg gato gris',
    });
  }

  try {
    const url = `https://api.dorratz.com/v3/ai-image?prompt=${encodeURIComponent(prompt)}&ratio=9:19`;
    const res = await axios.get(url);
    if (res.data && res.data.data && res.data.data.image_link) {
      await conn.sendMessage(message.key.remoteJid, {
        image: { url: res.data.data.image_link },
        caption: `✨ Imagen AI generada para: *${prompt}*`,
      }, { quoted: message });
    } else {
      await conn.sendMessage(message.key.remoteJid, {
        text: '❌ No se pudo generar la imagen. Intenta con otro prompt.',
      });
    }
  } catch (error) {
    await conn.sendMessage(message.key.remoteJid, {
      text: '⚠️ Error al generar la imagen AI. Intenta más tarde.',
    });
  }
}

module.exports = {
  command: 'dalle2',
  handler,
};