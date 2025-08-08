const axios = require('axios');
const fs = require('fs');
const path = require('path');

const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'; // Miniatura ritual constante

const contextInfo = {
    externalAdReply: {
        title: "🧊 Texto Pixel Glitch",
        body: "Tu palabra se disuelve en fragmentos digitales, como un recuerdo roto...",
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
            text: '*🧊 ¿Qué palabra deseas pixelar con glitch digital?*\n\n> Ejemplo: `pixelglitch vreden`',
            contextInfo
        }, { quoted: message });
    }

    try {
        const apiUrl = `https://api.vreden.my.id/api/maker/ephoto/pixelglitch?text=${encodeURIComponent(query)}`;
        const response = await axios.get(apiUrl);
        const imageUrl = response.data?.result;

        if (!imageUrl) {
            throw new Error('No se pudo generar el texto pixel glitch.');
        }

        const caption = `
╭─「 🧊 𝙋𝙄𝙓𝙀𝙇 - 𝙂𝙇𝙄𝙏𝘾𝙃 」─╮
│ 🔤 *Texto:* ${query}
│ 🌀 *Estilo:* Fragmentación pixelada y distorsión digital
│ 🧬 *Fuente:* Vreden API
╰────────────────────────╯

*🧠 Tu palabra se convierte en memoria rota, como un eco de datos perdidos en la red...*
`.trim();

        await conn.sendMessage(message.key.remoteJid, {
            image: { url: imageUrl },
            caption,
            contextInfo
        }, { quoted: message });

    } catch (err) {
        console.error('⚠️ Error en el comando pixelglitch:', err.message);
        await conn.sendMessage(message.key.remoteJid, {
            text: `*❌ No se pudo pixelar tu palabra con glitch digital...*\n\n> Detalles: ${err.message}`,
            contextInfo
        }, { quoted: message });
    }
}

module.exports = {
    command: 'pixelglitch',
    handler,
};
