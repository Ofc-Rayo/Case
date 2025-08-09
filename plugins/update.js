// update.js
const { exec }    = require('child_process');
const path        = require('path');
const { allOwners } = require('../settings');

module.exports = {
  command: 'update',
  handler: async (conn, { message }) => {
    const from   = message.key.remoteJid;
    const sender = message.key.participant || from;

    // 🔥 Logs iniciales para depuración
    console.log(`🔥 [DEBUG] Comando update invocado por: ${sender}`);
    console.log('🔥 [DEBUG] allOwners:', allOwners);

    try {
      // 🔐 Validación de owner
      if (!allOwners.includes(sender)) {
        console.log(`🚫 [DEBUG] Usuario no autorizado: ${sender}`);
        return conn.sendMessage(from, {
          text: '*😤 ¡Alto ahí!*\n\n> Solo el gran maestro Carlos o los guardianes autorizados pueden invocar el ritual de actualización.\nZenitsu tiembla solo de pensarlo...'
        }, { quoted: message });
      }

      // 🚀 Mensaje de inicio
      await conn.sendMessage(from, {
        text: '*🔄 Zenitsu está iniciando la actualización...*\n\n> ¡Espero no romper nada! 😰'
      }, { quoted: message });

      const botDirectory = path.join(__dirname, '..');

      exec('git pull origin main', { cwd: botDirectory }, async (error, stdout, stderr) => {

        // 🔥 Logs de salida del git pull
        console.log('🔥 [DEBUG] git pull stdout:', stdout);
        console.log('🔥 [DEBUG] git pull stderr:', stderr);

        // ❌ Manejo de error en git pull
        if (error) {
          console.error('💥 [DEBUG] Error en git pull:', error);
          return conn.sendMessage(from, {
            text: `*❌ ¡Error fatal!*\n\n> Zenitsu se tropezó con el código...\n🛠️ ${error.message}`
          }, { quoted: message });
        }

        // ⚠️ Filtrado de warnings irrelevantes
        const ignoredPatterns = ['From https://', 'FETCH_HEAD', 'branch'];
        const cleanStderr = stderr
          .split('\n')
          .filter(line => !ignoredPatterns.some(p => line.includes(p)))
          .join('\n')
          .trim();

        if (cleanStderr) {
          await conn.sendMessage(from, {
            text: `*⚠️ Advertencia durante la actualización:*\n\n> ${cleanStderr}`
          }, { quoted: message });
        }

        // 📂 Listado de archivos modificados
        const changes = stdout
          .split('\n')
          .filter(line => line.match(/\.js|\.json|\.md/))
          .map(line => `📁 ${line.trim()}`)
          .join('\n') || '🤷‍♂️ No se detectaron archivos modificados directamente.';

        // 🧙 Determina quién invocó (sufijo @lid o @s.whatsapp.net)
        const isLinkedGuardian = sender.endsWith('@lid');
        const invoker = isLinkedGuardian
          ? 'Guardián Vinculado'
          : 'Carlos (Maestro del trueno)';

        // 📝 Mensaje formateado final
        const formatted = [
          '╭─「 ⚙️ 𝙐𝙋𝘿𝘼𝙏𝙀 𝙍𝙄𝙏𝙐𝘼𝙇 」─╮',
          '│ ✅ Actualización completada con éxito',
          `│ 🧙 Invocador: ${invoker}`,
          `│ 📅 Fecha: ${new Date().toLocaleString()}`,
          `│ 📂 Directorio: ${botDirectory}`,
          '│ 📤 Archivos modificados:',
          `│ ${changes.replace(/\n/g, '\n│ ')}`,
          '│ 📜 Log completo:',
          '│ ```',
          stdout.trim(),
          '│ ```',
          '╰────────────────────────────╯',
          '',
          '😳 Zenitsu sobrevivió al ritual... ¡por ahora! ⚡'
        ].join('\n');

        return conn.sendMessage(from, { text: formatted }, { quoted: message });
      });
    } catch (err) {
      console.error('💥 [DEBUG] Excepción en handler update:', err);
      return conn.sendMessage(from, {
        text: '*❌ Ha ocurrido un error inesperado al ejecutar update*'
      }, { quoted: message });
    }
  }
};