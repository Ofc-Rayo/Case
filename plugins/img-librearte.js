const axios = require('axios');
const fs = require('fs');
const path = require('path');

const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'; // Miniatura abstracta y expresiva

const contextInfo = {
    externalAdReply: {
        title: "🪄 Arte Libre",
        body: "Transforma palabras en creaciones espontáneas...",
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
            text: '*🎨 ¿Qué palabra deseas liberar en forma de arte?*\n\n> Ejemplo: `librearte caos`',
            contextInfo
        }, { quoted: message });
    }

    try {
        const apiUrl = `https://api.vreden.my.id/api/maker/ephoto/freecreate?text=${encodeURIComponent(query)}`;
        const response = await axios.get(apiUrl);
        const imageUrl = response.data?.result;

        if (!imageUrl) {
            throw new Error('No se pudo generar la creación libre.');
        }

        const caption = `
╭─「 🪄 𝘼𝙍𝙏𝙀 - 𝙇𝙄𝘽𝙍𝙀 」─╮
│ 🖋️ *Palabra:* ${query}
│ 🎭 *Estilo:* Creación espontánea
│ 📡 *Fuente:* Vreden API
╰────────────────────╯

*🌈 Tu palabra se ha convertido en arte sin límites...*
`.trim();

        await conn.sendMessage(message.key.remoteJid, {
            image: { url: imageUrl },
            caption,
            contextInfo
        }, { quoted: message });

    } catch (err) {
        console.error('⚠️ Error en el comando librearte:', err.message);
        await conn.sendMessage(message.key.remoteJid, {
            text: `*❌ No se pudo liberar tu palabra en arte...*\n\n> Detalles: ${err.message}`,
            contextInfo
        }, { quoted: message });
    }
}

module.exports = {
    command: 'librearte',
    handler,
};
