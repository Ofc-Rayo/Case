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
            text: '*😰 Zenitsu se quedó sin ritmo...*\n\n> Ejemplo: `play lintang asmoro` 🎶',
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

        const audioRes = await axios.get(`https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(video.url)}`);
        const audio = audioRes.data?.result;

        // Validación escénica: ¿el audio coincide con la búsqueda?
        const titleMatch = audio?.metadata?.title?.toLowerCase().includes(query.toLowerCase());

        if (!audio || !audio.download || !audio.download.status || !titleMatch) {
            return conn.sendMessage(message.key.remoteJid, {
                text: `😢 *Zenitsu no pudo convertir el audio de:* ${video.title}\n\n🛠️ ${audio?.download?.message || 'Converting error'}\n🎭 ¿Intentamos con otro título más claro o menos viral?`,
                contextInfo
            }, { quoted: message });
        }

        await conn.sendMessage(message.key.remoteJid, {
            audio: { url: audio.download.url },
            fileName: `${audio.metadata.title}.mp3`,
            mimetype: "audio/mp4",
            ptt: false,
            contextInfo
        }, { quoted: message });

        // Despedida eliminada para mantener el flujo limpio

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