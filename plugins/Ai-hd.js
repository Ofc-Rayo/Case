const { exec } = require('child_process');
require('../settings');

module.exports = {
  command: '$',
  handler: async (conn, { message }) => {
    const from = message.key.remoteJid;
    const sender = message.key.participant || from;
    const normalizedSender = sender.toLowerCase().trim();
    const allOwners = [...global.ownerid, ...global.ownerlid].map(x => x.toLowerCase().trim());

    if (!allOwners.includes(normalizedSender)) {
      return conn.sendMessage(from, {
        text: '❌ No tienes permisos para usar este comando.'
      }, { quoted: message });
    }

    const textMessage =
      message.message?.conversation ||
      message.message?.extendedTextMessage?.text ||
      '';

    const commandToExecute = textMessage.trim().replace(/^[$\s]+/, '');

    if (!commandToExecute) {
      return conn.sendMessage(from, {
        text: '❗ Por favor, proporciona un comando para ejecutar después del $.'
      }, { quoted: message });
    }

    await conn.sendMessage(from, {
      text: '⏳ Ejecutando comando...'
    }, { quoted: message });

    exec(commandToExecute, (error, stdout, stderr) => {
      if (error) {
        return conn.sendMessage(from, {
          text: `❌ Error al ejecutar el comando:\n${error.message}`
        }, { quoted: message });
      }

      if (stdout.trim()) {
        conn.sendMessage(from, {
          text: `✅ Resultado:\n${stdout}`
        }, { quoted: message });
      }

      if (stderr.trim()) {
        conn.sendMessage(from, {
          text: `⚠️ Error:\n${stderr}`
        }, { quoted: message });
      }

      if (!stdout.trim() && !stderr.trim()) {
        conn.sendMessage(from, {
          text: '⚠️ Comando ejecutado pero no produjo salida.'
        }, { quoted: message });
      }
    });
  }
};