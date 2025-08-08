const axios = require('axios');
const fs = require('fs');
const path = require('path');

const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'; // Miniatura con bandera ondeante

const contextInfo = {
    externalAdReply: {
        title: "🚩 Texto con Bandera 3D",
        body: "Tu palabra ondea como símbolo digital en un espacio tridimensional...",
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
            text: '*🚩 ¿Qué palabra deseas ondear en estilo bandera 3D?*\n\n> Ejemplo: `flag3dtext Vreden`',
            contextInfo
        }, { quoted: message });
    }

    try {
        const apiUrl = `https://api.vreden.my.id/api/maker/ephoto/flag3dtext?text=${encodeURIComponent(query)}`;
        const response = await axios.get(apiUrl);
        const imageUrl = response.data?.result;

        if (!imageUrl) {
            throw new Error('No se pudo generar el efecto de bandera 3D.');
        }

        const caption = `
╭─「 🚩 𝙁𝙇𝘼𝙂 - 𝙏𝙀𝙓𝙏 - 3𝘿 」─╮
│ 🏁 *Palabra:* ${query}
│ 🧭 *Estilo:* Bandera tridimensional ondeando en el espacio digital
│ 📡 *Fuente:* Vreden API
╰────────────────────────╯

*🌬️ Tu palabra ondea como emblema de una nueva nación virtual...*
`.trim();

        await conn.sendMessage(message.key.remoteJid, {
            image: { url: imageUrl },
            caption,
            contextInfo
        }, { quoted: message });

    } catch (err) {
        console.error('⚠️ Error en el comando flag3dtext:', err.message);
        await conn.sendMessage(message.key.remoteJid, {
            text: `*❌ No se pudo ondear tu palabra en estilo bandera 3D...*\n\n> Detalles: ${err.message}`,
            contextInfo
        }, { quoted: message });
    }
}

module.exports = {
    command: 'flag3dtext',
    handler,
};
