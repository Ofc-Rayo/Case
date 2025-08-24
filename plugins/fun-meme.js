// plugins/meme.js
const axios = require('axios');
const { default: fetch } = require('node-fetch');

async function handler(conn, { message, args }) {
  const from = message.key.remoteJid;
  const sender = message.key.participant || from;

  // 📝 Validación de argumentos
  if (args.length < 2) {
    return conn.sendMessage(from, {
      text: `*📜 Uso correcto del ritual:*\n\n> \`.meme TextoArriba TextoAbajo\``,
    }, { quoted: message });
  }

  const topText = args[0];
  const bottomText = args.slice(1).join(' ');

  try {
    // 🔍 Obtener plantillas disponibles
    const res = await axios.get('https://api.imgflip.com/get_memes');
    const memes = res.data.data.memes;
    const randomMeme = memes[Math.floor(Math.random() * memes.length)];

    // 🧪 Generar meme con texto
    const memeGenUrl = `https://api.imgflip.com/caption_image?template_id=${randomMeme.id}&username=imgflip_hubot&password=imgflip_hubot&text0=${encodeURIComponent(topText)}&text1=${encodeURIComponent(bottomText)}`;
    const memeRes = await axios.get(memeGenUrl);
    const finalUrl = memeRes.data?.data?.url;

    if (!finalUrl) {
      return conn.sendMessage(from, {
        text: '❌ No se pudo generar el meme. Intenta con otro texto.',
      }, { quoted: message });
    }

    // 🧿 Descargar imagen
    const imageRes = await fetch(finalUrl);
    const buffer = await imageRes.buffer();

    // 🎭 Enviar meme con atmósfera
    await conn.sendMessage(from, {
      image: buffer,
      caption: `🤣 *${randomMeme.name}*`,
    }, { quoted: message });

  } catch (err) {
    console.error('💥 [DEBUG] Error en comando meme:', err);
    await conn.sendMessage(from, {
      text: `*⚠️ El ritual fue interrumpido*\n\n> Zenitsu no pudo completar la invocación del meme.`,
    }, { quoted: message });
  }
}

module.exports = {
  command: 'meme',
  handler,
};