const axios = require('axios');
const fs = require('fs');
const path = require('path');

const thumbnailUrl = 'https://qu.ax/3XwqG.jpg'; // Miniatura ritual constante

const contextInfo = {
    externalAdReply: {
        title: "⚡ Texto Luminoso",
        body: "Tu palabra resplandece entre neones y energía vibrante...",
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
            text: '*⚡ ¿Qué palabra deseas iluminar con estilo brillante?*\n\n> Ejemplo: `lumina vreden`',
            contextInfo
        }, { quoted: message });
    }

    try {
        const apiUrl = `https://api.vreden.my.id/api/maker/ephoto/glowingtext?text=${encodeURIComponent(query)}`;
        const response = await axios.get(apiUrl);
        const imageUrl = response.data?.result;

        if (!imageUrl) {
            throw new Error('No se pudo generar el texto luminoso.');
        }

        const caption = `
╭─「 ⚡ 𝙇𝙐𝙈𝙄𝙉𝘼 - 𝙏𝙀𝙓𝙏𝙊 」─╮
│ 🖋️ *Palabra:* ${query}
│ 💡 *Estilo:* Letras brillantes con aura eléctrica
│ 📡 *Fuente:* Vreden API
╰────────────────────────╯

*✨ Tu palabra ahora vibra con luz propia, como un mantra de neón en la penumbra...*
`.trim();

        await conn.sendMessage(message.key.remoteJid, {
            image: { url: imageUrl },
            caption,
            contextInfo
        }, { quoted: message });

    } catch (err) {
        console.error('⚠️ Error en el comando lumina:', err.message);
        await conn.sendMessage(message.key.remoteJid, {
            text: `*❌ No se pudo iluminar tu palabra...*\n\n> Detalles: ${err.message}`,
            contextInfo
        }, { quoted: message });
    }
}

module.exports = {
    command: 'lumina',
    handler,
};
