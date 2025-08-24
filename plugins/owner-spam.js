// plugins/spam.js
const { allOwners } = require('../settings');

module.exports = {
  command: 'spam',
  handler: async (conn, { message, args }) => {
    const from   = message.key.remoteJid;
    const sender = message.key.participant || from;

    console.log(`⚡ [DEBUG] Comando raidmsg invocado por: ${sender}`);

    // 🔐 Validación de owner
    if (!allOwners.includes(sender)) {
      return conn.sendMessage(from, {
        text: `*🚫 Ritual denegado*\n\n> Solo el maestro puede invocar la aparición fugaz de Zenitsu.`,
      }, { quoted: message });
    }

    // 📌 Validación de argumentos
    if (args.length < 3) {
      return conn.sendMessage(from, {
        text: `*📜 Uso correcto del ritual:*\n\n> \`spam <enlace del grupo> <cantidad> <mensaje>\``,
      }, { quoted: message });
    }

    const inviteLink = args[0];
    const count = parseInt(args[1]);
    const msg = args.slice(2).join(' ');

    if (!inviteLink.includes('chat.whatsapp.com/')) {
      return conn.sendMessage(from, {
        text: '*🔗 Enlace inválido*\n\n> Debes proporcionar un enlace de invitación válido.',
      }, { quoted: message });
    }

    if (isNaN(count) || count < 1 || count > 20) {
      return conn.sendMessage(from, {
        text: '*🔢 Cantidad inválida*\n\n> El número de repeticiones debe estar entre 1 y 20.',
      }, { quoted: message });
    }

    try {
      // 🌀 Extraer código del enlace
      const code = inviteLink.split('/')[1].trim();

      // 🚪 Unirse al grupo
      const response = await conn.groupAcceptInvite(code);
      const targetGroup = response.id;

      console.log(`✅ [DEBUG] Zenitsu se ha unido a: ${targetGroup}`);

      // 📣 Enviar el mensaje varias veces
      for (let i = 0; i < count; i++) {
        await conn.sendMessage(targetGroup, { text: msg });
        await new Promise(resolve => setTimeout(resolve, 1000)); // Pausa ritual
      }

      // 🏃‍♂️ Salir del grupo
      await conn.groupLeave(targetGroup);

      // ✅ Confirmación al invocador
      await conn.sendMessage(from, {
        text: `*✅ Ritual completado*\n\n> Zenitsu apareció fugazmente, dejó su mensaje y se desvaneció.`,
      }, { quoted: message });
    } catch (err) {
      console.error('💥 [DEBUG] Error en raidmsg:', err);
      await conn.sendMessage(from, {
        text: `*💥 ¡Algo salió mal durante el ritual!*\n\n> Zenitsu no pudo completar la aparición.`,
      }, { quoted: message });
    }
  }
};