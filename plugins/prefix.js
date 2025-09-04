// plugins/setprefix.js
const { allOwners } = require('../settings');

module.exports = {
  command: 'setprefix',
  handler: async (conn, { message, args }) => {
    const from   = message.key.remoteJid;
    const sender = message.key.participant || from;

    console.log(`⚙️ [DEBUG] Comando setprefix invocado por: ${sender}`);

    // 🔐 Validación de owner
    if (!allOwners.includes(sender)) {
      return conn.sendMessage(from, {
        text: `🚫 Solo los propietarios pueden cambiar el prefijo del bot.`,
      }, { quoted: message });
    }

    // 📌 Validación de argumentos
    if (!args[0]) {
      return conn.sendMessage(from, {
        text: `ℹ️ Uso: \`setprefix <nuevo_prefijo>\``,
      }, { quoted: message });
    }

    const nuevoPrefijo = args[0];

    // 🔎 Validar longitud del prefijo
    if (nuevoPrefijo.length > 3) {
      return conn.sendMessage(from, {
        text: `❌ El prefijo no puede tener más de 3 caracteres.`,
      }, { quoted: message });
    }

    // 📝 Guardar el nuevo prefijo (se usa un array global como en tu ejemplo)
    global.prefix[0] = nuevoPrefijo;

    return conn.sendMessage(from, {
      text: `✅ Prefijo actualizado: *${global.prefix[0]}*`,
    }, { quoted: message });
  }
};