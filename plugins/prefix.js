// plugins/setprefix.js
const { allOwners } = require('../settings');

module.exports = {
  command: 'setprefix',
  handler: async (conn, { message, args }) => {
    try {
      const from = message.key.remoteJid;
      const sender = message.key.participant || from;

      console.log(`⚙️ [DEBUG] Comando setprefix invocado por: ${sender}`);

      // Validar que sea owner
      if (!allOwners.includes(sender)) {
        return conn.sendMessage(from, {
          text: '🚫 Solo los propietarios pueden cambiar el prefijo del bot.',
        }, { quoted: message });
      }

      // Validar args
      if (!args || args.length === 0) {
        return conn.sendMessage(from, {
          text: 'ℹ️ Uso: `setprefix <nuevo_prefijo>`',
        }, { quoted: message });
      }

      const nuevoPrefijo = args[0];

      // Validar longitud
      if (nuevoPrefijo.length > 3) {
        return conn.sendMessage(from, {
          text: '❌ El prefijo no puede tener más de 3 caracteres.',
        }, { quoted: message });
      }

      // Guardar prefijo en global.prefix (asegúrate de que esté definido)
      if (!global.prefix) {
        global.prefix = ['!']; // Valor inicial si no existe
      }

      global.prefix[0] = nuevoPrefijo;

      return conn.sendMessage(from, {
        text: `✅ Prefijo actualizado: *${global.prefix[0]}*`,
      }, { quoted: message });

    } catch (error) {
      console.error('Error en setprefix:', error);
      // Opcional: notificar error al usuario
      const from = message.key.remoteJid;
      await conn.sendMessage(from, {
        text: '❌ Ocurrió un error al intentar cambiar el prefijo.',
      }, { quoted: message });
    }
  }
};