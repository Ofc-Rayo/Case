const axios = require('axios');

const thumbnailUrl = 'https://qu.ax/QuwNu.jpg';

const contextInfo = {
    externalAdReply: {
        title: "🎧 YouTube Music",
        body: "Reproducción directa desde el universo viral...",
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
            text: '*😰 Zenitsu se quedó sin ritmo...*\n\n> Ejemplo: `play summertime sadness` 🎶',
            contextInfo
        }, { quoted: message });
    }

    await conn.sendMessage(message.key.remoteJid, {
        text: `🔎 *Buscando en YouTube...*\n🎞️ Afinando melodías de *${query}*...`,
        contextInfo
    }, { quoted: message });

    try {
        const searchRes = await axios.get(`https://api.vreden.my.id/api/yts?query=${encodeURIComponent(query)}`);
        const video = searchRes.data?.result?.all?.[0];

        if (!video) {
            return conn.sendMessage(message.key.remoteJid, {
                text: `😢 *Zenitsu no encontró transmisiones para:* ${query}\n🌧️ El universo musical se quedó en silencio...`,
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

        // Conversión con API Delirius
        const audioRes = await axios.get(`https://delirius-apiofc.vercel.app/download/ytmp3?url=${encodeURIComponent(video.url)}`);
        const audio = audioRes.data?.data;

        if (!audio || !audio.download || !audio.download.url) {
            return conn.sendMessage(message.key.remoteJid, {
                text: `😢 *Zenitsu no pudo convertir el audio de:* ${video.title}\n\n🛠️ Converting error\n🎭 ¿Intentamos con otro título más claro o menos viral?`,
                contextInfo
            }, { quoted: message });
        }

        await conn.sendMessage(message.key.remoteJid, {
            audio: { url: audio.download.url },
            fileName: audio.download.filename,
            mimetype: "audio/mp4",
            ptt: false,
            contextInfo
        }, { quoted: message });

        // No se envía despedida final para mantener el cierre musical

    } catch (err) {
        console.error("⚠️ Error en el comando play:", err.message);
        await conn.sendMessage(message.key.remoteJid, {
            text: `❌ *Error inesperado en la reproducción.*\n\n🛠️ ${err.message}\n🌧️ Zenitsu está revisando los cables del universo...`,
            contextInfo
        }, { quoted: message });
    }
}

module.exports = {
    command: 'play',
    handler,
};