// plugins/girls.js

const axios = require('axios');
const path = require('path');

const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'; // Imagen dramática de Zenitsu

const contextInfo = {
  externalAdReply: {
    title: '⚡ Zenitsu-Bot',
    body: '¡Estoy temblando, pero haré lo que me pides!',
    mediaType: 1,
    previewType: 0,
    mediaUrl: 'https://zenitsu.bot',
    sourceUrl: 'https://zenitsu.bot',
    thumbnailUrl,
  },
};

async function handler(conn, { message, args }) {
  const jid = message.key.remoteJid;

  // Aviso de “procesando”
  await conn.sendMessage(
    jid,
    {
      text: '⚡ *¡¿E-esto es lo que quieres?! ¡Me sonrojo, pero invocaré la respuesta!*',
      contextInfo,
    },
    { quoted: message }
  );

  // Construir la URL de la API
  const apiUrl = `https://delirius-apiofc.vercel.app/nsfw/girls`;

  try {
    const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data, 'binary');

    // Texto de la respuesta dramática
    const messageText = `
╭「 ⚡ 𝙕𝙀𝙉𝙄𝙏𝙎𝙐 - 𝙍𝙀𝙎𝙋𝙐𝙀𝙎𝙏𝘼 」╮
│ 😱 ¡No me mires! ¡Estoy muy avergonzado!
│ 👑 Creador : *Carlos* 
╰────────────────────╯

😳 ¡Aquí tienes... espero que no te arrepientas de esto! ⚡
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
    console.error('⚠️ Error al invocar la API de Delirius:', err.message);
    await conn.sendMessage(
      jid,
      {
        text: `❌ ¡Algo salió mal! Zenitsu se tropezó... ¡no pude obtener la imagen!\n🛠️ ${err.message}`,
        contextInfo,
      },
      { quoted: message }
    );
  }
}

module.exports = {
  command: 'pack',
  handler,
};
