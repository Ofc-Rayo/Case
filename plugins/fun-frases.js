const axios = require('axios');
const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'; // Imagen evocadora

const contextInfo = {
    externalAdReply: {
        title: "💘 Rengoku PickUpLines",
        body: "Frases que encienden el alma...",
        mediaType: 1,
        previewType: 0,
        mediaUrl: "https://givinghawk.me/",
        sourceUrl: "https://givinghawk.me/",
        thumbnailUrl
    }
};

async function handler(conn, { message }) {
    const jid = message.key.remoteJid;

    await conn.sendMessage(jid, {
        text: '🔥 *Rengoku está encendiendo el ritual...*\n\n> ¡Prepárate para una frase que podría derretir corazones! 💫',
        contextInfo
    }, { quoted: message });

    try {
        const response = await axios.get('https://api.popcat.xyz/v2/pickuplines');
        const frase = response?.data?.message?.pickupline;
        const fuente = response?.data?.message?.contributor;

        if (!frase) throw new Error('No se recibió una frase válida.');

        const caption = `
╭─「 💘 𝙁𝙍𝘼𝙎𝙀 - 𝘿𝙀 - 𝘾𝙊𝙉𝙌𝙐𝙄𝙎𝙏𝘼 」─╮
│ 🔥 *Invocador:* Rengoku
│ 💬 *Frase:* "${frase}"
│ 🪶 *Fuente:* ${fuente}
╰────────────────────────────╯

Rengoku ha hablado... ¿te atreves a usarla? ❤️‍🔥
`.trim();

        await conn.sendMessage(jid, {
            text: caption,
            contextInfo
        }, { quoted: message });

    } catch (error) {
        await conn.sendMessage(jid, {
            text: `
❌ *Error al invocar la frase...*

╭─「 ⚠️ 𝙀𝙍𝙍𝙊𝙍 」─╮
│ 📄 *Detalles:* ${error.message}
│ 🔁 *Sugerencia:* Intenta más tarde o consulta el portal de frases.
╰─────────────────────╯

Rengoku se ha consumido en llamas... pero volverá. 🔥
`.trim(),
            contextInfo
        }, { quoted: message });
    }
}

module.exports = {
    command: 'frases',
    handler,
};