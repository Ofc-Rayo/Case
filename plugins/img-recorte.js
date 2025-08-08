const axios = require('axios');
const fs = require('fs');
const path = require('path');

const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'; // Miniatura ritual constante

const contextInfo = {
    externalAdReply: {
        title: "✂️ Texto Recortado",
        body: "Tu palabra toma forma en papel cortado con precisión emocional...",
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
            text: '*✂️ ¿Qué palabra deseas transformar en recorte artístico?*\n\n> Ejemplo: `recorte armonía`',
            contextInfo
        }, { quoted: message });
    }

    try {
        const apiUrl = `https://api.vreden.my.id/api/maker/ephoto/papercutstyle?text=${encodeURIComponent(query)}`;
        const response = await axios.get(apiUrl);
        const imageUrl = response.data?.result;

        if (!imageUrl) {
            throw new Error('No se pudo generar el estilo recortado.');
        }

        const caption = `
╭─「 ✂️ 𝙋𝘼𝙋𝙀𝙇 - 𝙍𝙀𝘾𝙊𝙍𝙏𝙀 」─╮
│ 🖋️ *Palabra:* ${query}
│ 🧵 *Estilo:* Letras con textura de papel cortado
│ 📡 *Fuente:* Vreden API
╰────────────────────────╯

*✨ Tu palabra ahora respira como una silueta tallada en emoción...*
`.trim();

        await conn.sendMessage(message.key.remoteJid, {
            image: { url: imageUrl },
            caption,
            contextInfo
        }, { quoted: message });

    } catch (err) {
        console.error('⚠️ Error en el comando recorte:', err.message);
        await conn.sendMessage(message.key.remoteJid, {
            text: `*❌ No se pudo transformar tu palabra en recorte artístico...*\n\n> Detalles: ${err.message}`,
            contextInfo
        }, { quoted: message });
    }
}

module.exports = {
    command: 'recorte',
    handler,
};
