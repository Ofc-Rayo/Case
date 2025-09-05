const cp = require('child_process');
const { promisify } = require('util');
const exec = promisify(cp.exec);

module.exports = {
  command: '$',
  handler: async (conn, { message, args }) => {
    const from = message.key.remoteJid;
    const sender = message.key.participant || from;
    const normalizedSender = sender.toLowerCase().trim();
    const allOwners = [...global.ownerid, ...global.ownerlid].map(x => x.toLowerCase().trim());

    if (!allOwners.includes(normalizedSender)) {
      return conn.sendMessage(from, { text: '❌ No tienes permisos para usar este comando.' }, { quoted: message });
    }

    const commandToExecute = args.join(' ').trim();
    if (!commandToExecute) {
      return conn.sendMessage(from, { text: '❗ Por favor, proporciona un comando para ejecutar después del $.' }, { quoted: message });
    }

    await conn.sendMessage(from, { text: '⏳ Ejecutando comando...' }, { quoted: message });

    try {
      const { stdout, stderr } = await exec(commandToExecute);

      if (stdout.trim()) {
        await conn.sendMessage(from, { text: `✅ Resultado:\n${stdout}` }, { quoted: message });
      }

      if (stderr.trim()) {
        await conn.sendMessage(from, { text: `⚠️ Error:\n${stderr}` }, { quoted: message });
      }

      if (!stdout.trim() && !stderr.trim()) {
        await conn.sendMessage(from, { text: '⚠️ Comando ejecutado pero no produjo salida.' }, { quoted: message });
      }
    } catch (error) {
      await conn.sendMessage(from, { text: `❌ Error al ejecutar el comando:\n${error.message}` }, { quoted: message });
    }
  }
};