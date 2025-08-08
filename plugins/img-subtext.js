const axios = require('axios');
const fs = require('fs');
const path = require('path');

const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'; // Miniatura ritual constante

const contextInfo = {
    externalAdReply: {
        title: "🌊 Texto Submarino",
        body: "Tu palabra sumergida en aguas profundas y luminosas...",
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
            text: '*🌊 ¿Qué palabra deseas sumergir en estilo submarino?*\n\n> Ejemplo: `submarino misterio`',
            contextInfo
        }, { quoted: message });
    }

    try {
        const apiUrl = `https://api.vreden.my.id/api/maker/ephoto/underwatertext?text=${encodeURIComponent(query)}`;
        const response = await axios.get(apiUrl);
        const imageUrl = response.data?.result;

        if (!imageUrl) {
            throw new Error('No se pudo generar el texto submarino.');
        }

        const caption = `
╭─「 🌊 𝙎𝙐𝘽𝙈𝘼𝙍𝙄𝙉𝙊 - 𝙏𝙀𝙓𝙏𝙊 」─╮
│ 🖋️ *Palabra:* ${query}
│ 🐚 *Estilo:* Letras sumergidas en atmósfera acuática
│ 📡 *Fuente:* Vreden API
╰────────────────────────╯

*✨ Tu palabra ahora flota entre corales, reflejos y silencio líquido...*
`.trim();

        await conn.sendMessage(message.key.remoteJid, {
            image: { url: imageUrl },
            caption,
            contextInfo
        }, { quoted: message });

    } catch (err) {
        console.error('⚠️ Error en el comando submarino:', err.message);
        await conn.sendMessage(message.key.remoteJid, {
            text: `*❌ No se pudo sumergir tu palabra...*\n\n> Detalles: ${err.message}`,
            contextInfo
        }, { quoted: message });
    }
}

module.exports = {
    command: 'subtext',
    handler,
};
