const axios = require('axios');
const { igdl } = require('ruhend-scraper');

const thumbnailUrl = 'https://qu.ax/0XKxP.jpg'; // Miniatura simbólica del portal Facebook

const contextInfo = {
  externalAdReply: {
    title: '📘 Facebook Ritual',
    body: 'Videos que emergen del archivo emocional de Meta...',
    mediaType: 1,
    previewType: 0,
    mediaUrl: null,
    sourceUrl: 'https://facebook.com',
    thumbnailUrl
  }
};

async function handler(conn, { message, args }) {
  const jid = message.key.remoteJid;
  const quoted = message;
  const url = args[0];

  console.log('\n🌀 [fb] Ritual iniciado con ruhend-scraper...');
  console.log('🔗 Enlace recibido:', url);

  if (!url || !url.includes('facebook.com')) {
    console.log('⚠️ [fb] Enlace inválido o ausente');
    return conn.sendMessage(jid, {
      text: '*📘 ¿Dónde está el portal de Meta?*\n\n> Ingresa un enlace válido de Facebook para invocar el video.',
      contextInfo
    }, { quoted });
  }

  await conn.sendMessage(jid, {
    text: '🔮 *Invocando el archivo emocional desde Facebook...*',
    contextInfo
  }, { quoted });

  let res;
  try {
    res = await igdl(url);
    console.log('📥 [fb] Respuesta recibida:', JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error('🧨 [fb] Error al consultar ruhend-scraper:', err.message);
    return conn.sendMessage(jid, {
      text: '🚫 *Ups... el archivo emocional se resistió a ser invocado.*\n\n> Verifica el enlace o intenta más tarde.',
      contextInfo
    }, { quoted });
  }

  const result = res.data;
  if (!result || result.length === 0) {
    console.log('📭 [fb] No se encontraron resultados');
    return conn.sendMessage(jid, {
      text: '*📭 No se encontraron recuerdos en ese enlace.*',
      contextInfo
    }, { quoted });
  }

  const data = result.find(i => i.resolution === "720p (HD)") || result.find(i => i.resolution === "360p (SD)");
  if (!data) {
    console.log('⚠️ [fb] Resolución adecuada no encontrada');
    return conn.sendMessage(jid, {
      text: '*⚠️ No se encontró una resolución adecuada para invocar el recuerdo.*',
      contextInfo
    }, { quoted });
  }

  const caption = `
╭─「 📘 𝙁𝘼𝘾𝙀𝘽𝙊𝙊𝙆 - 𝙍𝙄𝙏𝙐𝘼𝙇 」─╮
│ 🔗 *Enlace:* ${url}
│ 🧠 *Origen:* ruhend-scraper
╰────────────────────╯
*✨ Video invocado con éxito...*
`.trim();

  let videoBuffer;
  try {
    console.log('📦 [fb] Descargando video como buffer...');
    videoBuffer = await axios.get(data.url, {
      responseType: 'arraybuffer'
    }).then(res => res.data);
  } catch (err) {
    console.error('🧨 [fb] Error al descargar el video:', err.message);
    return conn.sendMessage(jid, {
      text: '*🚫 El recuerdo no pudo ser descargado.*\n\n> Intenta más tarde o purga el altar.',
      contextInfo
    }, { quoted });
  }

  try {
    console.log('🎬 [fb] Enviando video como archivo binario...');
    await conn.sendMessage(jid, {
      video: videoBuffer,
      caption,
      contextInfo,
      fileName: 'fb.mp4',
      mimetype: 'video/mp4'
    }, { quoted });

    await conn.sendMessage(jid, {
      text: '✅ *Video enviado.* ¿Deseas invocar otro recuerdo o abrir otro portal?',
      contextInfo
    }, { quoted });

  } catch (err) {
    console.error('🧨 [fb] Error al enviar el video:', err.message);
    return conn.sendMessage(jid, {
      text: '*🚫 Error al enviar el recuerdo.*\n\n> Intenta más tarde o revisa el altar.',
      contextInfo
    }, { quoted });
  }
}

module.exports = {
  command: 'fb',
  handler
};