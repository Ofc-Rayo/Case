const axios = require('axios');
const fs = require('fs');
const path = require('path');

const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'; // Miniatura ritual constante

const contextInfo = {
    externalAdReply: {
        title: "🚩 Texto con Bandera",
        body: "Tu palabra ondea como símbolo digital sobre tela ceremonial...",
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
            text: '*🚩 ¿Qué palabra deseas bordar sobre una bandera digital?*\n\n> Ejemplo: `bandera libertad`',
            contextInfo
        }, { quoted: message });
    }

    try {
        const apiUrl = `https://api.vreden.my.id/api/maker/ephoto/flagtext?text=${encodeURIComponent(query)}`;
        const response = await axios.get(apiUrl);
        const imageUrl = response.data?.result;

        if (!imageUrl) {
            throw new Error('No se pudo generar el texto con bandera.');
        }

        const caption = `
╭─「 🚩 𝘽𝘼𝙉𝘿𝙀𝙍𝘼 - 𝙏𝙀𝙓𝙏𝙊 」─╮
│ 🖋️ *Palabra:* ${query}
│ 🏁 *Estilo:* Texto sobre tela ceremonial
│ 📡 *Fuente:* Vreden API
╰────────────────────────╯

*✨ Tu palabra ahora ondea como símbolo de una causa digital...*
`.trim();

        await conn.sendMessage(message.key.remoteJid, {
            image: { url: imageUrl },
            caption,
            contextInfo
        }, { quoted: message });

    } catch (err) {
        console.error('⚠️ Error en el comando bandera:', err.message);
        await conn.sendMessage(message.key.remoteJid, {
            text: `*❌ No se pudo bordar tu palabra en la bandera...*\n\n> Detalles: ${err.message}`,
            contextInfo
        }, { quoted: message });
    }
}

module.exports = {
    command: 'bandera',
    handler,
};
