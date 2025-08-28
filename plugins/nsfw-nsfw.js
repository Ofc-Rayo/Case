const axios = require('axios');

async function handler(conn, { message }) {
    const from = message.key.remoteJid;
    const isGroup = from.endsWith('@g.us');
    
    
    if (isGroup) {
        const { getNsfwStatus } = require('../main');
        const nsfwEnabled = getNsfwStatus(from);
        
        if (nsfwEnabled === 'off') {
            return conn.sendMessage(from, {
                text: '🔞 *Contenido NSFW deshabilitado en este grupo.*\n\n> Los administradores pueden activarlo con: `nsfw on`\n\n> Zenitsu está aliviado... ¡estos comandos le dan mucha vergüenza! 😳',
            }, { quoted: message });
        }
    }
    
    try {
        const response = await axios.get('https://eliasar-yt-api.vercel.app/api/nsfw');
        if (response.data && response.data.status) {
            const doujin = response.data.doujin;
            const imageUrl = doujin.image_url;
            const description = `*Título:* ${doujin.title}\n` +
                                `*Artista:* ${doujin.artist}\n` +
                                `*Etiquetas:* ${doujin.tags.join(', ')}\n` +
                                `*Idioma:* ${doujin.language}\n` +
                                `*Enlace:* ${doujin.url}`;

            await conn.sendMessage(message.key.remoteJid, {
                image: { url: imageUrl },
                caption: description,
            });
        } else {
            await conn.sendMessage(message.key.remoteJid, {
                text: 'No se pudo obtener un contenido en este momento. Intenta de nuevo más tarde.',
            });
        }
    } catch (err) {
        console.error('Error al obtener la información:', err.message);
        await conn.sendMessage(message.key.remoteJid, {
            text: 'Hubo un error al procesar tu solicitud. Intenta de nuevo más tarde.',
        });
    }
}

module.exports = {
    command: 'nsfw',
    handler,
};
