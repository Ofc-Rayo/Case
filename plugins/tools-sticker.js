const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const sharp = require('sharp');

const thumbnailUrl = 'https://qu.ax/MvYPM.jpg';

const contextInfo = {
  externalAdReply: {
    title: '⚡ Zenitsu - Generador de Stickers',
    body: '¡Estoy temblando... pero convirtiendo tu imagen en sticker!',
    mediaType: 1,
    previewType: 0,
    mediaUrl: 'https://zenitsu.bot',
    sourceUrl: 'https://zenitsu.bot',
    thumbnailUrl,
  },
};

async function handler(conn, { message, args }) {
  const jid = message.key.remoteJid;
  let imageBuffer = null;

  try {
    // Verificar si hay una imagen citada
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
    }
    // Verificar si el mensaje actual es una imagen
    else if (message.message?.imageMessage) {
      imageBuffer = await downloadMediaMessage(message, 'buffer', {});
    }
    // Si no hay imagen
    else {
      return conn.sendMessage(
        jid,
        {
          text: '😱 ¡¿Dónde está la imagen?!\n\n> ¡Necesito que envíes una imagen o cites una imagen, baka! 😤\n\n📌 *Ejemplos de uso:*\n• Envía una imagen con el caption: `.sticker`\n• Cita una imagen y escribe: `.sticker`',
          contextInfo,
        },
        { quoted: message }
      );
    }

    // Procesar imagen para sticker (convertir a WebP y redimensionar)
    const processedSticker = await sharp(imageBuffer)
      .resize(512, 512, { 
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .webp({ quality: 100 })
      .toBuffer();

    // Enviar el sticker procesado
    await conn.sendMessage(jid, {
      sticker: processedSticker
    }, { quoted: message });

  } catch (error) {
    console.error('⚠️ Error en el comando sticker:', error.message);
    
    await conn.sendMessage(
      jid,
      {
        text: `😵 *¡Me desmayé! ¡Error al crear el sticker!*

🔧 **Posibles problemas:**
• La imagen es muy pesada
• Formato de imagen no compatible
• Error en el procesamiento

> ¡Inténtalo de nuevo con otra imagen, por favor! 🥺`,
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