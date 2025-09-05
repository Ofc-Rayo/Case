module.exports = {
  command: '$',
  handler: async (conn, { message }) => {
    console.log('[DEBUG] Se ejecutó el comando $');

    const from = message.key.remoteJid;
    const sender = message.key.participant || from;
    const normalizedSender = sender.toLowerCase().trim();
    const allOwners = [...global.ownerid, ...global.ownerlid].map(x => x.toLowerCase().trim());

    console.log('[DEBUG] Sender:', normalizedSender);
    console.log('[DEBUG] Owners:', allOwners);

    if (!allOwners.includes(normalizedSender)) {
      console.log('[DEBUG] Usuario no autorizado');
      return conn.sendMessage(from, {
        text: '❌ No tienes permisos para usar este comando.'
      }, { quoted: message });
    }

    const textMessage =
      message.message?.conversation ||
      message.message?.extendedTextMessage?.text ||
      '';

    const commandToExecute = textMessage.trim().slice(1).trim();
    console.log('[DEBUG] Comando recibido:', commandToExecute);

    if (!commandToExecute) {
      return conn.sendMessage(from, {
        text: '❗ Por favor, proporciona un comando para ejecutar después del $.'
      }, { quoted: message });
    }

    await conn.sendMessage(from, {
      text: '⏳ Ejecutando comando...'
    }, { quoted: message });

    exec(commandToExecute, (error, stdout, stderr) => {
      console.log('[DEBUG] Ejecutando comando:', commandToExecute);

      if (error) {
        console.error('[ERROR]', error);
        return conn.sendMessage(from, {
          text: `❌ Error al ejecutar el comando:\n${error.message}`
        }, { quoted: message });
      }

      if (stdout.trim()) {
        console.log('[DEBUG] STDOUT:', stdout);
        conn.sendMessage(from, {
          text: `✅ Resultado:\n${stdout}`
        }, { quoted: message });
      }

      if (stderr.trim()) {
        console.warn('[DEBUG] STDERR:', stderr);
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