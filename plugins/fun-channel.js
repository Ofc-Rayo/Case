// plugins/channelstalk.js

const axios = require('axios');
const path = require('path');

const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'; // Imagen dramática de Zenitsu

const contextInfo = {
  externalAdReply: {
    title: '⚡ Zenitsu-Bot',
    body: '¡Estoy temblando... pero revisando ese canal para ti!',
    mediaType: 1,
    previewType: 0,
    mediaUrl: 'https://zenitsu.bot',
    sourceUrl: 'https://zenitsu.bot',
    thumbnailUrl,
  },
};

async function handler(conn, { message, args }) {
  const jid = message.key.remoteJid;
  const channelUrl = args[0];

  // Validar si se proporcionó una URL
  if (!channelUrl) {
    return conn.sendMessage(
      jid,
      {
        text: '😱 ¡¿Cómo que no me das una URL?!\n\n> ¡No soy un adivino, baka! ¡Necesito un enlace de canal de WhatsApp! 😤',
        contextInfo,
      },
      { quoted: message }
    );
  }

  // Aviso de “procesando”
  await conn.sendMessage(
    jid,
    {
      text: '⚡ *Estoy temblando... pero rastreando ese canal de WhatsApp...*',
      contextInfo,
    },
    { quoted: message }
  );

  // Construir la URL de la API
  const apiUrl = `https://delirius-apiofc.vercel.app/tools/whatsappchannelstalk?channel=${encodeURIComponent(channelUrl)}`;

  try {
    const response = await axios.get(apiUrl);
    const { data } = response.data;

    if (!data) {
      return conn.sendMessage(
        jid,
        {
          text: '😵 *¡La API no encontró nada! ¡Estoy en pánico total!*',
          contextInfo,
        },
        { quoted: message }
      );
    }

    // Formatear la respuesta con la información obtenida
    const messageText = `
╭「 ⚡ 𝙕𝙀𝙉𝙄𝙏𝙎𝙐 - 𝙄𝙉𝙁𝙊 𝘿𝙀 𝘾𝘼𝙉𝘼𝙇 」╮
│ 🔍 Título: ${data.title}
│ 👥 Seguidores: ${data.followers}
│ ✅ Verificado: ${data.verified ? 'Sí 💯' : 'No 😟'}
│ 📋 Descripción: ${data.description.substring(0, 150)}...
│ 🔗 Enlace: ${data.url}
╰────────────────────╯

😳 Zenitsu es increíble, ¿verdad? ¡Lo logré! ⚡
`.trim();

    // Enviar el mensaje con la foto de perfil del canal si existe
    if (data.profile) {
      const imageBuffer = await axios.get(data.profile, { responseType: 'arraybuffer' });
      await conn.sendMessage(
        jid,
        {
          image: Buffer.from(imageBuffer.data, 'binary'),
          caption: messageText,
          contextInfo,
        },
        { quoted: message }
      );
    } else {
      await conn.sendMessage(
        jid,
        {
          text: messageText,
          contextInfo,
        },
        { quoted: message }
      );
    }

  } catch (err) {
    console.error('⚠️ Error al invocar la API de WhatsApp Channel Stalk:', err.message);
    await conn.sendMessage(
      jid,
      {
        text: `❌ ¡Algo salió mal! Zenitsu se tropezó intentando rastrear el canal...\n🛠️ ${err.message}`,
        contextInfo,
      },
      { quoted: message }
    );
  }
}

module.exports = {
  command: 'channel',
  handler,
};
