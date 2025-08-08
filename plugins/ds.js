const fs = require('fs');
const path = require('path');
const { ownerid, botname } = require('../settings');

module.exports = {
    command: 'ds',
    handler: async (conn, { message }) => {
        const from = message.key.remoteJid;
        const sender = message.key.participant || from;

        if (sender !== ownerid) {
            return await conn.sendMessage(from, {
                text: `*😤 ¡Alto ahí!*\n\n> Solo el *gran maestro* de ${botname} puede usar este comando... Zenitsu está vigilando 👀`,
            });
        }

        try {
            const sessionsPath = path.resolve(__dirname, '../sessions');

            if (!fs.existsSync(sessionsPath)) {
                return await conn.sendMessage(from, {
                    text: '*😰 ¡No encuentro la carpeta de sesiones!*\n\n> Zenitsu está entrando en pánico... ¿seguro que existe?',
                });
            }

            const files = fs.readdirSync(sessionsPath);
            const unnecessaryFiles = files.filter((file) => file !== 'creds.json');

            if (unnecessaryFiles.length === 0) {
                return await conn.sendMessage(from, {
                    text: '*✅ Todo está limpio, como el corazón de Zenitsu.*\n\n> No hay archivos innecesarios que eliminar.',
                });
            }

            unnecessaryFiles.forEach((file) => {
                fs.unlinkSync(path.join(sessionsPath, file));
            });

            await conn.sendMessage(from, {
                text: `*🧹 Zenitsu eliminó las sesiones con valentía:*\n${unnecessaryFiles.map(file => `⚡ ${file}`).join('\n')}\n\n> ¡${botname} está listo para brillar otra vez! ✨`,
            });

            await conn.sendMessage(from, {
                text: '*😳 ¿Eh? ¿Me estás viendo? ¡No me mires tanto!*',
            });
        } catch (err) {
            await conn.sendMessage(from, {
                text: '*💥 ¡Algo salió mal!*\n\n> Zenitsu se tropezó mientras borraba las sesiones... intenta de nuevo más tarde.',
            });
        }
    },
};