// plugins/rip.js

const axios = require('axios');
const path = require('path');

const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'; // Imagen dramática de Zenitsu

const contextInfo = {
  externalAdReply: {
    title: '⚡ Zenitsu-Bot',
    body: '¡Estoy temblando... pero honraré la memoria de este alma!',
    mediaType: 1,
    previewType: 0,
    mediaUrl: 'https://zenitsu.bot',
    sourceUrl: 'https://zenitsu.bot',
    thumbnailUrl,
  },
};

async function handler(conn, { message, args }) {
  const jid = message.key.remoteJid;
  
  // Identificar al usuario mencionado o al remitente
  const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  const targetJid = mentionedJid || message.key.participant || message.key.remoteJid;
  
  if (!targetJid) {
    return conn.sendMessage(
      jid,
      {
        text: '😱 ¡¿A quién debo convertir en una lápida?! ¡Menciona a alguien, baka! 😤',
        contextInfo,
      },
      { quoted: message }
    );
  }

  // Aviso de “procesando”
  await conn.sendMessage(
    jid,
    {
      text: '⚡ *¡Mi corazón está apesadumbrado! Pero estoy creando la lápida...*',
      contextInfo,
    },
    { quoted: message }
  );

  try {
    // Obtener la URL de la foto de perfil
    const profilePicUrl = await conn.profilePictureUrl(targetJid, 'image').catch(() => null);

    if (!profilePicUrl) {
      return conn.sendMessage(
        jid,
        {
          text: '😵 *¡No pude encontrar la foto de perfil! ¡Estoy en pánico total!*',
          contextInfo,
        },
        { quoted: message }
      );
    }
    
    // Construir la URL de la API
    const apiUrl = `https://delirius-apiofc.vercel.app/canvas/rip?url=${encodeURIComponent(profilePicUrl)}`;

    const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data, 'binary');

    // Texto de la respuesta dramática
    const messageText = `
╭「 ⚡ 𝙕𝙀𝙉𝙄𝙏𝙎𝙐 - 𝙇Á𝙋𝙄𝘿𝘼 」╮
│ 💔 ¡Que descanse en paz esta alma!
│ 🎭 Estilo: Zenitsu-Bot
╰────────────────────╯

😳 Zenitsu ha rendido un respetuoso homenaje... ¡estoy agotado emocionalmente! ⚡
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
    console.error('⚠️ Error al invocar la API de RIP:', err.message);
    await conn.sendMessage(
      jid,
      {
        text: `❌ ¡Algo salió mal! Zenitsu se tropezó mientras cavaba...\n🛠️ ${err.message}`,
        contextInfo,
      },
      { quoted: message }
    );
  }
}

module.exports = {
  command: 'rip',
  handler,
};
