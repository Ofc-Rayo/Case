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
      console.log(`🚫 [DEBUG] Usuario no autorizado: ${sender}`);
      return conn.sendMessage(from, {
        text: `*😤 ¡Alto ahí!*\n\n> Solo el gran maestro de ${botname} puede alterar mi esencia visual.`,
      }, { quoted: message });
    }

    // 📸 Validación de imagen en respuesta
    const quotedMsg = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const imageMsg  = quotedMsg?.imageMessage;

    if (!imageMsg) {
      console.log('🚫 [DEBUG] No se respondió a una imagen');
      return conn.sendMessage(from, {
        text: '*🖼️ Para este ritual, debes responder a una imagen.*\n\n> Zenitsu necesita una fuente visual para transformarse.',
      }, { quoted: message });
    }

    try {
      // 🧿 Descarga de imagen
      const stream = await conn.downloadMediaMessage({ message: quotedMsg });

      // 🪞 Cambio de avatar
      await conn.updateProfilePicture(botname + '@s.whatsapp.net', stream);

      console.log('✅ [DEBUG] Avatar actualizado con éxito');

      // 🎭 Confirmación ritual
      await conn.sendMessage(from, {
        text: `*✨ Ritual completado*\n\n> Zenitsu ha adoptado una nueva forma visual.\n> Que esta imagen refleje su poder y ternura.`,
      }, { quoted: message });
    } catch (err) {
      console.error('💥 [DEBUG] Error al cambiar la foto de perfil:', err);
      return conn.sendMessage(from, {
        text: '*💥 ¡Algo salió mal al transformar mi imagen!*\n\n> El ritual fue interrumpido por fuerzas desconocidas.',
      }, { quoted: message });
    }
  }
};