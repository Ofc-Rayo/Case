const { exec } = require('child_process');
const { ownerid } = require('../settings');

module.exports = {
    command: 'trm',
    handler: async (conn, { message, args }) => {
        const from = message.key.remoteJid;
        const sender = message.key.participant || from;

        if (sender !== ownerid) {
            return await conn.sendMessage(from, {
                text: '*😤 ¡Alto ahí!*\n\n> Solo el *gran maestro* puede ejecutar comandos en la terminal. Zenitsu no se atreve ni a mirar...',
            });
        }

        if (args.length === 0) {
            return await conn.sendMessage(from, {
                text: '*😰 ¡Falta el comando!*\n\n> Ejemplo: `/trm ls`\nZenitsu necesita instrucciones claras o se desmaya.',
            });
        }

        const command = args.join(' ');
        try {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    return conn.sendMessage(from, {
                        text: `*❌ Error al ejecutar el comando:*\n\n> ${error.message}`,
                    });
                }

                const output = stdout || stderr;
                const formatted = `
╭─「 🖥️ 𝙏𝙀𝙍𝙈𝙄𝙉𝘼𝙇 - 𝙍𝙀𝙎𝙋𝙐𝙀𝙎𝙏𝘼 」─╮
│ 💬 *Comando:* ${command}
│ 📤 *Resultado:*
│ \`\`\`
${output.trim()}
\`\`\`
╰────────────────────────╯
`.trim();

                return conn.sendMessage(from, {
                    text: formatted,
                });
            });
        } catch (err) {
            await conn.sendMessage(from, {
                text: '*❌ ¡Algo salió mal!*\n\n> Zenitsu se tropezó intentando ejecutar el comando... vuelve a intentarlo más tarde.',
            });
        }
    },
};