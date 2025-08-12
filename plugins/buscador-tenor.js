const fetch = require('node-fetch');
const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'; // Miniatura evocadora

const contextInfo = {
    externalAdReply: {
        title: '🎞️ Buscador de GIFs',
        body: 'Explora animaciones con estilo y emoción',
        mediaType: 1,
        previewType: 0,
        sourceUrl: 'https://tenor.com',
        thumbnailUrl
    }
};

async function handler(conn, { message, args, command }) {
    const query = args.join(' ');
    const from = message.key.remoteJid;

    if (!query) {
        return conn.sendMessage(from, {
            text: `🎬 *Invoca un momento animado...*\n\n> Escribe una palabra clave para buscar GIFs de Nayeon.\n\n📌 Ejemplo:\n${command} nayeon`,
            contextInfo
        }, { quoted: message });
    }

    await conn.sendMessage(from, {
        text: '🔍 *Zenitsu está buscando entre los portales animados...*',
        contextInfo
    }, { quoted: message });

    try {
        const api = `https://delirius-apiofc.vercel.app/search/tenor?q=${encodeURIComponent(query)}`;
        const res = await fetch(api);
        const json = await res.json();
        const results = json.data;

        if (!Array.isArray(results) || results.length === 0) {
            return conn.sendMessage(from, {
                text: `📭 *No se encontraron GIFs para:* "${query}"\n\n> Intenta con otra palabra clave más específica.`,
                contextInfo: {
                    externalAdReply: {
                        title: 'Sin resultados',
                        body: 'Tu búsqueda no trajo animaciones...',
                        thumbnailUrl,
                        sourceUrl: 'https://tenor.com'
                    }
                }
            }, { quoted: message });
        }

        const gif = results[0];

        const caption = `
╭─「 🎀 𝙂𝙄𝙁 𝘿𝙀𝙏𝘼𝙇𝙇𝙀 」─╮
│ 📝 *Descripción:* ${gif.title}
│ 📅 *Fecha:* ${gif.created}
│ 🌐 *Tenor:* ${gif.gif}
╰────────────────────╯

Zenitsu encontró algo... ¡y está llorando de emoción! 😭✨
`.trim();

        await conn.sendMessage(from, {
            video: { url: gif.mp4 },
            caption,
            contextInfo: {
                externalAdReply: {
                    title: `🎬 ${query}`,
                    body: gif.title,
                    thumbnailUrl,
                    sourceUrl: gif.gif
                }
            }
        }, { quoted: message });

    } catch (error) {
        console.error('❌ Error al obtener GIFs:', error.message);
        return conn.sendMessage(from, {
            text: `
🚫 *Algo falló al invocar el GIF...*

╭─「 ⚠️ 𝙀𝙍𝙍𝙊𝙍 」─╮
│ 📄 *Detalles:* ${error.message}
│ 🔁 *Sugerencia:* Intenta más tarde o cambia tu búsqueda.
╰─────────────────╯

Zenitsu está temblando... ¡pero lo intentará de nuevo! ⚡
`.trim(),
            contextInfo: {
                externalAdReply: {
                    title: 'Error en la búsqueda',
                    body: 'No se pudo acceder al portal de GIFs',
                    thumbnailUrl,
                    sourceUrl: 'https://tenor.com'
                }
            }
        }, { quoted: message });
    }
}

module.exports = {
    command: 'tenor',
    handler,
};
