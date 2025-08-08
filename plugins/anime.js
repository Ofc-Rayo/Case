const axios = require('axios');

async function handler(conn, { message }) {
    try {
        const response = await axios.get('https://eliasar-yt-api.vercel.app/api/anime/');
        if (response.data && response.data.status) {
            const animeImage = response.data.image;
            const description = `*😳 ¡Zenitsu encontró una imagen de anime!*\n\n> 👾 *Está tan bonita que casi se desmaya...*`;

            await conn.sendMessage(message.key.remoteJid, {
                image: { url: animeImage },
                caption: description,
            });
        } else {
            await conn.sendMessage(message.key.remoteJid, {
                text: '*😭 Zenitsu no pudo encontrar una imagen de anime...*\n\n> ¡Intenta de nuevo más tarde, por favor!',
            });
        }
    } catch (err) {
        console.error('💥 Error al obtener la imagen de anime:', err.message);
        await conn.sendMessage(message.key.remoteJid, {
            text: '*😵 ¡Algo salió mal!*\n\n> Zenitsu se tropezó buscando el anime... vuelve a intentarlo más tarde.',
        });
    }
}

module.exports = {
    command: 'anime',
    handler,
};