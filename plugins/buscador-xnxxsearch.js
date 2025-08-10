const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function handler(conn, { message, args }) {
    const query = args.join(' ');
    if (!query) {
        return conn.sendMessage(message.key.remoteJid, {
            text: '*🔞 ¡Zenitsu necesita saber qué buscar!* 😳\n\n> Ejemplo: `xnxxsearch rusas` 💦',
        });
    }

    try {
        const searchResponse = await axios.get(`https://delirius-apiofc.vercel.app/search/xnxxsearch?query=${encodeURIComponent(query)}`);
        
        if (searchResponse.data && searchResponse.data.result && searchResponse.data.result.length > 0) {
            const firstResult = searchResponse.data.result[0];

            const messageText = `
╭─「 🔞 𝙕𝙀𝙉𝙄𝙏𝙎𝙐 𝘽𝙊𝙏 - 𝙓𝙉𝙓𝙓 」─╮
│ 🎬 *Título:* ${firstResult.title}
│ ⏳ *Duración:* ${firstResult.duration}
│ 🔗 *Link:* ${firstResult.link}
│ 👀 *Vistas:* ${firstResult.views || 'N/A'}
│ 🔽 *Descargando video...*
╰────────────────────╯

*😳 Zenitsu está sudando...* ⚡
`.trim();

            await conn.sendMessage(message.key.remoteJid, {
                image: { url: firstResult.thumb },
                caption: messageText
            });

            const videoDownloadUrl = await getVideoDownloadUrl(firstResult.link);

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
        console.error(err);
        await conn.sendMessage(message.key.remoteJid, {
            text: '*❌ ¡Algo salió mal!*\n\n> Zenitsu se tropezó intentando descargar el video... vuelve a intentarlo más tarde.',
        });
    }
}

async function getVideoDownloadUrl(videoUrl) {
    const apiUrl = `https://delirius-apiofc.vercel.app/download/xnxxdl?url=${encodeURIComponent(videoUrl)}`;

    try {
        const response = await axios.get(apiUrl);
        if (response.data && response.data.result && response.data.result.files) {
            return response.data.result.files.high || response.data.result.files.low;
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
        console.error(err);
        await conn.sendMessage(message.key.remoteJid, {
            text: '*⚠️ Zenitsu no pudo enviar el archivo...*\n\n> Intenta nuevamente, por favor.',
        });
    }
}

module.exports = {
    command: 'xnxxsearch',
    handler,
};