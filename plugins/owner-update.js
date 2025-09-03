const { exec } = require('child_process');
const path = require('path');
const { allOwners } = require('../settings');

module.exports = {
  command: 'update',
  handler: async (conn, { message }) => {
    const from = message.key.remoteJid;
    const sender = message.key.participant || from;

    if (!allOwners.includes(sender)) {
      return conn.sendMessage(from, {
        text: 'Solo mi creador me puede actualizar.'
      }, { quoted: message });
    }

    const botDir = path.join(__dirname, '..');

    conn.sendMessage(from, {
      text: 'Actualizando el bot...'
    }, { quoted: message });

    exec('git pull', { cwd: botDir }, (error, stdout, stderr) => {
      if (error) {
        return conn.sendMessage(from, {
          text: `❌ Error al actualizar el bot.\n\n🔧 Detalles: ${error.message}`
        }, { quoted: message });
      }

      if (stderr) {
        console.warn('⚠️ Advertencia durante la actualización:', stderr);
      }

      if (stdout.includes('Already up to date.')) {
        conn.sendMessage(from, {
          text: 'El bot ya está actualizado.'
        }, { quoted: message });
      } else {
        conn.sendMessage(from, {
          text: `Actualización completada con éxito.\n\n🌱 ${stdout}`
        }, { quoted: message });
      }
    });
  }
};