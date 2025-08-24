// plugins/sendto.js
const { allOwners } = require('../settings');

module.exports = {
  command: 'sendto',
  handler: async (conn, { message, args }) => {
    const from    = message.key.remoteJid;
    const sender  = message.key.participant || from;

    console.log(`📨 [DEBUG] Comando sendto invocado por: ${sender}`);

    // 🔐 Validación de owner
    if (!allOwners.includes(sender)) {
      return conn.sendMessage(from, {
        text: `*🚫 Ritual denegado*\n\n> Solo el maestro puede lanzar mensajes directos.`,
      }, { quoted: message });
    }

    // 📌 Validación de argumentos
    if (args.length < 2) {
      return conn.sendMessage(from, {
        text: `*📜 Uso correcto del ritual:*\n\n> \`sendto 521XXXXXXXXXX mensaje aquí\``,
      }, { quoted: message });
    }

    const numberRaw = args[0];
    const textToSend = args.slice(1).join(' ');
    const jid = numberRaw.replace(/[^0-9]/g, '') + '@s.whatsapp.net';

    try {
      // 🕊️ Envío del mensaje sin marco
      await conn.sendMessage(jid, {
        text: textToSend,
      });

      // ✅ Confirmación al invocador
      await conn.sendMessage(from, {
        text: `*✅ Ritual completado*\n\n> El mensaje fue enviado a \`${numberRaw}\`.`,
      }, { quoted: message });
    } catch (err) {
      console.error('💥 [DEBUG] Error al enviar mensaje:', err);
      await conn.sendMessage(from, {
        text: `*💥 ¡Algo salió mal al lanzar el mensaje!*\n\n> El ritual fue interrumpido por fuerzas desconocidas.`,
      }, { quoted: message });
    }
  }
};