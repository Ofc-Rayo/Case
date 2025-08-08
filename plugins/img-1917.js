const axios = require('axios');
const fs = require('fs');
const path = require('path');

const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'; // Imagen evocadora estilo guerra vintage

const contextInfo = {
    externalAdReply: {
        title: "🎖️ Texto 1917",
        body: "Convierte palabras en arte épico de guerra...",
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
            text: '*🎖️ ¿Qué palabra deseas transformar en estilo 1917?*\n\n> Ejemplo: `1917 esperanza`',
            contextInfo
        }, { quoted: message });
    }

    try {
        const apiUrl = `https://api.vreden.my.id/api/maker/ephoto/1917style?text=${encodeURIComponent(query)}`;
        const response = await axios.get(apiUrl);
        const imageUrl = response.data?.result;

        if (!imageUrl) {
            throw new Error('No se pudo generar el estilo 1917.');
        }

        const caption = `
╭─「 🎖️ 𝙏𝙀𝙓𝙏𝙊 - 𝙀𝙎𝙏𝙄𝙇𝙊 𝟙𝟡𝟙𝟟 」─╮
│ 🖋️ *Palabra:* ${query}
│ 🎬 *Estética:* Cine bélico vintage
│ 📡 *Fuente:* Vreden API
╰────────────────────────╯

*🌫️ Tu palabra ahora marcha entre sombras y gloria...*
`.trim();

        await conn.sendMessage(message.key.remoteJid, {
            image: { url: imageUrl },
            caption,
            contextInfo
        }, { quoted: message });

    } catch (err) {
        console.error('⚠️ Error en el comando 1917:', err.message);
        await conn.sendMessage(message.key.remoteJid, {
            text: `*❌ No se pudo transformar tu palabra...*\n\n> Detalles: ${err.message}`,
            contextInfo
        }, { quoted: message });
    }
}

module.exports = {
    command: '1917',
    handler,
};
