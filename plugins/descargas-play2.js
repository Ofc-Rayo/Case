const axios = require('axios');
const fs = require('fs');
const path = require('path');

const SEARCH_API      = 'https://api.dorratz.com/v3/yt-search?query=';
const YTMP4_API       = 'https://apis-starlights-team.koyeb.app/starlight/youtube-mp4?url=';

async function handler(conn, { message, args }) {
  const query = args.join(' ');
  if (!query) {
    return conn.sendMessage(message.key.remoteJid, {
      text: '*😰 ¡Zenitsu necesita saber qué video buscar!*\n\n> Ejemplo: `play2 Opening Demon Slayer` 🎬',
    });
  }

  try {
    const searchRes = await axios.get(`${SEARCH_API}${encodeURIComponent(query)}`);
    const results   = searchRes.data?.data;

    if (results && results.length > 0) {
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
        image:    { url: first.thumbnail },
        caption:  infoMsg
      });

      const videoUrl = await getVideoDownloadUrl(first.url);
      if (videoUrl) {
        await sendVideoAsFile(conn, message, videoUrl, first.title);
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
  const apiUrl = `${YTMP4_API}${encodeURIComponent(videoUrl)}`;
  try {
    const res = await axios.get(apiUrl);
    // La nueva API devuelve el enlace directo en `res.data.url`
    if (res.data?.url) return res.data.url;
  } catch (err) {
    console.error('Error al obtener la URL de descarga:', err);
  }
  return null;
}

async function sendVideoAsFile(conn, message, videoUrl, videoTitle) {
  const safeTitle = videoTitle.replace(/[<>:"/\\|?*\x00-\x1F]/g, '');
  const outPath   = path.resolve(__dirname, `${Date.now()}_${safeTitle}.mp4`);

  try {
    const writer = fs.createWriteStream(outPath);
    const stream = await axios({
      url:          videoUrl,
      method:       'GET',
      responseType: 'stream',
    });

    stream.data.pipe(writer);
    await new Promise((res, rej) => {
      writer.on('finish', res);
      writer.on('error', rej);
    });

    await conn.sendMessage(message.key.remoteJid, {
      document: { url: outPath },
      mimetype: 'video/mp4',
      fileName: `${safeTitle}.mp4`
    });

    fs.unlinkSync(outPath);

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