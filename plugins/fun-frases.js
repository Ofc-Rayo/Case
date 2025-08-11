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
        text: '🔥 *Rengoku está encendiendo el ritual...*\n\n> Una frase está a punto de emerger desde las llamas del deseo... 💫',
        contextInfo
    }, { quoted: message });

    try {
        // 🧠 Paso 1: Obtener la frase original
        const response = await axios.get('https://api.popcat.xyz/v2/pickuplines');
        const fraseOriginal = response?.data?.message?.pickupline;

        if (!fraseOriginal) throw new Error('No se recibió una frase válida.');

        // 🌐 Paso 2: Traducir al español
        const encodedText = encodeURIComponent(fraseOriginal);
        const traduccion = await axios.get(`https://api.popcat.xyz/translate?text=${encodedText}&to=es`);
        const fraseTraducida = traduccion?.data?.translated;

        if (!fraseTraducida) throw new Error('No se pudo traducir la frase.');

        // 🎭 Paso 3: Enviar la frase ritualizada en español
        const caption = `
╭「 💘 𝙁𝙍𝘼𝙎𝙀 - 𝘿𝙀 - 𝘾𝙊𝙉𝙌𝙐𝙄𝙎𝙏𝘼 」╮
│ 🔥 *Invocador:* Frases
│ 💬 *Frase:* "${fraseTraducida}"
│ 👑 *Creador:* _Carlos_
╰─────────────────────╯

Rengoku ha canalizado fuego y palabras... ¿te atreves a usarla? ❤️‍🔥
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