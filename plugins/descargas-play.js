const axios = require('axios');

const thumbnailUrl = 'https://qu.ax/QuwNu.jpg';

const contextInfo = {
    externalAdReply: {
        title: "🎧 YouTube DJ Ambatukam",
        body: "Transmisión directa desde el universo viral...",
        mediaType: 1,
        previewType: 0,
        mediaUrl: "https://youtube.com",
        sourceUrl: "https://youtube.com",
        thumbnailUrl
    }
};

async function handler(conn, { message, args }) {
    const query = args.join(' ');
    if (!query) {
        return conn.sendMessage(message.key.remoteJid, {
            text: '*😰 Zenitsu se quedó sin ritmo...*\n\n> Ejemplo: `play dj ambatukam` 🎶',
            contextInfo
        }, { quoted: message });
    }

    await conn.sendMessage(message.key.remoteJid, {
        text: `🔎 *Buscando en YouTube...*\n🎞️ Afinando melodías de *${query}*`,
        contextInfo
    }, { quoted: message });

    try {
        const searchRes = await axios.get(`https://api.vreden.my.id/api/yts?query=${encodeURIComponent(query)}`);
        const video = searchRes.data?.result?.all?.[0];

        if (!video) {
            return conn.sendMessage(message.key.remoteJid, {
                text: `❌ *Zenitsu no encontró transmisiones para:* ${query}`,
                contextInfo
            }, { quoted: message });
        }

        const caption = `
╭─「 🎧 𝙕𝙀𝙉𝙄𝙏𝙎𝙐 - 𝙔𝙊𝙐𝙏𝙐𝘽𝙀 」─╮
│ 🎬 *Título:* ${video.title}
│ 👤 *Autor:* ${video.author.name}
│ ⏱️ *Duración:* ${video.duration.timestamp}
│ 👁️ *Vistas:* ${video.views.toLocaleString()}
│ 🔗 *YouTube:* ${video.url}
╰────────────────────────────╯
`.trim();

        await conn.sendMessage(message.key.remoteJid, {
            image: { url: video.thumbnail },
            caption,
            contextInfo
        }, { quoted: message });

        const downloadRes = await axios.get(`https://myapiadonix.vercel.app/api/ytmp3?url=${encodeURIComponent(video.url)}`);
        const audio = downloadRes.data?.result;

        if (!audio || !audio.url) {
            return conn.sendMessage(message.key.remoteJid, {
                text: `❌ *No se pudo obtener el audio para:* ${video.title}`,
                contextInfo
            }, { quoted: message });
        }

        await conn.sendMessage(message.key.remoteJid, {
            audio: { url: audio.url },
            fileName: `${video.title}.mp3`,
            mimetype: "audio/mp4",
            ptt: false,
            contextInfo
        }, { quoted: message });

        await conn.sendMessage(message.key.remoteJid, {
            text: `🌸 *Gracias por compartir tu ritmo con Zenitsu.*\n🎶 Que el beat te acompañe siempre.`,
            contextInfo
        }, { quoted: message });

    } catch (err) {
        console.error("⚠️ Error en el comando play:", err.message);
        await conn.sendMessage(message.key.remoteJid, {
            text: `❌ *Error inesperado en la reproducción.*\n\n🛠️ ${err.message}`,
            contextInfo
        }, { quoted: message });
    }
}

module.exports = {
    command: 'play',
    handler,
};