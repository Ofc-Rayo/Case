// update.js
const { exec } = require('child_process');
const { allOwners } = require('../settings');
const path = require('path');

module.exports = {
  command: 'update',
  handler: async (conn, { message }) => {
    const from   = message.key.remoteJid;
    const sender = message.key.participant || from;

    // debug opcional para ver el ID entrante
    console.log('[DEBUG][update] sender:', sender);

    if (!allOwners.includes(sender)) {
      return await conn.sendMessage(from, {
        text: `*😤 ¡Alto ahí!*\n\n> Solo el *gran maestro Carlos* o los *guardianes autorizados* pueden invocar el ritual de actualización.\nZenitsu tiembla solo de pensarlo...`
      }, { quoted: message });
    }

    await conn.sendMessage(from, {
      text: `*🔄 Zenitsu está iniciando la actualización...*\n\n> ¡Espero no romper nada! 😰`
    }, { quoted: message });

    const botDirectory = path.join(__dirname, '..');
    exec('git pull origin main', { cwd: botDirectory }, async (error, stdout, stderr) => {
      if (error) {
        return await conn.sendMessage(from, {
          text: `*❌ ¡Error fatal!*\n\n> Zenitsu se tropezó con el código...\n🛠️ ${error.message}`
        }, { quoted: message });
      }

      const ignored = ['From https://', 'FETCH_HEAD', 'branch'];
      const cleanErr = stderr
        .split('\n')
        .filter(l => !ignored.some(p => l.includes(p)))
        .join('\n')
        .trim();

      if (cleanErr) {
        await conn.sendMessage(from, {
          text: `*⚠️ Advertencia durante la actualización:*\n\n> ${cleanErr}`
        }, { quoted: message });
      }

      const changes = stdout
        .split('\n')
        .filter(l => l.match(/\.js|\.json|\.md/))
        .map(l => `📁 ${l.trim()}`)
        .join('\n') || '🤷‍♂️ No se detectaron archivos modificados directamente.';

      const formatted = `
╭─「 ⚙️ 𝙐𝙋𝘿𝘼𝙏𝙀 𝙍𝙄𝙏𝙐𝘼𝙇 」─╮
│ ✅ Actualización completada con éxito
│ 🧙 Invocador: ${sender.endsWith('@lid') ? 'Guardián Vinculado' : 'Carlos (Maestro del trueno)'}
│ 📅 Fecha: ${new Date().toLocaleString()}
│ 📂 Directorio: \`${botDirectory}\`
│ 📤 Archivos modificados:
│ ${changes}
│ 📜 Log completo:
│ \`\`\`
${stdout.trim()}
\`\`\`
╰────────────────────────────╯

😳 Zenitsu sobrevivió al ritual... ¡por ahora! ⚡
`.trim();

      return await conn.sendMessage(from, {
        text: formatted
      }, { quoted: message });
    });
  }
};