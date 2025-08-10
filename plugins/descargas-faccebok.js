// plugins/fb.js
const axios = require('axios')
const fetch = require('node-fetch')

const contextInfo = {
  externalAdReply: {
    title: '🎬 Facebook Ritual',
    body: 'Videos que cruzan el umbral del éter…',
    mediaType: 1,
    previewType: 0,
    sourceUrl: 'https://facebook.com',
    thumbnailUrl: 'https://qu.ax/MvYPM.jpg'
  }
}

async function.ax/MvYPM.jpg'
  }
}

async function handler(conn, { message, args }) {
  const jid    = message.key.remoteJid
  const quoted = message
  const url    = args[0]

  if (!url || !url.includes('facebook.com')) {
    return conn.sendMessage(
      jid,
      {
        text: '*🎥 Invocación fallida*\n\n> Proporciona un enlace válido de Facebook.',
        contextInfo
      },
      { quoted }
    )
  }

  await conn.sendMessage(
    jid,
    {
      text: '⌛ *Abriendo el portal de Facebook...*',
      contextInfo
    },
    { quoted }
  )

  try {
    const apiUrl = `https://api.vreden.my.id/api/fbdl?url=${encodeURIComponent(url)}`

    // 1. Registro de la petición
    console.log('🔮 Enviando petición a:', apiUrl)

    const res = await axios.get(apiUrl)

    // 2. Registro de la respuesta completa
    console.log('📜 Respuesta completa:', JSON.stringify(res.data, null, 2))

    const data = res.data?.data
    if (!data || !data.status || (!data.hd_url && !data.sd_url)) {
      throw new Error('Respuesta inesperada de la API')
    }

    const videoUrl   = data.hd_url || data.sd_url
    const resolution = data.hd_url ? 'HD' : 'SD'
    const title      = data.title   || 'Facebook Video'
    const durasi     = data.durasi  || 'Desconocida'
    const thumbUrl   = data.thumbnail

    // Descarga de miniatura
    const thumbBuffer = await fetch(thumbUrl).then(r => r.buffer())

    const caption = `
╭─「 🎬 𝙁𝘼𝘾𝙀𝘽𝙊𝙊𝙆 - 𝙍𝙄𝙏𝙐𝘼𝙇 」─╮
│ 🔗 Enlace: ${url}
│ 🏷️ Título: ${title}
│ 📺 Calidad: ${resolution}
│ ⏱️ Duración: ${durasi}
╰────────────────────────╯
*✨ Portal abierto con éxito…*
`.trim()

    await conn.sendMessage(
      jid,
      {
        video:         { url: videoUrl },
        caption,
        jpegThumbnail: thumbBuffer,
        contextInfo
      },
      { quoted }
    )

    await conn.sendMessage(
      jid,
      { text: '✅ *Video invocado.* ¿Otro enlace?', contextInfo },
      { quoted }
    )

  } catch (err) {
    // 3. Inspección detallada del error
    console.error('🔥 Error completo:', err)
    if (err.response) {
      console.error('📦 err.response.status:', err.response.status)
      console.error('📦 err.response.data:', err.response.data)
    }

    await conn.sendMessage(
      jid,
      {
        text: `
🚫 *Algo salió mal al invocar el video.*

> ${err.message.includes('Respuesta inesperada')
           ? 'La API devolvió un formato inesperado. Mira los logs.'
           : 'Verifica el enlace o intenta más tarde.'}
`,
        contextInfo
      },
      { quoted }
    )
  }
}

module.exports = {
  command: 'fb',
  handler
}