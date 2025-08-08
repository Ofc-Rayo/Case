const axios = require('axios');
const path = require('path');

const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'; // Imagen evocadora

const contextInfo = {
    externalAdReply: {
        title: "🎨 DALL·E Generator",
        body: "Imágenes que nacen de tus palabras...",
        mediaType: 1,
        previewType: 0,
        mediaUrl: "https://www.texttoimage.org",
        sourceUrl: "https://www.texttoimage.org",
        thumbnailUrl
    }
};

async function handler(conn, { message, args }) {
    const prompt = args.join(' ');
    const jid = message.key.remoteJid;

    if (!prompt) {
        return conn.sendMessage(jid, {
            text: '✨ *Por favor proporciona una descripción para generar la imagen.*\n\n> Ejemplo: dalle una princesa flotando entre galaxias',
            contextInfo
        }, { quoted: message });
    }

    await conn.sendMessage(jid, {
        text: '🧧 *Zenitsu está invocando la imagen...*\n\n> ¡Espero que no se derrita el universo! 😰',
        contextInfo
    }, { quoted: message });

    try {
        const response = await axios.get(`https://api.vreden.my.id/api/artificial/text2image?prompt=${encodeURIComponent(prompt)}`);
        const result = response?.data?.result;
        const imageUrl = result?.download;

        if (!imageUrl) {
            throw new Error('No se encontró la imagen en la respuesta.');
        }

        const caption = `
╭─「 🖼️ 𝙄𝙈𝘼𝙂𝙀𝙉 - 𝙂𝙀𝙉𝙀𝙍𝘼𝘿𝘼 」─╮
│ 🧠 *Prompt:* ${result.prompt}
│ 🪄 *Modelo:* Vreden Text2Image
│ 🌐 *Fuente:* texttoimage.org
│ 📅 *Creada:* ${result.created}
╰────────────────────────╯

Zenitsu canalizó la energía... ¡y la imagen ha nacido! ⚡
`.trim();

        await conn.sendMessage(jid, {
            image: { url: imageUrl },
            caption,
            contextInfo
        }, { quoted: message });

    } catch (error) {
        const status = error.response?.status;

        if (status === 403) {
            await conn.sendMessage(jid, {
                text: `
❌ *Acceso denegado por la API...*

╭─「 🚫 𝘾𝙊𝘿𝙄𝙂𝙊 403 」─╮
│ 🔐 *La API ha rechazado la solicitud.*
│ 🧪 *¿Quizás falta una API Key o hay límite de uso?*
│ 📜 *Revisa la documentación de Vreden.*
╰────────────────────────────╯

Zenitsu se ha topado con una barrera mágica... 😵‍💫
`.trim(),
                contextInfo
            }, { quoted: message });
        } else {
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
}

module.exports = {
    command: 'dalle',
    handler,
};
