const axios = require('axios');
const fs = require('fs');
const path = require('path');

const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'; // Miniatura ritual constante

const contextInfo = {
    externalAdReply: {
        title: "🎀 Estilo Blackpink",
        body: "Tu palabra se transforma en una firma pop con aura escénica...",
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
            text: '*🎤 ¿Qué palabra deseas transformar en estilo Blackpink?*\n\n> Ejemplo: `blackpinkstyle Vreden`',
            contextInfo
        }, { quoted: message });
    }

    try {
        const apiUrl = `https://api.vreden.my.id/api/maker/ephoto/blackpinkstyle?text=${encodeURIComponent(query)}`;
        const response = await axios.get(apiUrl);
        const imageUrl = response.data?.result;

        if (!imageUrl) {
            throw new Error('No se pudo generar el estilo Blackpink.');
        }

        const caption = `
╭─「 🎀 𝘽𝙇𝘼𝘾𝙆𝙋𝙄𝙉𝙆 - 𝙎𝙏𝙔𝙇𝙀 」─╮
│ 💖 *Palabra:* ${query}
│ 🌟 *Estilo:* Firma pop con estética escénica
│ 📡 *Fuente:* Vreden API
╰────────────────────────╯

*✨ Tu palabra ahora brilla como un ícono del escenario digital...*
`.trim();

        await conn.sendMessage(message.key.remoteJid, {
            image: { url: imageUrl },
            caption,
            contextInfo
        }, { quoted: message });

    } catch (err) {
        console.error('⚠️ Error en el comando blackpinkstyle:', err.message);
        await conn.sendMessage(message.key.remoteJid, {
            text: `*❌ No se pudo transformar tu palabra en estilo Blackpink...*\n\n> Detalles: ${err.message}`,
            contextInfo
        }, { quoted: message });
    }
}

module.exports = {
    command: 'blackpinkstyle',
    handler,
};
