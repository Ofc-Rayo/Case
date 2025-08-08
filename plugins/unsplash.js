const axios = require('axios');
const baileys = require('@whiskeysockets/baileys');

const thumbnailUrl = 'https://qu.ax/unsplash.jpg'; // Imagen evocadora de atmósfera

const contextInfo = {
    externalAdReply: {
        title: "🌌 Unsplash Visions",
        body: "Fragmentos visuales desde mundos paralelos...",
        mediaType: 1,
        previewType: 0,
        mediaUrl: null,
        sourceUrl: "https://unsplash.com",
        thumbnailUrl
    }
};

async function handler(conn, { message, args }) {
    const query = args.join(' ');
    if (!query) {
        return conn.sendMessage(message.key.remoteJid, {
            text: '*🔍 ¿Qué deseas contemplar?*\n\n> Escribe una palabra clave para buscar en Unsplash.',
            contextInfo
        }, { quoted: message });
    }

    await conn.sendMessage(message.key.remoteJid, {
        text: '🧭 *Invocando visiones desde Unsplash...*',
        contextInfo
    }, { quoted: message });

    try {
        const response = await axios.get(`https://api.dorratz.com/v2/unsplash?q=${encodeURIComponent(query)}`);
        const data = response.data;

        if (!Array.isArray(data) || data.length < 2) {
            return conn.sendMessage(message.key.remoteJid, {
                text: '📭 *No se encontraron suficientes imágenes para formar una galería.*',
                contextInfo
            }, { quoted: message });
        }

        const images = data.slice(0, 10).map(img => ({
            type: 'image',
            data: { url: img.image_url }
        }));

        const caption = `
╭─「 🌌 𝙐𝙉𝙎𝙋𝙇𝘼𝙎𝙃 - 𝙂𝘼𝙇𝙀𝙍𝙄𝘼 」─╮
│ 🔎 *Tema:* ${query}
│ 🖼️ *Imágenes:* ${images.length}
│ 🌐 *Fuente:* Unsplash API
╰────────────────────╯
*🫧 Fragmentos de belleza suspendida...*
`.trim();

        await sendAlbumMessage(message.key.remoteJid, images, conn, { caption, quoted: message });

    } catch (err) {
        console.error('❌ Error en Unsplash:', err.message);
        await conn.sendMessage(message.key.remoteJid, {
            text: '🚫 *Algo falló al conectar con Unsplash.*',
            contextInfo
        }, { quoted: message });
    }
}

module.exports = {
    command: 'unsplash',
    handler,
};
