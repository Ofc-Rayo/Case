const axios = require('axios');
const fs = require('fs');
const path = require('path');

const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'; // Miniatura ritual constante

const contextInfo = {
    externalAdReply: {
        title: "🌀 Texto Glitch",
        body: "Tu palabra se fragmenta como un error hermoso en el tejido digital...",
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
            text: '*🌀 ¿Qué palabra deseas distorsionar con glitch ritual?*\n\n> Ejemplo: `glitchtexto vreden`',
            contextInfo
        }, { quoted: message });
    }

    try {
        const apiUrl = `https://api.vreden.my.id/api/maker/ephoto/glitchtext?text=${encodeURIComponent(query)}`;
        const response = await axios.get(apiUrl);
        const imageUrl = response.data?.result;

        if (!imageUrl) {
            throw new Error('No se pudo generar el texto glitch.');
        }

        const caption = `
╭─「 🌀 𝙂𝙇𝙄𝙏𝘾𝙃 - 𝙏𝙀𝙓𝙏𝙊 」─╮
│ 🔤 *Texto:* ${query}
│ ⚠️ *Estilo:* Distorsión ritual y estética digital
│ 🧬 *Fuente:* Vreden API
╰────────────────────────╯

*📡 Tu palabra se convierte en interferencia poética, como un mensaje roto que aún resuena...*
`.trim();

        await conn.sendMessage(message.key.remoteJid, {
            image: { url: imageUrl },
            caption,
            contextInfo
        }, { quoted: message });

    } catch (err) {
        console.error('⚠️ Error en el comando glitchtexto:', err.message);
        await conn.sendMessage(message.key.remoteJid, {
            text: `*❌ No se pudo distorsionar tu palabra con glitch ritual...*\n\n> Detalles: ${err.message}`,
            contextInfo
        }, { quoted: message });
    }
}

module.exports = {
    command: 'glitchtexto',
    handler,
};
