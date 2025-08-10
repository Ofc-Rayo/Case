const axios = require('axios');

async function handler(conn, { message }) {
  const jid = message.key.remoteJid;
  const quoted = message;

  try {
    const response = await axios.get('https://eliasar-yt-api.vercel.app/api/anime/');
    if (response.data?.status) {
      const animeImage = response.data.image;

      const contextInfo = {
        externalAdReply: {
          title: '🌩️ Zenitsu Bot - Anime Ritual',
          body: 'Imágenes que cruzan el umbral del éter nipón...',
          mediaType: 1,
          previewType: 0,
          sourceUrl: 'https://eliasar-yt-api.vercel.app',
          thumbnailUrl: animeImage
        }
      };

      const caption = `
╭─「 🌸 𝙕𝙀𝙉𝙄𝙏𝙎𝙐 - 𝘼𝙉𝙄𝙈𝙀 」─╮
│ ⚡ *Estado:* Imagen encontrada
│ 🖼️ *Fuente:* Eliasar Anime API
╰────────────────────────────╯
*😳 ¡Zenitsu se ha desmayado de la emoción!*
`.trim();

      await conn.sendMessage(jid, {
        image: { url: animeImage },
        caption,
        contextInfo
      }, { quoted });

    } else {
      await conn.sendMessage(jid, {
        text: '*😭 Zenitsu no pudo encontrar una imagen de anime...*\n\n> 🌫️ La energía espiritual se desvaneció.',
        contextInfo
      }, { quoted });
    }

  } catch (err) {
    console.error('💥 Error al obtener la imagen de anime:', err.message);
    await conn.sendMessage(jid, {
      text: '*⚠️ ¡Error inesperado!*\n\n> 😵 Zenitsu tropezó entre los cables del destino...',
      contextInfo
    }, { quoted });
  }
}

module.exports = {
  command: 'anime',
  handler
};