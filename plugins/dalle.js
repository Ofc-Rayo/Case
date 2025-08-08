const axios = require('axios');
const path = require('path');

const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'; // Imagen evocadora

const contextInfo = {
    externalAdReply: {
        title: "🎨 DALL·E Generator",
        body: "Imágenes que nacen de tus palabras...",
        mediaType: 1,
        previewType: 0,
        mediaUrl: "https://openai.com/dall-e",
        sourceUrl: "https://openai.com/dall-e",
        thumbnailUrl
    }
};

async function handler(conn, { message, args }) {
    const prompt = args.join(' ');
    const jid = message.key.remoteJid;

    if (!prompt) {
        return conn.sendMessage(jid, {
            text: '✨ *Por favor proporciona una descripción para generar la imagen.*\n\n> Ejemplo: dalle un dragón de cristal flotando en el cielo',
            contextInfo
        }, { quoted: message });
    }

    await conn.sendMessage(jid, {
        text: '🧧 *Zenitsu está invocando la imagen...*\n\n> ¡Espero que no se derrita el universo! 😰',
        contextInfo
    }, { quoted: message });

    try {
        const response = await axios.get(`https://api.dorratz.com/v3/ai-image?prompt=${encodeURIComponent(prompt)}`);
        const imageUrl = response?.data?.data?.image_link;

        if (!imageUrl) {
            throw new Error('No se encontró la imagen en la respuesta.');
        }

        const caption = `
╭─「 🖼️ 𝙄𝙈𝘼𝙂𝙀𝙉 - 𝙂𝙀𝙉𝙀𝙍𝘼𝘿𝘼 」─╮
│ 🧠 *Prompt:* ${prompt}
│ 🪄 *Modelo:* DALL·E
│ 🌐 *Fuente:* Dorratz API
╰────────────────────────╯

Zenitsu sobrevivió al hechizo... ¡y aquí está la imagen! ⚡
`.trim();

        await conn.sendMessage(jid, {
            image: { url: imageUrl },
            caption,
            contextInfo
        }, { quoted: message });

    } catch (error) {
        console.error('❌ Error al generar la imagen:', error.message);
        await conn.sendMessage(jid, {
            text: `
❌ *Error al generar la imagen...*

╭─「 ⚠️ 𝙀𝙍𝙍𝙊𝙍 」─╮
│ 📄 *Detalles:* ${error.message}
│ 🔁 *Sugerencia:* Intenta con otra descripción o más tarde.
╰─────────────────────╯

Zenitsu está temblando... ¡pero lo intentará de nuevo! 😖
`.trim(),
            contextInfo
        }, { quoted: message });
    }
}

module.exports = {
    command: 'dalle',
    handler,
};
