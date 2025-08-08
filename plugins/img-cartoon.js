const axios = require('axios');
const fs = require('fs');
const path = require('path');

const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'; // Miniatura ritual constante

const contextInfo = {
    externalAdReply: {
        title: "🎭 Texto Cartoon",
        body: "Convierte tu palabra en una expresión animada con estilo caricaturesco...",
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
            text: '*🎭 ¿Qué palabra deseas transformar en estilo cartoon?*\n\n> Ejemplo: `cartoon alegría`',
            contextInfo
        }, { quoted: message });
    }

    try {
        const apiUrl = `https://api.vreden.my.id/api/maker/ephoto/cartoonstyle?text=${encodeURIComponent(query)}`;
        const response = await axios.get(apiUrl);
        const imageUrl = response.data?.result;

        if (!imageUrl) {
            throw new Error('No se pudo generar el estilo cartoon.');
        }

        const caption = `
╭─「 🎭 𝘾𝘼𝙍𝙏𝙊𝙊𝙉 - 𝙏𝙀𝙓𝙏 」─╮
│ 🖋️ *Palabra:* ${query}
│ 🎨 *Estilo:* Tipografía animada y caricaturesca
│ 📡 *Fuente:* Vreden API
╰────────────────────────╯

*✨ Tu palabra ahora vibra como un personaje en escena...*
`.trim();

        await conn.sendMessage(message.key.remoteJid, {
            image: { url: imageUrl },
            caption,
            contextInfo
        }, { quoted: message });

    } catch (err) {
        console.error('⚠️ Error en el comando cartoon:', err.message);
        await conn.sendMessage(message.key.remoteJid, {
            text: `*❌ No se pudo transformar tu palabra en estilo cartoon...*\n\n> Detalles: ${err.message}`,
            contextInfo
        }, { quoted: message });
    }
}

module.exports = {
    command: 'cartoon',
    handler,
};
