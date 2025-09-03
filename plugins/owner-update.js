const { exec } = require('child_process');
const path = require('path');
const { allOwners } = require('../settings');

module.exports = {
  command: 'update',
  handler: async (conn, { message }) => {
    const from = message.key.remoteJid;
    const sender = message.key.participant || message.key.remoteJid;

    console.log(`🔧 Comando 'update' invocado por: ${sender}`);
    console.log('🔐 Lista de owners permitidos:', allOwners);

    try {
      // Verificación de owner
      if (!allOwners.includes(sender)) {
        console.log(`🚫 Usuario no autorizado: ${sender}`);
        return conn.sendMessage(from, {
          text: '❌ Solo mi creador me puede actualizar.'
        }, { quoted: message });
      }

      // Ruta del bot
      const botDir = path.join(__dirname, '..');

      // Avisar que está actualizando
      await conn.sendMessage(from, {
        text: '🔄 Actualizando el bot...'
      }, { quoted: message });

      // Ejecutar git pull
      exec('git pull', { cwd: botDir }, (error, stdout, stderr) => {
        if (error) {
          console.error('❌ Error al ejecutar git pull:', error);
          return conn.sendMessage(from, {
            text: `❌ Error al actualizar el bot.\n\n🛠️ Detalles: ${error.message}`
          }, { quoted: message });
        }

        if (stderr) {
          console.warn('⚠️ Advertencia durante la actualización:', stderr);
        }

        if (stdout.includes('Already up to date')) {
          conn.sendMessage(from, {
            text: '✅ El bot ya está actualizado.'
          }, { quoted: message });
        } else {
          conn.sendMessage(from, {
            text: `✅ Actualización completada con éxito.\n\n📦 Cambios:\n${stdout}`
          }, { quoted: message });
        }
      });
    } catch (err) {
      console.error('❌ Error inesperado en el comando update:', err);
      conn.sendMessage(from, {
        text: '⚠️ Ocurrió un error inesperado al intentar actualizar.'
      }, { quoted: message });
    }
  }
};