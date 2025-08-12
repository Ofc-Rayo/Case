const axios = require('axios');
const fs = require('fs');

const sendImage = async (conn, to, image, caption = '') => {
    await conn.sendMessage(to, { image, caption });
};

const sendSticker = async (conn, to, sticker) => {
    await conn.sendMessage(to, { sticker });
};

const sendAudio = async (conn, to, audio, ptt = false) => {
    await conn.sendMessage(to, { audio, ptt });
};

const downloadFile = async (url, output) => {
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
    });
    return new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(output);
        response.data.pipe(writer);
        writer.on('finish', () => resolve(output));
        writer.on('error', reject);
    });
};

const sendVideo = async (conn, to, videoUrl, caption = '') => {
    try {
        const filePath = './temp_video.mp4';
        await downloadFile(videoUrl, filePath);
        const videoStream = fs.readFileSync(filePath);
        await conn.sendMessage(to, { video: videoStream, caption });
        fs.unlinkSync(filePath);
    } catch (error) {
        console.error('Error enviando video:', error.message);
    }
};

const sendMedia = async (conn, to, media, caption = '', type = 'image') => {
    if (type === 'image') {
        await sendImage(conn, to, media, caption);
    } else if (type === 'sticker') {
        await sendSticker(conn, to, media);
    } else if (type === 'audio') {
        await sendAudio(conn, to, media);
    } else if (type === 'video') {
        await sendVideo(conn, to, media, caption);
    } else {
        await conn.sendMessage(to, { text: '❌ Tipo de mensaje no soportado.' });
    }
};

const downloadTikTokVideo = async (url) => {
    try {
        const response = await axios.get(`https://api.tiklydown.eu.org/api/download?url=${url}`);
        const videoData = response.data;
        return {
            videoUrl: videoData.video.noWatermark,
            coverImage: videoData.video.cover,
            videoTitle: videoData.title,
            likeCount: videoData.stats.likeCount,
            commentCount: videoData.stats.commentCount,
            shareCount: videoData.stats.shareCount,
            playCount: videoData.stats.playCount,
            saveCount: videoData.stats.saveCount,
            musicTitle: videoData.music.title,
            musicAuthor: videoData.music.author,
            musicCover: videoData.music.cover_large,
        };
    } catch (error) {
        return null;
    }
};

module.exports = {
    command: 'tiktok',
    handler: async (conn, { message, args }) => {
        if (args.length === 0) {
            await conn.sendMessage(message.key.remoteJid, {
                text: '*😰 ¡Zenitsu necesita un enlace de TikTok!*\n\n> Ejemplo: `tiktok https://www.tiktok.com/...`',
            });
            return;
        }

        const tiktokUrl = args[0];
        const videoInfo = await downloadTikTokVideo(tiktokUrl);

        if (videoInfo) {
            const videoMessage = `
╭─「 🎵 𝙏𝙄𝙆𝙏𝙊𝙆 - 𝙄𝙉𝙁𝙊 」─╮
│ 🎬 *Título:* ${videoInfo.videoTitle}
│ 👍 *Likes:* ${videoInfo.likeCount}
│ 💬 *Comentarios:* ${videoInfo.commentCount}
│ 🔄 *Compartidos:* ${videoInfo.shareCount}
│ 👀 *Vistas:* ${videoInfo.playCount}
│ 💾 *Guardados:* ${videoInfo.saveCount}
│ 🎶 *Música:* ${videoInfo.musicTitle} - ${videoInfo.musicAuthor}
╰────────────────────╯
`.trim();

            await conn.sendMessage(message.key.remoteJid, {
                image: { url: videoInfo.musicCover },
                caption: '*🎶 Portada de la música del video*',
            });

            await sendMedia(conn, message.key.remoteJid, videoInfo.videoUrl, videoMessage, 'video');
        } else {
            await conn.sendMessage(message.key.remoteJid, {
                text: '*❌ Zenitsu no pudo obtener el video...*\n\n> Intenta con otro enlace, por favor.',
            });
        }
    },
};
