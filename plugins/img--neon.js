const axios = require('axios');
const fs = require('fs');
const path = require('path');

const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'; // Miniatura con aura fluorescente

const contextInfo = {
    externalAdReply: {
        title: "⚡ Texto Neón",
        body: "Convierte palabras en luces vibrantes...",
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
            text: '*⚡ ¿Qué palabra deseas iluminar en neón?*\n\n> Ejemplo: `neon energía`',
            contextInfo
        }, { quoted: message });
    }

    try {
        const apiUrl = `https://api.vreden.my.id/api/maker/ephoto/makingneon?text=${encodeURIComponent(query)}`;
        const response = await axios.get(apiUrl);
        const imageUrl = response.data?.result;

        if (!imageUrl) {
            throw new Error('No se pudo generar el texto neón.');
        }

        const caption = `
╭─「 ⚡ 𝙏𝙀𝙓𝙏𝙊 - 𝙉𝙀Ó𝙉 」─╮
│ 🖋️ *Palabra:* ${query}
│ 💡 *Estilo:* Luz de neón digital
│ 📡 *Fuente:* Vreden API
╰────────────────────╯

*🌃 Tu palabra ahora brilla en la noche digital...*
`.trim();

        await conn.sendMessage(message.key.remoteJid, {
            image: { url: imageUrl },
            caption,
            contextInfo
        }, { quoted: message });

    } catch (err) {
        console.error('⚠️ Error en el comando neon:', err.message);
        await conn.sendMessage(message.key.remoteJid, {
            text: `*❌ No se pudo iluminar tu palabra...*\n\n> Detalles: ${err.message}`,
            contextInfo
        }, { quoted: message });
    }
}

module.exports = {
    command: 'neon',
    handler,
};
