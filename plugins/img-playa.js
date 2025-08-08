const axios = require('axios');
const fs = require('fs');
const path = require('path');

const thumbnailUrl = 'https://qu.ax/summerbeach.jpg'; // Miniatura tropical y soleada

const contextInfo = {
    externalAdReply: {
        title: "🏝️ Texto Playa",
        body: "Convierte palabras en paisajes veraniegos...",
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
            text: '*🌴 ¿Qué palabra deseas grabar en la arena tropical?*\n\n> Ejemplo: `playa libertad`',
            contextInfo
        }, { quoted: message });
    }

    try {
        const apiUrl = `https://api.vreden.my.id/api/maker/ephoto/summerbeach?text=${encodeURIComponent(query)}`;
        const response = await axios.get(apiUrl);
        const imageUrl = response.data?.result;

        if (!imageUrl) {
            throw new Error('No se pudo generar el paisaje veraniego.');
        }

        const caption = `
╭─「 🏝️ 𝙎𝙐𝙈𝙈𝙀𝙍 - 𝘽𝙀𝘼𝘾𝙃 」─╮
│ 🖋️ *Palabra:* ${query}
│ 🌞 *Estilo:* Playa tropical digital
│ 📡 *Fuente:* Vreden API
╰────────────────────────╯

*🌊 Tu palabra ahora descansa entre olas, sol y arena...*
`.trim();

        await conn.sendMessage(message.key.remoteJid, {
            image: { url: imageUrl },
            caption,
            contextInfo
        }, { quoted: message });

    } catch (err) {
        console.error('⚠️ Error en el comando playa:', err.message);
        await conn.sendMessage(message.key.remoteJid, {
            text: `*❌ No se pudo dibujar tu palabra en la arena...*\n\n> Detalles: ${err.message}`,
            contextInfo
        }, { quoted: message });
    }
}

module.exports = {
    command: 'playa',
    handler,
};
