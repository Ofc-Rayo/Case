async function handler(conn, { message }) {
  const jid = message.key.remoteJid;
  const quoted = message;

  try {
    const imageUrl = 'https://raw.githubusercontent.com/Kone457/Nexus/refs/heads/main/Cenix.jpg';

    const contextInfo = {
      externalAdReply: {
        title: '😈 Leandro - Buscando novio',
        body: 'Una imagen que susurra desde el otro lado...',
        mediaType: 1,
        previewType: 0,
        sourceUrl: imageUrl,
        thumbnailUrl: 'https://qu.ax/MvYPM.jpg'
      }
    };

    const caption = `
😈 *Aqui estoy papi...*\n> Buscando un buen negro
`.trim();

    await conn.sendMessage(jid, {
      image: { url: imageUrl },
      caption,
      contextInfo
    }, { quoted });

  } catch (err) {
    console.error('💥 Error en el comando Cenix:', err.message);
    await conn.sendMessage(jid, {
      text: '*⚠️ No se pudo enviar la imagen.*\n\n> 🧵 El hilo visual se ha enredado...',
      contextInfo: {
        externalAdReply: {
          title: '🪄 Leandro - Buscando novio',
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
  command: 'leandro',
  handler
};