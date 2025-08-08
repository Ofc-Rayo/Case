const axios = require('axios');
const fs = require('fs');
const path = require('path');

const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'; // Miniatura con aura imperial

const contextInfo = {
    externalAdReply: {
        title: "👑 Texto Real",
        body: "Convierte palabras en inscripciones majestuosas...",
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
            text: '*👑 ¿Qué palabra deseas coronar?*\n\n> Ejemplo: `real victoria`',
            contextInfo
        }, { quoted: message });
    }

    try {
        const apiUrl = `https://api.vreden.my.id/api/maker/ephoto/royaltext?text=${encodeURIComponent(query)}`;
        const response = await axios.get(apiUrl);
        const imageUrl = response.data?.result;

        if (!imageUrl) {
            throw new Error('No se pudo generar el texto real.');
        }

        const caption = `
╭─「 👑 𝙏𝙀𝙓𝙏𝙊 - 𝙍𝙀𝘼𝙇 」─╮
│ 🖋️ *Palabra:* ${query}
│ 🏰 *Estilo:* Inscripción regia
│ 📡 *Fuente:* Vreden API
╰────────────────────╯

*✨ Tu palabra ha sido coronada con elegancia digital...*
`.trim();

        await conn.sendMessage(message.key.remoteJid, {
            image: { url: imageUrl },
            caption,
            contextInfo
        }, { quoted: message });

    } catch (err) {
        console.error('⚠️ Error en el comando real:', err.message);
        await conn.sendMessage(message.key.remoteJid, {
            text: `*❌ No se pudo coronar tu palabra...*\n\n> Detalles: ${err.message}`,
            contextInfo
        }, { quoted: message });
    }
}

module.exports = {
    command: 'real',
    handler,
};
