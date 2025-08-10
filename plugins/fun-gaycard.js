// plugins/gaycard.js

const axios = require('axios');
const path = require('path');

const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'; // Imagen dramática de Zenitsu

const contextInfo = {
  externalAdReply: {
    title: '⚡ Zenitsu-Bot',
    body: '¡Estoy temblando... pero revelaré la verdad sobre esta alma!',
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
        text: '😱 ¡¿A quién debo escanear?! ¡Menciona a alguien, baka! 😤',
        contextInfo,
      },
      { quoted: message }
    );
  }

  // Aviso de “procesando”
  await conn.sendMessage(
    jid,
    {
      text: '⚡ *¡Mis nervios tiemblan! Pero estoy analizando el aura de esta persona...*',
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
    
    // Obtener el nombre del usuario de la @mención si existe, o usar un nombre por defecto
    let userName = 'Usuario';
    if (message.message?.extendedTextMessage?.text) {
      const parts = message.message.extendedTextMessage.text.split(' ');
      if (parts.length > 1) {
        // Asume que la mención es el primer argumento después del comando
        userName = parts[1].replace(/[@]/g, ''); 
      }
    }
    
    const rank = Math.floor(Math.random() * 100) + 1; // Genera un rango aleatorio entre 1 y 100

    // Construir la URL de la API
    const apiUrl = `https://delirius-apiofc.vercel.app/canvas/gaycard?url=${encodeURIComponent(profilePicUrl)}&name=${encodeURIComponent(userName)}&rank=${rank}`;

    const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data, 'binary');

    // Texto de la respuesta dramática
    const messageText = `
╭「 ⚡ 𝙕𝙀𝙉𝙄𝙏𝙎𝙐 - 𝙍𝙀𝙑𝙀𝙇𝘼𝘾𝙄𝙊́𝙉 」╮
│ 🏳️‍🌈 ¡La verdad ha sido revelada!
│ 🎭 Estilo: Zenitsu-Bot
╰────────────────────╯

😳 Zenitsu ha cumplido con su deber... ¡espero que no me golpees! ⚡
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
    console.error('⚠️ Error al invocar la API de Gaycard:', err.message);
    await conn.sendMessage(
      jid,
      {
        text: `❌ ¡Algo salió mal! Zenitsu se tropezó mientras corría...\n🛠️ ${err.message}`,
        contextInfo,
      },
      { quoted: message }
    );
  }
}

module.exports = {
  command: 'gaycard',
  handler,
};
