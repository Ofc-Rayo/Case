const axios = require('axios');
const fs = require('fs');
const path = require('path');

const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'; // Miniatura cósmica

const contextInfo = {
    externalAdReply: {
        title: "🌌 Texto Galaxia",
        body: "Convierte palabras en constelaciones digitales...",
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
            text: '*🌠 ¿Qué palabra deseas lanzar al cosmos?*\n\n> Ejemplo: `galaxia sueños`',
            contextInfo
        }, { quoted: message });
    }

    try {
        const apiUrl = `https://api.vreden.my.id/api/maker/ephoto/galaxystyle?text=${encodeURIComponent(query)}`;
        const response = await axios.get(apiUrl);
        const imageUrl = response.data?.result;

        if (!imageUrl) {
            throw new Error('No se pudo generar el estilo galáctico.');
        }

        const caption = `
╭─「 🌌 𝙂𝘼𝙇𝘼𝙓𝙄𝘼 - 𝙏𝙀𝙓𝙏𝙊 」─╮
│ 🖋️ *Palabra:* ${query}
│ ✨ *Estilo:* Galaxia digital
│ 📡 *Fuente:* Vreden API
╰────────────────────╯

*🌌 Tu palabra ahora brilla entre las estrellas...*
`.trim();

        await conn.sendMessage(message.key.remoteJid, {
            image: { url: imageUrl },
            caption,
            contextInfo
        }, { quoted: message });

    } catch (err) {
        console.error('⚠️ Error en el comando galaxia:', err.message);
        await conn.sendMessage(message.key.remoteJid, {
            text: `*❌ No se pudo lanzar tu palabra al universo...*\n\n> Detalles: ${err.message}`,
            contextInfo
        }, { quoted: message });
    }
}

module.exports = {
    command: 'galaxy',
    handler,
};
