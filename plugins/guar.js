const fs = require('fs');
const path = require('path');
const { ownerid } = require('../settings');

module.exports = {
    command: 'guar',
    handler: async (conn, { message, args }) => {
        const from = message.key.remoteJid;
        const sender = message.key.participant || from;

        if (sender !== ownerid) {
            return await conn.sendMessage(from, {
                text: '*😤 ¡Alto ahí!*\n\n> Solo el *gran maestro* puede guardar nuevos plugins. Zenitsu está temblando solo de pensarlo...',
            });
        }

        if (args.length < 2) {
            return await conn.sendMessage(from, {
                text: '*😰 Uso incorrecto...*\n\n> Ejemplo:\n`guar nombre.js > código del archivo`\nZenitsu necesita instrucciones claras o se desmaya.',
            });
        }

        const [filename, ...codeParts] = args.join(' ').split('>');
        const code = codeParts.join('>').trim();

        if (!filename || !code) {
            return await conn.sendMessage(from, {
                text: '*😵 ¡Falta información!*\n\n> Por favor, proporciona el nombre del archivo y el código. Zenitsu no puede adivinar...',
            });
        }

        try {
            const filePath = path.resolve(__dirname, filename.trim());

            if (fs.existsSync(filePath)) {
                return await conn.sendMessage(from, {
                    text: `*⚠️ El archivo ${filename.trim()} ya existe...*\n\n> Zenitsu no lo sobrescribirá sin permiso. ¡Es demasiado arriesgado!`,
                });
            }

            fs.writeFileSync(filePath, code, 'utf-8');

            if (!conn.commands) {
                conn.commands = new Map();
            }

            delete require.cache[require.resolve(filePath)];
            const newPlugin = require(filePath);
            conn.commands.set(newPlugin.command, newPlugin.handler);

            await conn.sendMessage(from, {
                text: `*✅ ¡Plugin guardado con éxito!*\n\n> Zenitsu escribió ${filename.trim()} con manos temblorosas... ¡pero lo logró! ⚡`,
            });
        } catch (err) {
            console.error('💥 Error al guardar el plugin:', err);
            await conn.sendMessage(from, {
                text: '*❌ ¡Algo salió mal!*\n\n> Zenitsu se tropezó mientras escribía el plugin... verifica el código y vuelve a intentarlo.',
            });
        }
    },
};