const axios = require('axios');

const thumbnailUrl = 'https://qu.ax/QuwNu.jpg';

const contextInfo = {

    externalAdReply: {

        title: "🎧 Spotify Music",

        body: "Reproducción directa desde el universo K-pop...",

        mediaType: 1,

        previewType: 0,

        mediaUrl: "https://open.spotify.com",

        sourceUrl: "https://open.spotify.com",

        thumbnailUrl

    }

};

async function handler(conn, { message, args }) {

    const query = args.join(' ');

    if (!query) {

        return conn.sendMessage(message.key.remoteJid, {

            text: '*😰 ¡Zenitsu necesita saber qué canción buscar!*\n\n> Ejemplo: `play TWICE` 🎶',

            contextInfo

        }, { quoted: message });

    }

    await conn.sendMessage(message.key.remoteJid, {

        text: `🔎 *Buscando en Spotify...*\n🎞️ Cazando melodías de *${query}*`,

        contextInfo

    }, { quoted: message });

    try {

        const searchRes = await axios.get(`https://delirius-apiofc.vercel.app/search/spotify?q=${encodeURIComponent(query)}&limit=1`);

        const track = searchRes.data?.data?.[0];

        if (!track) {

            return conn.sendMessage(message.key.remoteJid, {

                text: `❌ *Zenitsu no encontró transmisiones para:* ${query}`,

                contextInfo

            }, { quoted: message });

        }

        const caption = `

╭─「 🎧 𝙕𝙀𝙉𝙄𝙏𝙎𝙐 - 𝙎𝙋𝙊𝙏𝙄𝙁𝙔 」─╮

│ 🎬 *Título:* ${track.title}

│ 👤 *Artista:* ${track.artist}

│ 💿 *Álbum:* ${track.album}

│ ⏱️ *Duración:* ${track.duration}

│ 📈 *Popularidad:* ${track.popularity}

│ 📅 *Publicado:* ${track.publish}

│ 🔗 *Spotify:* ${track.url}

╰────────────────────────────╯

`.trim();

        await conn.sendMessage(message.key.remoteJid, {

            image: { url: track.image },

            caption,

            contextInfo

        }, { quoted: message });

        const downloadRes = await axios.get(`https://delirius-apiofc.vercel.app/download/spotifydl?url=${encodeURIComponent(track.url)}`);

        const audioData = downloadRes.data?.data;

        if (!audioData || !audioData.url) {

            return conn.sendMessage(message.key.remoteJid, {

                text: `❌ *No se pudo obtener el audio para:* ${track.title}`,

                contextInfo

            }, { quoted: message });

        }

        await conn.sendMessage(message.key.remoteJid, {

            audio: { url: audioData.url },

            fileName: `${audioData.title}.mp3`,

            mimetype: "audio/mp4",

            ptt: false,

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
