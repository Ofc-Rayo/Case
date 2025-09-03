const { exec } = require('child_process');
const path = require('path');

require('../settings');

module.exports = {
  command: 'update',
  handler: async (conn, { message }) => {
    const from = message.key.remoteJid;
    const sender = message.key.participant || from;

    const normalizedSender = sender.toLowerCase().trim();
    const allOwners = [...global.ownerid, ...global.ownerlid].map(x => x.toLowerCase().trim());

    if (!allOwners.includes(normalizedSender)) {
      return conn.sendMessage(from, {
        text: `*Tu no eres mi propietario, solo mi propietario puede usar esta función ⚡*`
      }, { quoted: message });
    }

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
        console.warn(stderr);
      }

      if (stdout.includes('Already up to date.')) {
        conn.sendMessage(from, {
          text: '🌱 El bot ya está actualizado.'
        }, { quoted: message });
      } else {
        conn.sendMessage(from, {
          text: `🍁 Actualización realizada con éxito.\n\n${stdout}`
        }, { quoted: message });
      }
    });
  }
};