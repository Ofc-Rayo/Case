const axios = require('axios');
const fs = require('fs');
const path = require('path');

const thumbnailUrl = 'https://qu.ax/galaxywall.jpg'; // Miniatura cósmica y envolvente

const contextInfo = {
    externalAdReply: {
        title: "🌌 Fondo Galáctico",
        body: "Convierte palabras en paisajes estelares...",
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
            text: '*🌠 ¿Qué palabra deseas lanzar al universo como fondo?*\n\n> Ejemplo: `galaxywall destino`',
            contextInfo
        }, { quoted: message });
    }

    try {
        const apiUrl = `https://api.vreden.my.id/api/maker/ephoto/galaxywallpaper?text=${encodeURIComponent(query)}`;
        const response = await axios.get(apiUrl);
        const imageUrl = response.data?.result;

        if (!imageUrl) {
            throw new Error('No se pudo generar el fondo galáctico.');
        }

        const caption = `
╭─「 🌌 𝙂𝘼𝙇𝘼𝙓𝙔 - 𝙒𝘼𝙇𝙇𝙋𝘼𝙋𝙀𝙍 」─╮
│ 🖋️ *Palabra:* ${query}
│ 🪐 *Estilo:* Fondo estelar digital
│ 📡 *Fuente:* Vreden API
╰────────────────────────╯

*✨ Tu palabra ahora flota entre nebulosas y constelaciones...*
`.trim();

        await conn.sendMessage(message.key.remoteJid, {
            image: { url: imageUrl },
            caption,
            contextInfo
        }, { quoted: message });

    } catch (err) {
        console.error('⚠️ Error en el comando galaxywall:', err.message);
        await conn.sendMessage(message.key.remoteJid, {
            text: `*❌ No se pudo proyectar tu palabra en el cosmos...*\n\n> Detalles: ${err.message}`,
            contextInfo
        }, { quoted: message });
    }
}

module.exports = {
    command: 'galaxywall',
    handler,
};
