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

    const encodedPrompt = encodeURIComponent(prompt);
    const apiVreden = `https://api.vreden.my/text2image?prompt=${encodedPrompt}`;
    const apiStarlight = `https://apis-starlights-team.koyeb.app/starlight/txt-to-image2?text=${encodedPrompt}`;

    try {
        // 🎨 Primer intento con Vreden
        const response = await axios.get(apiVreden);
        const result = response?.data?.result;
        const imageUrl = result?.download;

        if (!imageUrl) throw new Error('No se encontró la imagen en la respuesta.');

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

    } catch (errorVreden) {
        console.warn('⚠️ Fallback a Starlight por error en Vreden:', errorVreden.message);

        try {
            // 🌌 Segundo intento con Starlight
            const responseStarlight = await axios.get(apiStarlight);
            const imageUrl = responseStarlight?.data?.data?.image;

            if (!imageUrl) throw new Error('Starlight no devolvió una imagen válida.');

            const caption = `
╭─「 🖼️ 𝙄𝙈𝘼𝙂𝙀𝙉 - 𝙍𝙀𝙎𝙋𝘼𝙇𝘿𝙊 」─╮
│ 🧠 *Prompt:* ${prompt}
│ 🪄 *Modelo:* Starlight txt-to-image
│ 🌐 *Fuente:* starlights-team.koyeb.app
╰────────────────────────╯

Zenitsu usó su último aliento... ¡y la imagen emergió! 🌠
`.trim();

            await conn.sendMessage(jid, {
                image: { url: imageUrl },
                caption,
                contextInfo
            }, { quoted: message });

        } catch (errorStarlight) {
            const status = errorStarlight.response?.status;

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
│ 📄 *Detalles:* ${errorStarlight.message}
│ 🔁 *Sugerencia:* Intenta con otra descripción o más tarde.
╰─────────────────────╯

Zenitsu está temblando... ¡pero lo intentará de nuevo! 😖
`.trim(),
                    contextInfo
                }, { quoted: message });
            }
        }
    }
}

module.exports = {
    command: 'dalle',
    handler,
};