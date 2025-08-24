// plugins/setpfp.js
const { allOwners, botname } = require('../settings');

module.exports = {
  command: 'setpfp',
  handler: async (conn, { message }) => {
    const from    = message.key.remoteJid;
    const sender  = message.key.participant || from;
    const isGroup = from.endsWith('@g.us');

    console.log(`🖼️ [DEBUG] Comando setpfp invocado por: ${sender} en: ${from}`);

    // 🔐 Validación de owner
    if (!allOwners.includes(sender)) {
      return conn.sendMessage(from, {
        text: `*😤 ¡Alto ahí!*\n\n> Solo el gran maestro de ${botname} puede alterar mi esencia visual.`,
      }, { quoted: message });
    }

    // 📸 Validación: ¿se respondió a una imagen?
    const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const imageMessage = quoted?.imageMessage;

    if (!imageMessage) {
      return conn.sendMessage(from, {
        text: '*🖼️ Ritual fallido*\n\n> Debes responder a una imagen para que Zenitsu adopte esa forma.',
      }, { quoted: message });
    }

    try {
      // 🧿 Descarga de imagen
      const stream = await conn.downloadMediaMessage({ message: { imageMessage } });

      // 🪞 Cambio de avatar
      await conn.updateProfilePicture(conn.user.id, stream);

      // 🎭 Confirmación ritual
      await conn.sendMessage(from, {
        text: `*✨ Ritual completado*\n\n> Zenitsu ha adoptado una nueva forma visual.\n> Que esta imagen refleje su poder y ternura.`,
      }, { quoted: message });
    } catch (err) {
      console.error('💥 [DEBUG] Error al cambiar la foto de perfil:', err);
      await conn.sendMessage(from, {
        text: `*💥 ¡Algo salió mal al transformar mi imagen!*\n\n> El ritual fue interrumpido por fuerzas desconocidas.`,
      }, { quoted: message });
    }
  }
};