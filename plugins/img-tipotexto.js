const axios = require('axios');
const fs = require('fs');
const path = require('path');

const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'; // Miniatura ritual constante

const contextInfo = {
    externalAdReply: {
        title: "🖋️ Texto Tipográfico",
        body: "Tu palabra se transforma en diseño, como un símbolo gráfico de identidad...",
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
            text: '*🖋️ ¿Qué palabra deseas convertir en arte tipográfico?*\n\n> Ejemplo: `tipotexto vreden`',
            contextInfo
        }, { quoted: message });
    }

    try {
        const apiUrl = `https://api.vreden.my.id/api/maker/ephoto/typographytext?text=${encodeURIComponent(query)}`;
        const response = await axios.get(apiUrl);
        const imageUrl = response.data?.result;

        if (!imageUrl) {
            throw new Error('No se pudo generar el texto tipográfico.');
        }

        const caption = `
╭─「 🖋️ 𝙏𝙄𝙋𝙊𝙂𝙍𝘼𝙁𝙄́𝘼 - 𝘼𝙍𝙏𝙀 」─╮
│ 🔤 *Texto:* ${query}
│ 🎨 *Estilo:* Diseño tipográfico ceremonial
│ 🧬 *Fuente:* Vreden API
╰────────────────────────╯

*🎭 Tu palabra se convierte en símbolo gráfico, como una firma visual de tu esencia...*
`.trim();

        await conn.sendMessage(message.key.remoteJid, {
            image: { url: imageUrl },
            caption,
            contextInfo
        }, { quoted: message });

    } catch (err) {
        console.error('⚠️ Error en el comando tipotexto:', err.message);
        await conn.sendMessage(message.key.remoteJid, {
            text: `*❌ No se pudo transformar tu palabra en arte tipográfico...*\n\n> Detalles: ${err.message}`,
            contextInfo
        }, { quoted: message });
    }
}

module.exports = {
    command: 'tipotexto',
    handler,
};
