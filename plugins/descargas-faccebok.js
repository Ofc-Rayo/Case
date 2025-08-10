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
    console.log('🔮 Enviando petición a:', apiUrl)

    const res = await axios.get(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json'
      }
    })

    console.log('📜 Respuesta completa:', JSON.stringify(res.data, null, 2))

    const data = res.data?.data

    // Validación ritual (!data || data.status === false) {
      const msg = data?.message?.toLowerCase().includes('privasi')
        ? 'El video está restringido por privacidad.'
        : 'No se pudo acceder al contenido.'

      throw new Error(msg)
    }

    const videoUrl   = data.hd_url || data.sd_url
    const resolution = data.hd_url ? 'HD' : 'SD'
    const title      = data.title   || 'Facebook Video'
    const durasi     = data.durasi  || 'Desconocida'
    const thumbUrl   = data.thumbnail

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
    console.error('🔥 Error completo:', err)

    await conn.sendMessage(
      jid,
      {
        text: `
🚫 *Invocación bloqueada por fuerzas ocultas...*

> ${err.message.includes('privacidad')
           ? 'El video está restringido por privacidad. No se puede invocar.'
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