const fs = require('fs');
const path = require('path');
const { ownerid } = require('../settings');

module.exports = {
    command: 'rm',
    handler: async (conn, { message, args }) => {
        const from = message.key.remoteJid;
        const sender = message.key.participant || from;

        if (sender !== ownerid) {
            return await conn.sendMessage(from, {
                text: '*😤 ¡Alto ahí!*\n\n> Solo el *gran maestro* puede borrar archivos. Zenitsu está demasiado nervioso para hacerlo...',
            });
        }

        if (args.length === 0) {
            return await conn.sendMessage(from, {
                text: '*😰 ¡Falta la ruta del archivo!*\n\n> Ejemplo: `/rm ../main.js` o `/rm play.js`\nZenitsu necesita instrucciones claras...',
            });
        }

        const filePath = path.resolve(__dirname, args.join(' ').trim());

        try {
            if (!fs.existsSync(filePath)) {
                return await conn.sendMessage(from, {
                    text: `*❌ El archivo "${args.join(' ').trim()}" no existe...*\n\n> Zenitsu lo buscó por todos lados, pero no lo encontró.`,
                });
            }

            fs.unlinkSync(filePath);

            return await conn.sendMessage(from, {
                text: `*🗑️ Archivo eliminado con éxito:*\n\n> "${args.join(' ').trim()}"\n\nZenitsu lo hizo temblando... ¡pero lo logró! ⚡`,
            });
        } catch (err) {
            console.error('Error al borrar el archivo:', err);
            return await conn.sendMessage(from, {
                text: '*❌ ¡Algo salió mal!*\n\n> Zenitsu se tropezó intentando borrar el archivo... vuelve a intentarlo más tarde.',
            });
        }
    },
};
