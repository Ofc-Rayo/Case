const axios = require('axios');
const path = require('path');

const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'; // Imagen evocadora

const contextInfo = {
    externalAdReply: {
        title: "🤖 Claude AI",
        body: "Respuestas con el poder de ITzpire...",
        mediaType: 1,
        previewType: 0,
        mediaUrl: "https://itzpire.com/ai/claude",
        sourceUrl: "https://itzpire.com/ai/claude",
        thumbnailUrl
    }
};

async function handler(conn, { message, args }) {
    const prompt = args.join(' ');
    const jid = message.key.remoteJid;

    if (!prompt) {
        return conn.sendMessage(jid, {
            text: '✨ Proporciona una pregunta o instrucción.\n\n> Ejemplo: claude escribe un poema sobre un zorro en la luna',
            contextInfo
        }, { quoted: message });
    }

    await conn.sendMessage(jid, {
        text: '⏳ Zenitsu está consultando a Claude...\n\n> ¡Espero que no se ponga nervioso! 😰',
        contextInfo
    }, { quoted: message });

    try {
        const encodedPrompt = encodeURIComponent(prompt);
        const apiUrl = `https://itzpire.com/ai/claude?q=${encodedPrompt}`;

        const response = await axios.get(apiUrl);
        const result = response?.data?.result;

        if (!result) throw new Error('Claude no devolvió respuesta.');

        const replyText = `
╭─「 🤖 𝘾𝙇𝘼𝙐𝘿𝙀 - 𝙍𝙀𝙎𝙋𝙐𝙀𝙎𝙏𝘼 」─╮
│ 🧠 Prompt: ${prompt}
│ ✨ Creador: *Carlos*
╰────────────────────────╯

${result}
`.trim();

        await conn.sendMessage(jid, {
            text: replyText,
            contextInfo
        }, { quoted: message });

    } catch (error) {
        const status = error.response?.status;

        if (status === 403) {
            await conn.sendMessage(jid, {
                text: `
❌ Acceso denegado por la API...

╭─「 🚫 𝘾𝙊𝘿𝙄𝙂𝙊 403 」─╮
│ 🔐 La API ha rechazado la solicitud.
│ 📜 Revisa si requiere API Key o tiene límite.
╰────────────────────────────╯

Zenitsu se tropezó con un muro mágico... 😵‍💫
`.trim(),
                contextInfo
            }, { quoted: message });
        } else {
            await conn.sendMessage(jid, {
                text: `
❌ Error al generar la respuesta...

╭─「 ⚠️ 𝙀𝙍𝙍𝙊𝙍 」─╮
│ 📄 Detalles: ${error.message}
│ 🔁 Sugerencia: Intenta de nuevo más tarde.
╰─────────────────────╯

Zenitsu está temblando... ¡pero lo intentará otra vez! 😖
`.trim(),
                contextInfo
            }, { quoted: message });
        }
    }
}

module.exports = {
    command: 'claude',
    handler,
};