const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { ownerid } = require('../settings');

module.exports = {
    command: 'get',
    handler: async (conn, { message, args }) => {
        const from = message.key.remoteJid;
        const sender = message.key.participant || from;

        if (sender !== ownerid) {
            return await conn.sendMessage(from, {
                text: '*😤 ¡Alto ahí!*\n\n> Solo el *gran maestro* puede usar este comando. Zenitsu está vigilando con ojos llorosos 👀',
            });
        }

        if (args.length === 0) {
            return await conn.sendMessage(from, {
                text: '*😰 ¡Zenitsu necesita una URL!*\n\n> Ejemplo: `/get https://example.com`\nNo lo hagas entrar en pánico...',
            });
        }

        const url = args[0];
        const filename = path.basename(new URL(url).pathname) || 'archivo.html';

        try {
            const response = await axios({
                url,
                method: 'GET',
                responseType: 'arraybuffer',
            });

            const contentType = response.headers['content-type'];

            if (contentType.startsWith('image') || contentType.startsWith('video') || contentType.startsWith('application')) {
                const filePath = path.resolve(__dirname, filename);
                fs.writeFileSync(filePath, response.data);

                await conn.sendMessage(from, {
                    text: `*✅ ¡Zenitsu descargó el archivo sin desmayarse!*\n\n> Nombre: ${filename}`,
                });

                const mediaType = contentType.startsWith('image')
                    ? 'image'
                    : contentType.startsWith('video')
                    ? 'video'
                    : 'document';

                const media = fs.readFileSync(filePath);

                await conn.sendMessage(from, {
                    [mediaType]: media,
                    mimetype: contentType,
                    fileName: filename,
                    caption: `📥 *Archivo descargado desde:* ${url}\n\n> Zenitsu lo trajo temblando pero con orgullo.`,
                });

                fs.unlinkSync(filePath);
            } else {
                const text = response.data.toString('utf-8').slice(0, 4000);
                await conn.sendMessage(from, {
                    text: `*🌐 Zenitsu leyó la página con cuidado...*\n\n${text}`,
                });
            }
        } catch (err) {
            console.error('💥 Error al obtener la URL:', err);
            await conn.sendMessage(from, {
                text: `*❌ ¡Algo salió mal!*\n\n> Zenitsu se tropezó intentando acceder a:\n${url}\n\n*Error:* ${err.message}`,
            });
        }
    },
};