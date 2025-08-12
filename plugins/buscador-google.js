const axios = require('axios');

async function handler(conn, { message, args }) {
    const query = args.join(' ');

    if (!query) {
        return conn.sendMessage(message.key.remoteJid, {
            text: '*😰 ¡Zenitsu necesita saber qué buscar!*\n\n> Por favor, escribe un término para que pueda investigar en Google sin desmayarse.',
        });
    }

    try {
        const response = await axios.get(`https://eliasar-yt-api.vercel.app/api/google`, {
            params: { query },
        });

        if (response.data && response.data.status) {
            const results = response.data.results;
            if (results.length > 0) {
                let reply = `*🔍 Zenitsu buscó en Google y encontró esto para:* _${query}_\n\n`;
                results.slice(0, 5).forEach((result, index) => {
                    reply += `⚡ ${index + 1}. *${result.title}*\n🌐 ${result.link}\n\n`;
                });
                await conn.sendMessage(message.key.remoteJid, { text: reply });
            } else {
                await conn.sendMessage(message.key.remoteJid, {
                    text: '*😢 Zenitsu no encontró nada...*\n\n> Tal vez el término es demasiado misterioso.',
                });
            }
        } else {
            await conn.sendMessage(message.key.remoteJid, {
                text: '*💥 Algo salió mal con la búsqueda...*\n\n> Zenitsu está temblando, pero lo intentará de nuevo más tarde.',
            });
        }
    } catch (err) {
        console.error('Error en el comando Google:', err.message);
        await conn.sendMessage(message.key.remoteJid, {
            text: `*❌ ¡Error inesperado!*\n\n> Zenitsu se tropezó mientras buscaba en Google...\n\n*Detalles:* ${err.message}`,
        });
    }
}

module.exports = {
    command: 'google',
    handler,
};
