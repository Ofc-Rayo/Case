const axios = require('axios');
const fs = require('fs');
const path = require('path');

const thumbnailUrl = 'https://qu.ax/7YQvU.jpg'; // Miniatura con atmósfera glitch

const contextInfo = {
    externalAdReply: {
        title: "🗑️ Texto Eliminado",
        body: "Tu palabra se desvanece en un glitch digital...",
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
            text: '*🗑️ ¿Qué palabra deseas borrar del universo digital?*\n\n> Ejemplo: `deletingtext Vreden`',
            contextInfo
        }, { quoted: message });
    }

    try {
        const apiUrl = `https://api.vreden.my.id/api/maker/ephoto/deletingtext?text=${encodeURIComponent(query)}`;
        const response = await axios.get(apiUrl);
        const imageUrl = response.data?.result;

        if (!imageUrl) {
            throw new Error('No se pudo generar el efecto de eliminación.');
        }

        const caption = `
╭─「 🗑️ 𝘿𝙀𝙇𝙀𝙏𝙄𝙉𝙂 - 𝙏𝙀𝙓𝙏 」─╮
│ 🕳️ *Palabra:* ${query}
│ 💥 *Efecto:* Glitch de desaparición digital
│ 📡 *Fuente:* Vreden API
╰────────────────────────╯

*⚠️ Tu palabra ha sido absorbida por el vacío binario...*
`.trim();

        await conn.sendMessage(message.key.remoteJid, {
            image: { url: imageUrl },
            caption,
            contextInfo
        }, { quoted: message });

    } catch (err) {
        console.error('⚠️ Error en el comando deletingtext:', err.message);
        await conn.sendMessage(message.key.remoteJid, {
            text: `*❌ No se pudo aplicar el efecto de eliminación...*\n\n> Detalles: ${err.message}`,
            contextInfo
        }, { quoted: message });
    }
}

module.exports = {
    command: 'deletingtext',
    handler,
};
