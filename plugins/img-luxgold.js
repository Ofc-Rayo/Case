const axios = require('axios');
const fs = require('fs');
const path = require('path');

const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'; // Miniatura dorada y elegante

const contextInfo = {
    externalAdReply: {
        title: "👑 Letras de Oro",
        body: "Tu palabra en un marco de lujo...",
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
            text: '*💎 ¿Qué palabra deseas coronar en oro?*\n\n> Ejemplo: `luxgold victoria`',
            contextInfo
        }, { quoted: message });
    }

    try {
        const apiUrl = `https://api.vreden.my.id/api/maker/ephoto/luxurygold?text=${encodeURIComponent(query)}`;
        const response = await axios.get(apiUrl);
        const imageUrl = response.data?.result;

        if (!imageUrl) {
            throw new Error('No se pudo generar la imagen dorada.');
        }

        const caption = `
╭─「 👑 𝙇𝙐𝙓𝙐𝙍𝙔 - 𝙂𝙊𝙇𝘿 」─╮
│ 🖋️ *Palabra:* ${query}
│ 💫 *Estilo:* Dorado ceremonial
│ 📡 *Fuente:* Vreden API
╰────────────────────────╯

*✨ Tu palabra ahora brilla como un emblema real, forjada en oro y elegancia eterna...*
`.trim();

        await conn.sendMessage(message.key.remoteJid, {
            image: { url: imageUrl },
            caption,
            contextInfo
        }, { quoted: message });

    } catch (err) {
        console.error('⚠️ Error en el comando luxgold:', err.message);
        await conn.sendMessage(message.key.remoteJid, {
            text: `*❌ No se pudo coronar tu palabra en oro...*\n\n> Detalles: ${err.message}`,
            contextInfo
        }, { quoted: message });
    }
}

module.exports = {
    command: 'luxgold',
    handler,
};
