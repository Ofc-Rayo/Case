const axios = require('axios');
const fs = require('fs');
const path = require('path');

const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'; // Miniatura ritual constante

const contextInfo = {
    externalAdReply: {
        title: "✍️ Texto Escrito",
        body: "Tu palabra se plasma como caligrafía ritual sobre lienzo digital...",
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
            text: '*✍️ ¿Qué palabra deseas escribir con estilo ceremonial?*\n\n> Ejemplo: `escritura vreden`',
            contextInfo
        }, { quoted: message });
    }

    try {
        const apiUrl = `https://api.vreden.my.id/api/maker/ephoto/writetext?text=${encodeURIComponent(query)}`;
        const response = await axios.get(apiUrl);
        const imageUrl = response.data?.result;

        if (!imageUrl) {
            throw new Error('No se pudo generar el texto escrito.');
        }

        const caption = `
╭─「 ✍️ 𝙀𝙎𝘾𝙍𝙄𝙏𝙐𝙍𝘼 - 𝘾𝘼𝙇𝙄𝙂𝙍𝘼𝙁𝙄́𝘼 」─╮
│ 🔤 *Texto:* ${query}
│ 📜 *Estilo:* Escritura ritual sobre fondo artístico
│ 🧬 *Fuente:* Vreden API
╰────────────────────────╯

*🪶 Tu palabra se convierte en trazo ceremonial, como un susurro gráfico sobre el lienzo del código...*
`.trim();

        await conn.sendMessage(message.key.remoteJid, {
            image: { url: imageUrl },
            caption,
            contextInfo
        }, { quoted: message });

    } catch (err) {
        console.error('⚠️ Error en el comando escritura:', err.message);
        await conn.sendMessage(message.key.remoteJid, {
            text: `*❌ No se pudo escribir tu palabra con estilo ritual...*\n\n> Detalles: ${err.message}`,
            contextInfo
        }, { quoted: message });
    }
}

module.exports = {
    command: 'escritura',
    handler,
};
