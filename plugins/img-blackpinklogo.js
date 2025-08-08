const axios = require('axios');
const fs = require('fs');
const path = require('path');

const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'; // Miniatura ritual constante

const contextInfo = {
    externalAdReply: {
        title: "🎤 Logo Blackpink",
        body: "Convierte tu nombre en un emblema pop con aura escénica.",
        mediaType: 1,
        previewType: 0,
        mediaUrl: "https://api.vreden.my.id",
        sourceUrl: "https://api.vreden.my.id",
        thumbnailUrl
    }
};

async function handler(conn, { message, args }) {
    const query = args.join(' ');
    if (!query) {
        return conn.sendMessage(message.key.remoteJid, {
            text: '*🎀 ¿Qué nombre deseas transformar en logo estilo Blackpink?*\n\n> Ejemplo: `blackpinklogo Vreden`',
            contextInfo
        }, { quoted: message });
    }

    try {
        const apiUrl = `https://api.vreden.my.id/api/maker/ephoto/blackpinklogo?text=${encodeURIComponent(query)}`;
        const response = await axios.get(apiUrl);
        const imageUrl = response.data?.result;

        if (!imageUrl) {
            throw new Error('No se pudo generar el logo estilo Blackpink.');
        }

        const caption = `
╭─「 🎀 𝘽𝙇𝘼𝘾𝙆𝙋𝙄𝙉𝙆 - 𝙇𝙊𝙂𝙊 」─╮
│ 💖 *Nombre:* ${query}
│ 🌟 *Estilo:* Logo vibrante con estética pop
│ 📡 *Fuente:* Vreden API
╰────────────────────────╯

*✨ Tu nombre ahora brilla como un ícono del escenario...*
`.trim();

        await conn.sendMessage(message.key.remoteJid, {
            image: { url: imageUrl },
            caption,
            contextInfo
        }, { quoted: message });

    } catch (err) {
        console.error('⚠️ Error en el comando blackpinklogo:', err.message);
        await conn.sendMessage(message.key.remoteJid, {
            text: `*❌ No se pudo generar el logo estilo Blackpink...*\n\n> Detalles: ${err.message}`,
            contextInfo
        }, { quoted: message });
    }
}

module.exports = {
    command: 'blackpinklogo',
    handler,
};
