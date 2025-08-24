const thumbnailUrl = 'https://qu.ax/MvYPM.jpg';

const contextInfo = {
    externalAdReply: {
        title: "📸 Invocación visual por Cenix",
        body: "Una imagen que habla por sí sola...",
        mediaType: 1,
        previewType: 0,
        mediaUrl: "https://o.uguu.se/nQvVhygq.jpg",
        sourceUrl: "https://o.uguu.se/nQvVhygq.jpg",
        thumbnailUrl
    }
};

async function handler(conn, { message }) {
    try {
        const caption = `
╭─「 🎀 𝙈𝙄𝙍𝘼 𝙀𝙎𝙏𝙊 」─╮
│ 🖼️ *Aquí está...*
╰────────────────╯
`.trim();

        await conn.sendMessage(message.key.remoteJid, {
            image: { url: 'https://o.uguu.se/nQvVhygq.jpg' },
            caption,
            contextInfo
        }, { quoted: message });

    } catch (err) {
        console.error('⚠️ Error en el comando Cenix:', err.message);
        await conn.sendMessage(message.key.remoteJid, {
            text: `❌ *No se pudo enviar la imagen.*\n🛠️ ${err.message}`,
            contextInfo
        }, { quoted: message });
    }
}

module.exports = {
    command: 'Cenix',
    handler,
};