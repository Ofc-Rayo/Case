const axios = require('axios');
const fs = require('fs');
const path = require('path');

const SEARCH_API = 'https://api.dorratz.com/v3/yt-search?query=';
const YTMP4_API  = 'https://api.vreden.my.id/api/ytmp4?url=';

async function handler(conn, { message, args }) {
  const query = args.join(' ');
  if (!query) {
    return conn.sendMessage(message.key.remoteJid, {
      text: '😰 ¡Zenitsu necesita saber qué video buscar!\n\n> Ejemplo: play2 Opening Demon Slayer 🎬',
    });
  }

  try {
    // 1. Buscar en YouTube
    const searchResponse = await axios.get(`${SEARCH_API}${encodeURIComponent(query)}`);
    const results = searchResponse.data?.data;

    if (!results || results.length === 0) {
      return conn.sendMessage(message.key.remoteJid, {
        text: '🔍 Zenitsu no encontró resultados...\n\n> Intenta con otro término, por favor.',
      });
    }

    const firstResult = results[0];

    // 2. Mensaje inicial
    const messageText = `
╭─「 🎥 𝙕𝙀𝙉𝙄𝙏𝙎𝙐 𝘽𝙊𝙏 - 𝙑𝙄𝘿𝙀𝙊 」─╮
│ 🎬 Título: ${firstResult.title}
│ ⏳ Duración: ${firstResult.duration}
│ 📅 Publicado: ${firstResult.publishedAt}
│ 👀 Vistas: ${firstResult.views.toLocaleString()}
│ 🧑‍💻 Autor: ${firstResult.author.name}
│ 🔽 Descargando video...
╰────────────────────╯

😳 Zenitsu está trabajando en ello... ¡No lo presiones! ⚡
> Si lo deseas en solo audio, usa: play ${firstResult.title}
    `.trim();

    await conn.sendMessage(message.key.remoteJid, {
      image:   { url: firstResult.thumbnail },
      caption: messageText
    });

    // 3. Obtener URL de descarga desde vreden API
    const videoDownloadUrl = await getVideoDownloadUrl(firstResult.url);
    if (!videoDownloadUrl) throw new Error('No se pudo obtener el video.');

    // 4. Descargar, guardar y enviar como documento
    await sendVideoAsFile(conn, message, videoDownloadUrl, firstResult.title);

  } catch (err) {
    console.error('Error en play2:', err);
    await conn.sendMessage(message.key.remoteJid, {
      text: '❌ ¡Algo salió mal!\n\n> Zenitsu se tropezó intentando descargar el video... vuelve a intentarlo más tarde.',
    });
  }
}

async function getVideoDownloadUrl(videoUrl) {
  const apiUrl = `${YTMP4_API}${encodeURIComponent(videoUrl)}`;
  const response = await axios.get(apiUrl);
  console.log('>> vreden API response:', response.data);
  // La nueva API devuelve la URL en result.download.url
  if (response.data?.result?.status && response.data.result.download?.url) {
    return response.data.result.download.url;
  }
  return null;
}

async function sendVideoAsFile(conn, message, videoUrl, videoTitle) {
  const sanitizedTitle = videoTitle.replace(/[<>:"/\\|?*\x00-\x1F]/g, '');
  const videoPath = path.resolve(__dirname, `${Date.now()}_${sanitizedTitle}.mp4`);

  try {
    const writer = fs.createWriteStream(videoPath);
    const videoStream = await axios({
      url:          videoUrl,
      method:       'GET',
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
    console.error('Error enviando archivo:', err);
    await conn.sendMessage(message.key.remoteJid, {
      text: '⚠️ Zenitsu no pudo enviar el archivo...\n\n> Intenta nuevamente, por favor.',
    });
  }
}

module.exports = {
  command: 'play2',
  handler,
};