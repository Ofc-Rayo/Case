const { exec } = require('child_process');
const path = require('path');
const { allOwners } = require('../settings');

module.exports = {
  command: 'update',
  handler: async (conn, { message }) => {
    const from = message.key.remoteJid;
    const sender = message.key.participant || from;

    // Validación de propietario
    if (!allOwners.includes(sender)) {
      return conn.sendMessage(from, {
        text: '*⛔ Acceso denegado:*\nEste comando solo está disponible para los administradores.'
      }, { quoted: message });
    }

    // Notificar inicio
    await conn.sendMessage(from, {
      text: '🛠️ Actualizando Simple-Bot...'
    }, { quoted: message });

    const botDirectory = path.join(__dirname, '..');

    exec('git pull origin main', { cwd: botDirectory }, (error, stdout, stderr) => {
      if (error) {
        return conn.sendMessage(from, {
          text: `❌ Error al actualizar:\n${error.message}`
        }, { quoted: message });
      }

      if (stderr) {
        console.warn('Advertencia durante la actualización:', stderr);
      }

      if (stdout.includes('Already up to date.')) {
        conn.sendMessage(from, {
          text: '✅ El bot ya está actualizado.'
        }, { quoted: message });
      } else {
        conn.sendMessage(from, {
          text: `✅ Actualización realizada con éxito.\n\n${stdout}`
        }, { quoted: message });
      }
    });
  }
};