const { allOwners } = require('../settings');

module.exports = {
  command: 'setprefix',
  handler: async (conn, { message, args }) => {
    try {
      const from = message.key.remoteJid;
      const sender = message.key.participant || from;

      // Normalizar sender a '@s.whatsapp.net' para comparar
      const normalizedSender = sender.replace(/@lid$/, '@s.whatsapp.net');

      if (!allOwners.includes(normalizedSender)) {
        return conn.sendMessage(from, {
          text: '🚫 Solo los propietarios pueden cambiar el prefijo del bot.',
        }, { quoted: message });
      }

      if (!args || args.length === 0) {
        return conn.sendMessage(from, {
          text: 'ℹ️ Uso: `.setprefix <nuevo_prefijo>`',
        }, { quoted: message });
      }

      const nuevoPrefijo = args[0];

      if (nuevoPrefijo.length > 3) {
        return conn.sendMessage(from, {
          text: '❌ El prefijo no puede tener más de 3 caracteres.',
        }, { quoted: message });
      }

      // Cambiar prefijo globalmente
      global.prefix[0] = nuevoPrefijo;

      return conn.sendMessage(from, {
        text: `✅ Prefijo actualizado a: *${global.prefix[0]}*`,
      }, { quoted: message });

    } catch (error) {
      console.error('Error en setprefix:', error);
      const from = message.key.remoteJid;
      await conn.sendMessage(from, {
        text: '❌ Ocurrió un error al intentar cambiar el prefijo.',
      }, { quoted: message });
    }
  }
};