const { exec } = require('child_process');
const { ownerid } = require('../settings');

module.exports = {
    command: 'logs',
    handler: async (conn, { message, args }) => {
        const from = message.key.remoteJid;
        const sender = message.key.participant || from;

        if (sender !== ownerid) {
            return await conn.sendMessage(from, {
                text: '*😤 ¡Alto ahí!*\n\n> Solo el *gran maestro* puede ver los registros del sistema. Zenitsu no quiere que te asustes...',
            });
        }

        exec('dmesg | tail -n 10', async (error, stdout, stderr) => {
            if (error) {
                return await conn.sendMessage(from, {
                    text: `*❌ ¡Zenitsu se tropezó leyendo los logs!*\n\n> Error: ${error.message}`,
                });
            }

            if (stderr) {
                return await conn.sendMessage(from, {
                    text: `*⚠️ ¡Algo extraño apareció en los registros!*\n\n> ${stderr}`,
                });
            }

            return await conn.sendMessage(from, {
                text: `*📜 Zenitsu revisó los últimos mensajes del sistema...*\n\n\`\`\`\n${stdout}\n\`\`\`\n\n> 😳 ¡No entiende nada, pero lo entregó con valentía!`,
            });
        });
    },
};