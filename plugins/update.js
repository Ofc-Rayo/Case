const { exec } = require('child_process');
const { ownerid } = require('../settings');
const path = require('path');

module.exports = {
    command: 'update',
    handler: async (conn, { message, args }) => {
        const from = message.key.remoteJid;
        const sender = message.key.participant || from;

        if (sender !== ownerid) {
            return await conn.sendMessage(from, {
                text: '*😤 ¡Alto ahí!*\n\n> Solo el *gran maestro* puede actualizar el bot. Zenitsu está demasiado nervioso para tocar el código...',
            });
        }

        await conn.sendMessage(from, {
            text: '*🔄 Zenitsu está iniciando la actualización...*\n\n> ¡Espero no romper nada! 😰',
        });

        const botDirectory = path.join(__dirname, '..');

        exec('git pull origin main', { cwd: botDirectory }, async (error, stdout, stderr) => {
            if (error) {
                return await conn.sendMessage(from, {
                    text: `*❌ Error al actualizar:*\n\n> ${error.message}`,
                });
            }

            if (stderr) {
                return await conn.sendMessage(from, {
                    text: `*⚠️ Advertencia durante la actualización:*\n\n> ${stderr}`,
                });
            }

            const formatted = `
╭─「 ⚙️ 𝘼𝘾𝙏𝙐𝘼𝙇𝙄𝙕𝘼𝘾𝙄𝙊𝙉 」─╮
│ ✅ *Actualización completada con éxito*
│ 📤 *Resultado:*
│ \`\`\`
${stdout.trim()}
\`\`\`
╰──────────────────────╯
`.trim();

            return await conn.sendMessage(from, {
                text: formatted,
            });
        });
    },
};