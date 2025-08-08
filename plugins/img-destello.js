const axios = require('axios');
const fs = require('fs');
const path = require('path');

const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'; // Miniatura con aura luminosa

const contextInfo = {
    externalAdReply: {
        title: "🌟 Texto Destello",
        body: "Convierte palabras en luz digital...",
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
            text: '*🌠 ¿Qué palabra deseas iluminar?*\n\n> Ejemplo: `destello esperanza`',
            contextInfo
        }, { quoted: message });
    }

    try {
        const apiUrl = `https://api.vreden.my.id/api/maker/ephoto/lighteffects?text=${encodeURIComponent(query)}`;
        const response = await axios.get(apiUrl);
        const imageUrl = response.data?.result;

        if (!imageUrl) {
            throw new Error('No se pudo generar el efecto de luz.');
        }

        const caption = `
╭─「 🌟 𝘿𝙀𝙎𝙏𝙀𝙇𝙇𝙊 - 𝙏𝙀𝙓𝙏𝙊 」─╮
│ 🖋️ *Palabra:* ${query}
│ 💡 *Estilo:* Efecto de luz digital
│ 📡 *Fuente:* Vreden API
╰────────────────────╯

*✨ Tu palabra brilla con energía celestial...*
`.trim();

        await conn.sendMessage(message.key.remoteJid, {
            image: { url: imageUrl },
            caption,
            contextInfo
        }, { quoted: message });

    } catch (err) {
        console.error('⚠️ Error en el comando destello:', err.message);
        await conn.sendMessage(message.key.remoteJid, {
            text: `*❌ No se pudo iluminar tu palabra...*\n\n> Detalles: ${err.message}`,
            contextInfo
        }, { quoted: message });
    }
}

module.exports = {
    command: 'destello',
    handler,
};
