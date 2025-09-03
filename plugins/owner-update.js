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
        text: '*Solo el creador me puede actualizar*'
      }, { quoted: message });
    }

    const botDir = path.join(__dirname, '..');

    exec('git pull origin main', { cwd: botDir }, (error) => {
      if (error) {
        return conn.sendMessage(from, {
          text: '❌ Error al actualizar.'
        }, { quoted: message });
      }

      conn.sendMessage(from, {
        text: '✅ Bot actualizado.'
      }, { quoted: message });
    });
  }
};