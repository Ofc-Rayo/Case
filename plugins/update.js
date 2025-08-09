const { exec } = require('child_process');
const { ownerid, ownerlid } = require('../settings');
const path = require('path');

module.exports = {
  command: 'update',
  handler: async (conn, { message }) => {
    const from = message.key.remoteJid;
    const sender = message.key.participant || from;

    // 🧠 Normalizaciones cruzadas
    const normalizedSender = sender.replace(/@lid$/, '@s.whatsapp.net');
    const altNormalizedSender = sender.replace(/@s\.whatsapp\.net$/, '@lid');

    // 🔐 Validación universal
    const isOwner =
      ownerid.includes(sender) ||
      ownerid.includes(normalizedSender) ||
      ownerlid.includes(sender) ||
      ownerlid.includes(altNormalizedSender);

    if (!isOwner) {
      return await conn.sendMessage(from, {
        text: '*😤 ¡Alto ahí!*\n\n> Solo el *gran maestro Carlos* o los *guardianes autorizados* pueden invocar el ritual de actualización.\nZenitsu tiembla solo de pensarlo...',
      }, { quoted: message });
    }

    await conn.sendMessage(from, {
      text: '*🔄 Zenitsu está iniciando la actualización...*\n\n> ¡Espero no romper nada! 😰',
    }, { quoted: message });

    const botDirectory = path.join(__dirname, '..');

    exec('git pull origin main', { cwd: botDirectory }, async (error, stdout, stderr) => {
      if (error) {
        return await conn.sendMessage(from, {
          text: `*❌ ¡Error fatal!*\n\n> Zenitsu se tropezó con el código...\n🛠️ ${error.message}`,
        }, { quoted: message });
      }

      const ignoredPatterns = ['From https://', 'FETCH_HEAD', 'branch'];
      const cleanStderr = stderr
        .split('\n')
        .filter(line => !ignoredPatterns.some(p => line.includes(p)))
        .join('\n')
        .trim();

      if (cleanStderr) {
        await conn.sendMessage(from, {
          text: `*⚠️ Advertencia durante la actualización:*\n\n> ${cleanStderr}`,
        }, { quoted: message });
      }

      const changes = stdout
        .split('\n')
        .filter(line => line.includes('.js') || line.includes('.json') || line.includes('.md'))
        .map(line => `📁 ${line.trim()}`)
        .join('\n') || '🤷‍♂️ No se detectaron archivos modificados directamente.';

      const formatted = `
╭─「 ⚙️ 𝙐𝙋𝘿𝘼𝙏𝙀 𝙍𝙄𝙏𝙐𝘼𝙇 」─╮
│ ✅ *Actualización completada con éxito*
│ 🧙 *Invocador:* ${ownerlid.includes(sender) || ownerlid.includes(altNormalizedSender) ? 'Guardián Vinculado' : 'Carlos (Maestro del trueno)'}
│ 📅 *Fecha:* ${new Date().toLocaleString()}
│ 📂 *Directorio:* \`${botDirectory}\`
│ 📤 *Archivos modificados:*
│ ${changes}
│ 📜 *Log completo:*
│ \`\`\`
${stdout.trim()}
\`\`\`
╰────────────────────────────╯

😳 Zenitsu sobrevivió al ritual... ¡por ahora! ⚡
`.trim();

      return await conn.sendMessage(from, {
        text: formatted,
      }, { quoted: message });
    });
  },
};