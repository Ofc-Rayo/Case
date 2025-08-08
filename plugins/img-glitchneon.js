const axios = require('axios');
const fs = require('fs');
const path = require('path');

const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'; // Miniatura ritual constante

const contextInfo = {
    externalAdReply: {
        title: "🌌 Texto Glitch Neon",
        body: "Tu palabra vibra entre neones rotos y pulsos digitales...",
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
            text: '*🌌 ¿Qué palabra deseas distorsionar con neón glitch?*\n\n> Ejemplo: `glitchneon vreden`',
            contextInfo
        }, { quoted: message });
    }

    try {
        const apiUrl = `https://api.vreden.my.id/api/maker/ephoto/neonglitch?text=${encodeURIComponent(query)}`;
        const response = await axios.get(apiUrl);
        const imageUrl = response.data?.result;

        if (!imageUrl) {
            throw new Error('No se pudo generar el texto glitch neon.');
        }

        const caption = `
╭─「 🌌 𝙂𝙇𝙄𝙏𝘾𝙃 - 𝙉𝙀𝙊𝙉 」─╮
│ 🔤 *Texto:* ${query}
│ ⚡ *Estilo:* Neón distorsionado y vibrante
│ 🧬 *Fuente:* Vreden API
╰────────────────────────╯

*⚡ Tu palabra se fragmenta en pulsos eléctricos, como un eco digital en la noche...*
`.trim();

        await conn.sendMessage(message.key.remoteJid, {
            image: { url: imageUrl },
            caption,
            contextInfo
        }, { quoted: message });

    } catch (err) {
        console.error('⚠️ Error en el comando glitchneon:', err.message);
        await conn.sendMessage(message.key.remoteJid, {
            text: `*❌ No se pudo distorsionar tu palabra con glitch neon...*\n\n> Detalles: ${err.message}`,
            contextInfo
        }, { quoted: message });
    }
}

module.exports = {
    command: 'glitchneon',
    handler,
};
