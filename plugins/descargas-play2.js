const axios = require('axios');
const fs = require('fs');
const path = require('path');

const SEARCH_API = 'https://api.dorratz.com/v3/yt-search?query=';
const YTMP4_API  = 'https://api.vreden.my.id/api/ytmp4?url='; // ← nueva API

async function handler(conn, { message, args }) {
  const query = args.join(' ');
  if (!query) {
    return conn.sendMessage(message.key.remoteJid, {
      text: '*😰 ¡Zenitsu necesita saber qué video buscar!*\n\n> Ejemplo: `play2 Opening Demon Slayer` 🎬',
    });
  }

  try {
    const { data: searchData } = await axios.get(`${SEARCH_API}${encodeURIComponent(query)}`);
    const results = searchData?.data;
    if (!results || results.length === 0) {
      return conn.sendMessage(message.key.remoteJid, {
        text: '*🔍 Zenitsu no encontró resultados...*\n\n> Intenta con otro término, por favor.',
      });
    }

    const first = results[0];
    const infoMsg = `
╭─「 🎥 𝙕𝙀𝙉𝙄𝙏𝙎𝙐 𝘽𝙊𝙏 - 𝙑𝙄𝘿𝙀𝙊 」─╮
│ 🎬 *Título:* ${first.title}
│ ⏳ *Duración:* ${first.duration}
│ 📅 *Publicado:* ${first.publishedAt}
│ 👀 *Vistas:* ${first.views.toLocaleString()}
│ 🧑‍💻 *Autor:* ${first.author.name}
│ 🔽 *Descargando video...*
╰────────────────────╯

*😳 Zenitsu está trabajando en ello... ¡No lo presiones!* ⚡
> Si lo deseas en solo audio, usa: *play ${first.title}*
    `.trim();

    await conn.sendMessage(message.key.remoteJid, {
      image:   { url: first.thumbnail },
      caption: infoMsg
    });

    const videoUrl = await getVideoDownloadUrl(first.url);
    if (!videoUrl) throw new Error('Video URL no obtenida de la API.');

    await sendVideoAsFile(conn, message, videoUrl, first.title);

  } catch (err) {
    console.error(err);
    await conn.sendMessage(message.key.remoteJid, {
      text: '*❌ ¡Algo salió mal!*\n\n> Zenitsu se tropezó intentando descargar el video... vuelve a intentarlo más tarde.',
    });
  }
}

async function getVideoDownloadUrl(videoUrl) {
  const apiUrl = `${YTMP4_API}${encodeURIComponent(videoUrl)}`;
  const res = await axios.get(apiUrl);
  console.log('>> vreden API response:', res.data);
  // La nueva API estructura: res.data.result.download.url
  if (res.data?.result?.status && res.data.result.download?.url) {
    return res.data.result.download.url;
  }
  return null;
}

async function sendVideoAsFile(conn, message, videoUrl, videoTitle) {
  const safeTitle = videoTitle.replace(/[<>:"/\\|?*\x00-\x1F]/g, '');
  const outPath   = path.resolve(__dirname, `${Date.now()}_${safeTitle}.mp4`);

  try {
    const writer = fs.createWriteStream(outPath);
    const stream = await axios({ url: videoUrl, method: 'GET', responseType: 'stream' });
    stream.data.pipe(writer);
    await new Promise((r, rej) => writer.on('finish', r).on('error', rej));

    await conn.sendMessage(message.key.remoteJid, {
      document: { url: outPath },
      mimetype: 'video/mp4',
      fileName: `${safeTitle}.mp4`
    });
    fs.unlinkSync(outPath);

  } catch (e) {
    console.error('Error enviando archivo:', e);
    await conn.sendMessage(message.key.remoteJid, {
      text: '*⚠️ Zenitsu no pudo enviar el archivo...*\n\n> Intenta nuevamente, por favor.',
    });
  }
}

module.exports = {
  command: 'play2',
  handler,
};