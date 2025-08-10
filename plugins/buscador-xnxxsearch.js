const axios = require('axios');

async function handler(conn, { message, args }) {
    const query = args.join(' ');
    if (!query) {
        return conn.sendMessage(message.key.remoteJid, {
            text: '*🔞 ¡Zenitsu necesita saber qué buscar!* 😳\n\n> Ejemplo: `xnxx bokep` 💦',
        });
    }

    try {
        const searchUrl = `https://api.vreden.my.id/api/xnxxsearch?query=${encodeURIComponent(query)}`;
        const searchResponse = await axios.get(searchUrl);

        if (searchResponse.data && searchResponse.data.result && searchResponse.data.result.length > 0) {
            const results = searchResponse.data.result.slice(0, 10);

            let listText = '╭─「 🔞 𝙕𝙀𝙉𝙄𝙏𝙎𝙐 𝘽𝙊𝙏 - 𝙍𝙀𝙎𝙐𝙇𝙏𝘼𝘿𝙊𝙎 」─╮\n';
            results.forEach((vid, i) => {
                const infoParts = vid.info.trim().split('\n').join(' ').split(' - ');
                const viewsAndLikes = infoParts[0]?.trim() || 'N/A';
                const duration = infoParts[1]?.trim() || 'N/A';

                listText += `\n${i + 1}. 🎬 *${vid.title}*\n   ⏳ Duración: ${duration}\n   👀 Vistas: ${viewsAndLikes}\n   🔗 ${vid.link}\n`;
            });
            listText += '\n╰────────────────────╯';

            await conn.sendMessage(message.key.remoteJid, { text: listText });
        } else {
            await conn.sendMessage(message.key.remoteJid, {
                text: '*🔍 Zenitsu no encontró resultados...*\n\n> Intenta con otro término, por favor.',
            });
        }
    } catch (err) {
        console.error(err);
        await conn.sendMessage(message.key.remoteJid, {
            text: '*❌ ¡Algo salió mal!*\n\n> Zenitsu se tropezó buscando... vuelve a intentarlo más tarde.',
        });
    }
}

module.exports = {
    command: 'xnxx',
    handler,
};