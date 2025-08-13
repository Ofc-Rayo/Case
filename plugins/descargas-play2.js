const axios = require('axios');
const fs = require('fs');
const path = require('path');

const SEARCH_API = 'https://api.vreden.my.id/api/yts?query=';
const STELLAR_API = 'https://api.stellarwa.xyz/dow/ytmp4?url=';
const STELLAR_KEY = 'stellar-w879erKu';

async function handler(conn, { message, args }) {
    const query = args.join(' ');
    if (!query) {
        return conn.sendMessage(message.key.remoteJid, {
            text: '*😰 ¡Zenitsu necesita saber qué video buscar!*\n\n> Ejemplo: `play2 Opening Demon Slayer` 🎬',
        });
    }

    try {
        const searchResponse = await axios.get(`${SEARCH_API}${encodeURIComponent(query)}`);
        if (searchResponse.data && searchResponse.data.result && searchResponse.data.result.all.length > 0) {
            const firstResult = searchResponse.data.result.all[0];

            const messageText = `
╭─「 🎥 𝙕𝙀𝙉𝙄𝙏𝙎𝙐 𝘽𝙊𝙏 - 𝙑𝙄𝘿𝙀𝙊 」─╮
│ 🎬 *Título:* ${firstResult.title}
│ ⏳ *Duración:* ${firstResult.seconds}s
│ 📅 *Subido:* -
│ 👀 *Vistas:* ${firstResult.views.toLocaleString()}
│ 🔽 *Descargando video...*
╰────────────────────╯

*😳 Zenitsu está trabajando en ello... ¡No lo presiones!* ⚡
> Si lo deseas en solo audio, usa: *play ${firstResult.title}*
`.trim();

            const imageUrl = firstResult.thumbnail;

            await conn.sendMessage(message.key.remoteJid, {
                image: { url: imageUrl },
                caption: messageText
            });

            const videoDownloadUrl = await getVideoDownloadUrl(firstResult.url);

            if (videoDownloadUrl) {
                await sendVideoAsFile(conn, message, videoDownloadUrl, firstResult.title);
            } else {
                throw new Error('No se pudo obtener el video.');
            }
        } else {
            await conn.sendMessage(message.key.remoteJid, {
                text: '*🔍 Zenitsu no encontró resultados...*\n\n> Intenta con otro término, por favor.',
            });
        }
    } catch (err) {
        await conn.sendMessage(message.key.remoteJid, {
            text: '*❌ ¡Algo salió mal!*\n\n> Zenitsu se tropezó intentando descargar el video... vuelve a intentarlo más tarde.',
        });
    }
}

async function getVideoDownloadUrl(videoUrl) {
    const apiUrl = `${STELLAR_API}${encodeURIComponent(videoUrl)}&apikey=${STELLAR_KEY}`;

    try {
        const response = await axios.get(apiUrl);
        if (response.data && response.data.status && response.data.data && response.data.data.dl) {
            return response.data.data.dl;
        }
    } catch (err) {
        console.error("Error al obtener la URL de descarga del video:", err);
    }

    return null;
}

async function sendVideoAsFile(conn, message, videoUrl, videoTitle) {
    const sanitizedTitle = videoTitle.replace(/[<>:"/\\|?*\x00-\x1F]/g, '');
    const videoPath = path.resolve(__dirname, `${Date.now()}_${sanitizedTitle}.mp4`);

    try {
        const writer = fs.createWriteStream(videoPath);
        const videoStream = await axios({
            url: videoUrl,
            method: 'GET',
            responseType: 'stream',
        });

        videoStream.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        await conn.sendMessage(message.key.remoteJid, {
            document: { url: videoPath },
            mimetype: 'video/mp4',
            fileName: `${sanitizedTitle}.mp4`
        });

        fs.unlinkSync(videoPath);
    } catch (err) {
        await conn.sendMessage(message.key.remoteJid, {
            text: '*⚠️ Zenitsu no pudo enviar el archivo...*\n\n> Intenta nuevamente, por favor.',
        });
    }
}

module.exports = {
    command: 'play2',
    handler,
};