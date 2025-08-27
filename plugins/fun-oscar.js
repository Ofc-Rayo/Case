async function handler(conn, { message }) {
  const jid = message.key.remoteJid;
  const quoted = message;

  try {
    const imageUrl = 'https://qu.ax/GNebj.jpg';

    const contextInfo = {
      externalAdReply: {
        title: '🤤 Oscar - soñando',
        body: 'Una imagen que susurra desde el otro lado...',
        mediaType: 1,
        previewType: 0,
        sourceUrl: imageUrl,
        thumbnailUrl: 'https://qu.ax/MvYPM.jpg'
      }
    };

    const caption = `
🤤 *Suena Oscar...*\n> Pero recuerda, ella no te quiere 😈
`.trim();

    await conn.sendMessage(jid, {
      image: { url: imageUrl },
      caption,
      contextInfo
    }, { quoted });

  } catch (err) {
    console.error('💥 Error en el comando Oscar:', err.message);
    await conn.sendMessage(jid, {
      text: '*⚠️ No se pudo enviar la imagen.*\n\n> 🧵 El hilo visual se ha enredado...',
      contextInfo: {
        externalAdReply: {
          title: '🤤 Oscar - en sus sueños humedos',
          body: 'Error en la conexión estética...',
          mediaType: 1,
          previewType: 0,
          sourceUrl: imageUrl,
          thumbnailUrl: 'https://qu.ax/MvYPM.jpg'
        }
      }
    }, { quoted });
  }
}

module.exports = {
  command: 'oscar',
  handler
};
