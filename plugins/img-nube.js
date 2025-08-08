const axios = require('axios');
const fs = require('fs');
const path = require('path');

const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'; // Miniatura ritual constante

const contextInfo = {
    externalAdReply: {
        title: "☁️ Texto en Nubes",
        body: "Tu palabra se disuelve en cielos oníricos y vaporosos...",
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
            text: '*☁️ ¿Qué palabra deseas elevar entre nubes?*\n\n> Ejemplo: `nube esperanza`',
            contextInfo
        }, { quoted: message });
    }

    try {
        const apiUrl = `https://api.vreden.my.id/api/maker/ephoto/effectclouds?text=${encodeURIComponent(query)}`;
        const response = await axios.get(apiUrl);
        const imageUrl = response.data?.result;

        if (!imageUrl) {
            throw new Error('No se pudo generar el efecto de nubes.');
        }

        const caption = `
╭─「 ☁️ 𝙉𝙐𝘽𝙀𝙎 - 𝙀𝙁𝙀𝘾𝙏𝙊 」─╮
│ 🌬️ *Palabra:* ${query}
│ 🌌 *Estilo:* Letras flotando entre nubes digitales
│ 📡 *Fuente:* Vreden API
╰────────────────────────╯

*✨ Tu palabra ahora respira entre vapores celestes...*
`.trim();

        await conn.sendMessage(message.key.remoteJid, {
            image: { url: imageUrl },
            caption,
            contextInfo
        }, { quoted: message });

    } catch (err) {
        console.error('⚠️ Error en el comando nube:', err.message);
        await conn.sendMessage(message.key.remoteJid, {
            text: `*❌ No se pudo transformar tu palabra en nubes...*\n\n> Detalles: ${err.message}`,
            contextInfo
        }, { quoted: message });
    }
}

module.exports = {
    command: 'nube',
    handler,
};
