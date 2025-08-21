const axios = require('axios');

const SEARCH_API = 'https://api.dorratz.com/v3/yt-search?query=';
const YTMP4_API  = 'https://api.vreden.my.id/api/ytmp4?url=';

async function handler(conn, { message, args }) {
  const query = args.join(' ');
  if (!query) {
    return conn.sendMessage(message.key.remoteJid, {
      text: '*😰 ¡Zenitsu necesita saber qué video buscar!*\n\n> Ejemplo: `play2 Opening Demon Slayer` 🎬',
    });
  }

  try {
    // 1. Buscar video
    const { data: searchData } = await axios.get(`${SEARCH_API}${encodeURIComponent(query)}`);
    const results = searchData?.data;
    if (!results || results.length === 0) {
      return conn.sendMessage(message.key.remoteJid, {
        text: '*🔍 Zenitsu no encontró resultados...*\n\n> Intenta con otro término, por favor.',
      });
    }
    const first = results[0];

    // 2. Mensaje inicial
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
> Para solo audio: `play ${first.title}`
    `.trim();

    await conn.sendMessage(message.key.remoteJid, {
      image:   { url: first.thumbnail },
      caption: infoMsg
    });

    // 3. Obtener URL de descarga
    const videoUrl = await getVideoDownloadUrl(first.url);
    if (!videoUrl) throw new Error('No se obtuvo URL de descarga.');

    // 4. Enviar directamente como documento usando la URL remota
    await conn.sendMessage(message.key.remoteJid, {
      document: { url: videoUrl },
      mimetype: 'video/mp4',
      fileName: `${sanitize(first.title)}.mp4`
    });

  } catch (err) {
    console.error('Error en play2:', err);
    await conn.sendMessage(message.key.remoteJid, {
      text: '*❌ ¡El rito falló!*\n\n> Zenitsu no pudo enviar el video. Reintenta más tarde.',
    });
  }
}

async function getVideoDownloadUrl(videoUrl) {
  const apiUrl = `${YTMP4_API}${encodeURIComponent(videoUrl)}`;
  const res = await axios.get(apiUrl);
  console.log('>> vreden API response:', res.data);
  // Aseguramos que la estructura exista
  if (res.data?.result?.status && res.data.result.download?.url) {
    return res.data.result.download.url;
  }
  return null;
}

function sanitize(title) {
  return title.replace(/[<>:"/\\|?*\x00-\x1F]/g, '').substring(0, 50);
}

module.exports = {
  command: 'play2',
  handler,
};