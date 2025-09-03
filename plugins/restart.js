module.exports = {
  command: 'resting',
  handler: async (conn, { message }) => {
    const from = message.key.remoteJid;

    try {
      await conn.sendMessage(from, {
        text: 'Reiniciando el bot...',
      }, { quoted: message });

      setTimeout(() => {
        process.exit(0);
      }, 3000);
    } catch (error) {
      console.error(error);
      await conn.sendMessage(from, {
        text: `Error al reiniciar: ${error}`,
      }, { quoted: message });
    }
  }
};