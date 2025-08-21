const axios = require('axios')

/**
 * 🔍 Búsqueda en cascada usando múltiples APIs
 */
async function getVideoResult(query) {
  // 1. EliasarYT
  try {
    const res = await axios.get(
      `https://eliasar-yt-api.vercel.app/api/search/youtube?query=${encodeURIComponent(
        query
      )}`
    )
    const list = res.data?.results?.resultado
    if (list?.length) return { title: list[0].title, url: list[0].url }
  } catch (e) {
    console.warn('⚠️ EliasarYT falló:', e.message)
  }

  // 2. Dorratz
  try {
    const res = await axios.get(
      `https://api.dorratz.com/v3/yt-search?query=${encodeURIComponent(query)}`
    )
    const list = res.data?.data || res.data?.result?.all
    if (list?.length) return { title: list[0].title, url: list[0].url }
  } catch (e) {
    console.warn('⚠️ Dorratz falló:', e.message)
  }

  // 3. Starlight Team
  try {
    const res = await axios.get(
      `https://apis-starlights-team.koyeb.app/starlight/youtube-search?text=${encodeURIComponent(
        query
      )}`
    )
    const list = res.data?.results
    if (list?.length) return { title: list[0].title, url: list[0].link }
  } catch (e) {
    console.warn('⚠️ Starlight API falló:', e.message)
  }

  // 4. Delirius
  try {
    const res = await axios.get(
      `https://delirius-apiofc.vercel.app/search/ytsearch?q=${encodeURIComponent(
        query
      )}`
    )
    const list = res.data?.data
    if (list?.length) return { title: list[0].title, url: list[0].url }
  } catch (e) {
    console.warn('⚠️ Delirius API falló:', e.message)
  }

  // 5. Sylphy
  try {
    const res = await axios.get(
      `https://api.sylphy.xyz/search/youtube?q=${encodeURIComponent(query)}`
    )
    const list = res.data?.res
    if (list?.length) return { title: list[0].title, url: list[0].url }
  } catch (e) {
    console.warn('⚠️ Sylphy API falló:', e.message)
  }

  return null
}

/**
 * 🔧 Manejador del comando play2 (Zenitsu-Bot)
 */
async function handler(conn, { message, args }) {
  const jid = message.key.remoteJid
  const text = args.join(' ').trim()

  // Sin término de búsqueda
  if (!text) {
    return conn.sendMessage(
      jid,
      {
        text:
          '😰 ¡Zenitsu necesita saber qué video buscar!\n\n> Ejemplo: play2 Opening Demon Slayer 🎬'
      },
      { quoted: message }
    )
  }

  // Mensaje inicial de búsqueda
  await conn.sendMessage(
    jid,
    {
      text:
        '⏳ *Buscando tu video...*\n🔍 Probando múltiples fuentes hasta encontrar el mejor resultado.'
    },
    { quoted: message }
  )

  // 1. Buscar video en cascada
  const selected = await getVideoResult(text)
  if (!selected) {
    return conn.sendMessage(
      jid,
      {
        text: `❌ No se encontró ningún video para: *${text}*\n\n> Intenta con otro término.`
      },
      { quoted: message }
    )
  }

  try {
    // 2. Descargar vía Vreden API
    const dlRes = await axios.get(
      `https://api.vreden.my.id/api/ytmp4?url=${encodeURIComponent(
        selected.url
      )}`
    )
    const json = dlRes.data
    const meta = json?.result?.metadata || {}
    const dl = json?.result?.download || {}

    // Validar respuesta
    if (!json?.result?.status || !dl?.url) {
      return conn.sendMessage(
        jid,
        {
          text: `⚠️ No se pudo obtener el enlace de descarga para: *${
            meta.title || selected.title
          }*`
        },
        { quoted: message }
      )
    }

    // 3. Enviar miniatura + info
    const caption = `
🎬 *${meta.title}*
🎙️ Autor: ${meta.author.name}
📅 Publicado: ${meta.ago}
⏱️ Duración: ${meta.timestamp}
👁️ Vistas: ${meta.views.toLocaleString()}

📥 Calidad: ${dl.quality}
📄 Archivo: ${dl.filename}
    `.trim()

    await conn.sendMessage(
      jid,
      {
        image: { url: meta.image || meta.thumbnail },
        caption,
        footer: '🎥 Video obtenido vía Vreden API',
        contextInfo: {
          externalAdReply: {
            title: meta.title,
            body: 'Haz clic para ver o descargar',
            thumbnailUrl: meta.thumbnail,
            sourceUrl: selected.url
          }
        }
      },
      { quoted: message }
    )

    // 4. Enviar video como stream directo
    await conn.sendMessage(
      jid,
      {
        video: { url: dl.url },
        mimetype: 'video/mp4',
        fileName: dl.filename || 'video.mp4'
      },
      { quoted: message }
    )
  } catch (err) {
    console.error('💥 Error en play2:', err)
    await conn.sendMessage(
      jid,
      {
        text:
          '❌ ¡Algo salió mal al descargar el video!\n\n> Zenitsu se tropezó con la ceremonia. Reintenta más tarde.'
      },
      { quoted: message }
    )
  }
}

module.exports = {
  command: 'play2',
  handler
}