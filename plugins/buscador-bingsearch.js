const axios = require('axios');

async function handler(conn, { message, args }) {
    const query = args.join(' ');
    if (!query) {
        return conn.sendMessage(message.key.remoteJid, {
            text: '*😰 ¡Zenitsu está confundido!*\n\n> Por favor, dime qué quieres buscar... ¡No me hagas pensar demasiado!',
        });
    }

    try {
        const response = await axios.get(`https://miyanapi.vercel.app/bingSearch?query=${encodeURIComponent(query)}`);
        const searchResults = response.data.data;

        if (!searchResults || searchResults.length === 0) {
           Message(message.key.remoteJid, {
                text: '*😢 No encontré nada...*\n\n> Zenitsu buscó por todos lados, pero no halló resultados.',
            });
        }

        const formattedResults = searchResults
            .map((item, i) => `🔍 *${i + 1}. ${item.Description}*\n🌐 Link: ${item.link}`)
            .join('\n\n');

        const caption = `*⚡ Zenitsu investigó con valentía y encontró esto:*\n\n${formattedResults}`;

        await conn.sendMessage(message.key.remoteJid, { text: caption });
    } catch (err) {
        console.error('💥 Error al realizar la búsqueda:', err.message);
        await conn.sendMessage(message.key.remoteJid, {
            text: '*😵 ¡Algo salió mal!*\n\n> Zenitsu se tropezó con los resultados... vuelve a intentarlo más tarde.',
        });
    }
}

module.exports = {
    command: 'search',
    handler
};
