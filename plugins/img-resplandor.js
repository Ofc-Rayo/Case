const axios = require('axios');
const fs = require('fs');
const path = require('path');

const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'; // Miniatura ritual constante

const contextInfo = {
    externalAdReply: {
        title: "✨ Texto con Resplandor",
        body: "Tu palabra emite luz como un mantra digital en la oscuridad...",
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
            text: '*✨ ¿Qué palabra deseas iluminar con resplandor digital?*\n\n> Ejemplo: `resplandor vreden`',
            contextInfo
        }, { quoted: message });
    }

    try {
        const apiUrl = `https://api.vreden.my.id/api/maker/ephoto/advancedglow?text=${encodeURIComponent(query)}`;
        const response = await axios.get(apiUrl);
        const imageUrl = response.data?.result;

        if (!imageUrl) {
            throw new Error('No se pudo generar el texto con resplandor.');
        }

        const caption = `
╭─「 ✨ 𝙍𝙀𝙎𝙋𝙇𝘼𝙉𝘿𝙊𝙍 - 𝙇𝙐𝙕 」─╮
│ 🔤 *Texto:* ${query}
│ 💡 *Estilo:* Brillo ceremonial y aura digital
│ 🧬 *Fuente:* Vreden API
╰────────────────────────╯

*🌠 Tu palabra ahora brilla como un conjuro visual, irradiando energía en la penumbra...*
`.trim();

        await conn.sendMessage(message.key.remoteJid, {
            image: { url: imageUrl },
            caption,
            contextInfo
        }, { quoted: message });

    } catch (err) {
        console.error('⚠️ Error en el comando resplandor:', err.message);
        await conn.sendMessage(message.key.remoteJid, {
            text: `*❌ No se pudo iluminar tu palabra con resplandor digital...*\n\n> Detalles: ${err.message}`,
            contextInfo
        }, { quoted: message });
    }
}

module.exports = {
    command: 'resplandor',
    handler,
};
