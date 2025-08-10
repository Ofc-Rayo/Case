// plugins/ttp.js

const axios = require('axios');
const path = require('path');

const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'; // Imagen dramática de Zenitsu

const contextInfo = {
  externalAdReply: {
    title: '⚡ Zenitsu-Bot',
    body: '¡Estoy temblando... pero convertiré tu texto en una obra de arte!',
    mediaType: 1,
    previewType: 0,
    mediaUrl: 'https://zenitsu.bot',
    sourceUrl: 'https://zenitsu.bot',
    thumbnailUrl,
  },
};

async function handler(conn, { message, args }) {
  const jid = message.key.remoteJid;
  const query = args.join(' ').trim();

  // Validar si se proporcionó un texto
  if (!query) {
    return conn.sendMessage(
      jid,
      {
        text: '😱 ¡¿Cómo que no escribiste nada?!\n\n> ¡No puedo convertir el aire en imagen, baka! 😤',
        contextInfo,
      },
      { quoted: message }
    );
  }

  // Aviso de “procesando”
  await conn.sendMessage(
    jid,
    {
      text: '⚡ *¡Mi mano tiembla! Pero estoy creando tu imagen... ¡con un solo destello!*',
      contextInfo,
    },
    { quoted: message }
  );

  // Construir la URL de la API
  const apiUrl = `https://delirius-apiofc.vercel.app/canvas/ttp?text=${encodeURIComponent(query)}&color=white`;

  try {
    const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data, 'binary');

    // Texto de la respuesta dramática
    const messageText = `
╭「 ⚡ 𝙕𝙀𝙉𝙄𝙏𝙎𝙐 - 𝙏𝙀𝙓𝙏𝙊 𝘼 𝙄𝙈𝘼𝙂𝙀𝙉 」╮
│ 🎨 ¡Tu texto ha sido inmortalizado!
│ 🎭 Estilo: Zenitsu-Bot
╰────────────────────╯

¡Tadaaa! 😳 Zenitsu lo hizo con un rayo de velocidad... ¡estoy agotado! ⚡
`.trim();

    await conn.sendMessage(
      jid,
      {
        image: imageBuffer,
        caption: messageText,
        contextInfo,
      },
      { quoted: message }
    );
  } catch (err) {
    console.error('⚠️ Error al invocar la API de Texto a Imagen:', err.message);
    await conn.sendMessage(
      jid,
      {
        text: `❌ ¡Algo salió mal! Zenitsu se tropezó mientras dibujaba...\n🛠️ ${err.message}`,
        contextInfo,
      },
      { quoted: message }
    );
  }
}

module.exports = {
  command: 'ttp',
  handler,
};
