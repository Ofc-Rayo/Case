const axios = require('axios');

const thumbnailUrl = 'https://qu.ax/7KXbN.jpg'; // Miniatura vibrante 🌈

const contextInfo = {
    externalAdReply: {
        title: "🌈 Gay Card Generator",
        body: "Tu membresía fabulosa, con estilo y orgullo",
        mediaType: 1,
        previewType: 0,
        mediaUrl: "https://delirius-apiofc.vercel.app",
        sourceUrl: "https://delirius-apiofc.vercel.app",
        thumbnailUrl
    }
};

async function handler(conn, { args, message }) {
    const [url, name = "Usuario 🌟", rank = "1"] = args;
    if (!url) return conn.reply(message.key.remoteJid, "*❌ Debes proporcionar una URL de imagen.*", message);

    const api = `https://delirius-apiofc.vercel.app/canvas/gaycard?url=${encodeURIComponent(url)}&name=${encodeURIComponent(name)}&rank=${rank}`;

    const caption = `
╭─「 🌈 𝙂𝘼𝙔 - 𝘾𝘼𝙍𝘿 」─╮
│ 🧑‍🎤 *Nombre:* ${name}
│ 🏅 *Rango:* ${rank}
│ 🖼️ *Imagen:* Personalizada
│ 📡 *Fuente:* Delirius Canvas
╰──────────────────────╯

*✨ Tu identidad brilla con orgullo. ¡Bienvenido al club más fabuloso del universo!*
`.trim();

    await conn.sendMessage(message.key.remoteJid, {
        image: { url: api },
        caption,
        contextInfo
    }, { quoted: message });
}

module.exports = {
    command: 'gaycard',
    handler,
};
