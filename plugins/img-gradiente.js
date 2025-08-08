const axios = require('axios');
const fs = require('fs');
const path = require('path');

const thumbnailUrl = 'https://qu.ax/gradienttext.jpg'; // Miniatura con fondo degradado vibrante

const contextInfo = {
    externalAdReply: {
        title: "🌈 Texto Degradado",
        body: "Convierte palabras en arte tipográfico con gradientes...",
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
            text: '*🎨 ¿Qué palabra deseas transformar en gradiente?*\n\n> Ejemplo: `gradiente armonía`',
            contextInfo
        }, { quoted: message });
    }

    try {
        const apiUrl = `https://api.vreden.my.id/api/maker/ephoto/gradienttext?text=${encodeURIComponent(query)}`;
        const response = await axios.get(apiUrl);
        const imageUrl = response.data?.result;

        if (!imageUrl) {
            throw new Error('No se pudo generar el texto degradado.');
        }

        const caption = `
╭─「 🌈 𝙂𝙍𝘼𝘿𝙄𝙀𝙉𝙏 - 𝙏𝙀𝙓𝙏 」─╮
│ 🖋️ *Palabra:* ${query}
│ 🎨 *Estilo:* Tipografía con degradado digital
│ 📡 *Fuente:* Vreden API
╰────────────────────────╯

*✨ Tu palabra ahora vibra en colores que se funden como emociones...*
`.trim();

        await conn.sendMessage(message.key.remoteJid, {
            image: { url: imageUrl },
            caption,
            contextInfo
        }, { quoted: message });

    } catch (err) {
        console.error('⚠️ Error en el comando gradiente:', err.message);
        await conn.sendMessage(message.key.remoteJid, {
            text: `*❌ No se pudo transformar tu palabra en gradiente...*\n\n> Detalles: ${err.message}`,
            contextInfo
        }, { quoted: message });
    }
}

module.exports = {
    command: 'gradiente',
    handler,
};
