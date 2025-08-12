const axios = require('axios');

async function handler(conn, { message }) {
    try {
        const response = await axios.get('https://eliasar-yt-api.vercel.app/api/anime-cosplay');
        if (response.data && response.data.status) {
            const cosplayImage = response.data.image;
            const description = `*😳 ¡Zenitsu encontró un cosplay impresionante!*\n\n> 🗣️ *Está tan real que pensó que era un demonio disfrazado...*`;

            await conn.sendMessage(message.key.remoteJid, {
                image: { url: cosplayImage },
                caption: description,
            });
        } else {
            await conn.sendMessage(message.key.remoteJid, {
                text: '*😢 Zenitsu no pudo encontrar ningún cosplay...*\n\n> Tal vez todos están entrenando para el próximo evento.',
            });
        }
    } catch (err) {
        console.error('💥 Error al obtener la imagen de cosplay:', err.message);
        await conn.sendMessage(message.key.remoteJid, {
            text: '*😵 ¡Algo salió mal!*\n\n> Zenitsu se tropezó buscando el cosplay... vuelve a intentarlo más tarde.',
        });
    }
}

module.exports = {
    command: 'cosplay',
    handler,
};
