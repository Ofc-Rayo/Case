const axios = require('axios');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const sharp = require('sharp');

async function getImageBufferFromUrl(url) {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  return Buffer.from(response.data, 'binary');
}

async function handler(conn, { message, args }) {
  const jid = message.key.remoteJid;
  let imageBuffer = null;

  const thumbnailUrl = 'https://files.catbox.moe/u9urqz.jpg';
  const thumbnailBuffer = await getImageBufferFromUrl(thumbnailUrl);

  const contextInfo = {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: '120363276986902836@newsletter',
      newsletterName: 'Toca aquí 👆🏻',
      serverMessageId: 143
    },
    externalAdReply: {
      title: 'Simple-Bot - Creador de Stickers',
      body: 'Convierte una imagen a sticker',
      mediaType: 1,
      previewType: 0,
      thumbnail: thumbnailBuffer
    }
  };

  try {
    if (message.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage) {
      const quotedMessage = {
        key: {
          remoteJid: jid,
          id: message.message.extendedTextMessage.contextInfo.stanzaId
        },
        message: {
          imageMessage: message.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage
        }
      };

      imageBuffer = await downloadMediaMessage(quotedMessage, 'buffer', {});
    } else if (message.message?.imageMessage) {
      imageBuffer = await downloadMediaMessage(message, 'buffer', {});
    } else {
      return conn.sendMessage(
        jid,
        {
          text: '*Envíe una imagen para convertir en sticker*',
          contextInfo,
        },
        { quoted: message }
      );
    }

    const processedSticker = await sharp(imageBuffer)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .webp({ quality: 100 })
      .toBuffer();

    await conn.sendMessage(jid, {
      sticker: processedSticker,
      contextInfo
    }, { quoted: message });

  } catch (error) {
    console.error('⚠️ Error en el comando sticker:', error.message);

    await conn.sendMessage(
      jid,
      {
        text: `*Error al crear el sticker*`,
        contextInfo,
      },
      { quoted: message }
    );
  }
}

module.exports = {
  command: 's',
  handler,
  tag: 'fun',
  description: 'Convierte imágenes en stickers para WhatsApp'
};