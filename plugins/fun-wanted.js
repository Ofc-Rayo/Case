// plugins/wanted.js

const axios = require('axios');
const path = require('path');

const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'; // Imagen dramática de Zenitsu

const contextInfo = {
  externalAdReply: {
    title: '⚡ Zenitsu-Bot',
    body: '¡Estoy temblando... pero crearé el cartel más buscado!',
    mediaType: 1,
    previewType: 0,
    mediaUrl: 'https://zenitsu.bot',
    sourceUrl: 'https://zenitsu.bot',
    thumbnailUrl,
  },
};

async function handler(conn, { message, args }) {
  const jid = message.key.remoteJid;

  const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  const targetJid = mentionedJid || message.key.participant || message.key.remoteJid;

  if (!targetJid) {
    return conn.sendMessage(
      jid,
      {
        text: '😱 ¡¿A quién debo convertir en el más buscado?! ¡Menciona a alguien, baka! 😤',
        contextInfo,
      },
      { quoted: message }
    );
  }

  await conn.sendMessage(
    jid,
    {
      text: '⚡ *¡Estoy reuniendo tinta, papel y drama... creando el cartel!*',
      contextInfo,
    },
    { quoted: message }
  );

  try {
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

    const apiUrl = `https://api.popcat.xyz/v2/wanted?image=${encodeURIComponent(profilePicUrl)}`;
    const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data, 'binary');

    const messageText = `
╭「 ⚡ 𝙕𝙀𝙉𝙄𝙏𝙎𝙐 - 𝙎𝙀 𝘽𝙐𝙎𝘾𝘼 」╮
│ 🕵️ ¡Este alma ha sido marcada!
│ 🎭 Estilo: Zenitsu-Bot
╰────────────────────╯

😳 Zenitsu ha colgado el cartel... ¡y ahora todos lo buscan! ⚡
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
    console.error('⚠️ Error al invocar la API de Wanted:', err.message);
    await conn.sendMessage(
      jid,
      {
        text: `❌ ¡Algo salió mal! Zenitsu se tropezó con el cartel...\n🛠️ ${err.message}`,
        contextInfo,
      },
      { quoted: message }
    );
  }
}

module.exports = {
  command: 'wanted',
  handler,
};