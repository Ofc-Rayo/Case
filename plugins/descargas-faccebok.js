const axios = require('axios');
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

  console.log('\n🌀 [fb] Ritual iniciado...');
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

  try {
    const api = `https://api.vreden.my.id/api/fbdl?url=${encodeURIComponent(url)}`;
    console.log('🌐 [fb] Consultando API:', api);

    const res = await axios.get(api);
    console.log('📥 [fb] Respuesta recibida:', JSON.stringify(res.data, null, 2));

    const data = res.data?.data;

    if (!data || !data.hd_url) {
      console.log('❌ [fb] Video no disponible o sin hd_url');
      return conn.sendMessage(jid, {
        text: '📭 *No se pudo abrir el portal del recuerdo.*\n\n> Verifica el enlace o intenta más tarde.',
        contextInfo
      }, { quoted });
    }

    const caption = `
╭─「 📘 𝙁𝘼𝘾𝙀𝘽𝙊𝙊𝙆 - 𝙍𝙄𝙏𝙐𝘼𝙇 」─╮
│ 🔗 *Enlace:* ${url}
│ 🧠 *Origen:* api.vreden.my.id
╰────────────────────╯
*✨ Video invocado con éxito...*
`.trim();

    console.log('📦 [fb] Descargando video como buffer...');
    const videoBuffer = await axios.get(data.hd_url, {
      responseType: 'arraybuffer'
    }).then(res => res.data).catch(err => {
      console.error('🧨 [fb] Error al descargar el video:', err.message);
      return null;
    });

    if (!videoBuffer) {
      return conn.sendMessage(jid, {
        text: '📭 *No se pudo abrir el portal del recuerdo.*\n\n> El video no pudo ser descargado.',
        contextInfo
      }, { quoted });
    }

    console.log('🎬 [fb] Enviando video como archivo binario...');
    await conn.sendMessage(jid, {
      video: videoBuffer,
      caption,
      contextInfo,
      quoted
    });

    await conn.sendMessage(jid, {
      text: '✅ *Video enviado.* ¿Deseas invocar otro recuerdo o abrir otro portal?',
      contextInfo
    }, { quoted });

  } catch (err) {
    console.error('🧨 [fb] Error al invocar el ritual:', err);

    if (err.code === 'ENOSPC') {
      console.warn('🪦 [fb] El altar está lleno. No hay espacio en disco.');
      return conn.sendMessage(jid, {
        text: '🪦 *El altar está lleno de recuerdos...*\n\n> No se puede escribir más hasta que se libere espacio. ¿Deseas purgar los archivos antiguos o hacer una ofrenda de almacenamiento?',
        contextInfo
      }, { quoted });
    }

    return conn.sendMessage(jid, {
      text: '🚫 *Ups... el archivo emocional se resistió a ser invocado.*\n\n> Intenta más tarde o revisa el enlace.',
      contextInfo
    }, { quoted });
  }
}

module.exports = {
  command: 'fb',
  handler
};