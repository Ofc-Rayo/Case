const axios = require('axios');
const fs = require('fs');
const path = require('path');

const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'; // Miniatura ritual constante

const contextInfo = {
    externalAdReply: {
        title: "🧩 Generador de Logo",
        body: "Convierte tu palabra en un emblema visual con presencia digital...",
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
            text: '*🧩 ¿Qué palabra deseas convertir en logo?*\n\n> Ejemplo: `logomaker Vreden`',
            contextInfo
        }, { quoted: message });
    }

    try {
        const apiUrl = `https://api.vreden.my.id/api/maker/ephoto/logomaker?text=${encodeURIComponent(query)}`;
        const response = await axios.get(apiUrl);
        const imageUrl = response.data?.result;

        if (!imageUrl) {
            throw new Error('No se pudo generar el logo.');
        }

        const caption = `
╭─「 🧩 𝙇𝙊𝙂𝙊 - 𝙈𝘼𝙆𝙀𝙍 」─╮
│ 🖋️ *Palabra:* ${query}
│ 🧠 *Estilo:* Emblema visual digital
│ 📡 *Fuente:* Vreden API
╰────────────────────────╯

*✨ Tu palabra ahora se presenta como un símbolo con identidad propia...*
`.trim();

        await conn.sendMessage(message.key.remoteJid, {
            image: { url: imageUrl },
            caption,
            contextInfo
        }, { quoted: message });

    } catch (err) {
        console.error('⚠️ Error en el comando logomaker:', err.message);
        await conn.sendMessage(message.key.remoteJid, {
            text: `*❌ No se pudo transformar tu palabra en logo...*\n\n> Detalles: ${err.message}`,
            contextInfo
        }, { quoted: message });
    }
}

module.exports = {
    command: 'logomaker',
    handler,
};
