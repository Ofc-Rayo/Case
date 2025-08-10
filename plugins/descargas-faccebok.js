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
    thumbnailUrl: 'https://qu.ax/MvYPM.jpg' // miniatura genérica, puedes cambiarla
  }
}

async function handler(conn, { message, args }) {
  const jid    = message.key.remoteJid
  const quoted = message
  const url    = args[0]

  // 1. Validación del enlace
  if (!url || !url.includes('facebook.com')) {
    return conn.sendMessage(
      jid,
      {
        text: '*🎥 Invocación fallida*\n\n> Proporciona un enlace válido de Facebook para descargar el video.',
        contextInfo
      },
      { quoted }
    )
  }

  // 2. Mensaje ritual de inicio
  await conn.sendMessage(
    jid,
    {
      text: '⌛ *Abriendo el portal de Facebook...*',
      contextInfo
    },
    { quoted }
  )

  try {
    // 3. Llamada a la nueva API vreden.my.id
    const apiUrl = `https://api.vreden.my.id/api/fbdl?url=${encodeURIComponent(url)}`
    const res    = await axios.get(apiUrl)
    const data   = res.data?.data

    // 4. Validación estricta de la respuesta
    if (!data || !data.status || (!data.hd_url && !data.sd_url)) {
      throw new Error('Respuesta inesperada de la API')
    }

    // 5. Selección de calidad
    const videoUrl   = data.hd_url || data.sd_url
    const resolution = data.hd_url ? 'HD' : 'SD'
    const thumbUrl   = data.thumbnail
    const title      = data.title   || 'Facebook Video'
    const durasi     = data.durasi  || 'Desconocida'

    // 6. Descarga de la miniatura
    const thumbBuffer = await fetch(thumbUrl).then(r => r.buffer())

    // 7. Pie de caja ritual
    const caption = `
╭─「 🎬 𝙁𝘼𝘾𝙀𝘽𝙊𝙊𝙆 - 𝙍𝙄𝙏𝙐𝘼𝙇 」─╮
│ 🔗 Enlace: ${url}
│ 🏷️ Título: ${title}
│ 📺 Calidad: ${resolution}
│ ⏱️ Duración: ${durasi}
╰────────────────────────╯
*✨ Portal abierto con éxito…*
`.trim()

    // 8. Envío del video con miniatura y reply al comando
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

    // 9. Confirmación final
    await conn.sendMessage(
      jid,
      {
        text: '✅ *Video invocado.* ¿Deseas descargar otra joya de Facebook?',
        contextInfo
      },
      { quoted }
    )

  } catch (err) {
    console.error('[fb] Error:', err.response?.data || err.message)
    await conn.sendMessage(
      jid,
      {
        text: `
🚫 *Algo salió mal al invocar el video de Facebook.*

> ${err.message.includes('Respuesta inesperada') 
         ? 'La API devolvió un formato inesperado. Revisa los logs.' 
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