const axios = require('axios');
const fs = require('fs');
const path = require('path');

const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'; // Imagen evocadora de verano y arena

const contextInfo = {
    externalAdReply: {
        title: "🏖️ Verano en la Arena",
        body: "Tu palabra escrita bajo el sol...",
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
            text: '*🌞 ¿Qué palabra quieres que el verano grabe en la arena?*\n\n> Ejemplo: `sandsummer libertad`',
            contextInfo
        }, { quoted: message });
    }

    try {
        const apiUrl = `https://api.vreden.my.id/api/maker/ephoto/sandsummer?text=${encodeURIComponent(query)}`;
        const response = await axios.get(apiUrl);
        const imageUrl = response.data?.result;

        if (!imageUrl) {
            throw new Error('No se pudo generar la imagen veraniega.');
        }

        const caption = `
╭─「 🏖️ 𝙎𝘼𝙉𝘿 - 𝙎𝙐𝙈𝙈𝙀𝙍 」─╮
│ 🖋️ *Palabra:* ${query}
│ 🌅 *Estilo:* Arena y sol
│ 📡 *Fuente:* Vreden API
╰────────────────────────╯

*☀️ Tu palabra ahora descansa sobre la arena tibia, bañada por la luz del verano eterno...*
`.trim();

        await conn.sendMessage(message.key.remoteJid, {
            image: { url: imageUrl },
            caption,
            contextInfo
        }, { quoted: message });

    } catch (err) {
        console.error('⚠️ Error en el comando sandsummer:', err.message);
        await conn.sendMessage(message.key.remoteJid, {
            text: `*❌ El sol no pudo escribir tu palabra en la arena...*\n\n> Detalles: ${err.message}`,
            contextInfo
        }, { quoted: message });
    }
}

module.exports = {
    command: 'sandsummer',
    handler,
};
