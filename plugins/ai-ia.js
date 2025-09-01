const axios = require('axios')

// Variable global para controlar el estado del autoresponder
let autoresponderActivo = true

const contextInfo = {
  externalAdReply: {
    title: '⚡ Zenitsu-Bot',
    body: '¡Estoy temblando pero responderé con todo mi corazón! ❤️⚡',
    mediaType: 1,
    previewType: 0,
    mediaUrl: 'https://zenitsu.bot',
    sourceUrl: 'https://zenitsu.bot',
    thumbnailUrl: 'https://qu.ax/MvYPM.jpg' // Miniatura chida
  }
}

async function handler(m, { conn }) {
  try {
    const query = m.text?.trim()
    if (!query) return

    // Comandos para activar/desactivar el autoresponder
    if (query.toLowerCase() === 'on autoresponder') {
      autoresponderActivo = true
      return await conn.sendMessage(m.chat, { text: '✅ Autoresponder activado.' }, { quoted: m })
    }
    if (query.toLowerCase() === 'off autoresponder') {
      autoresponderActivo = false
      return await conn.sendMessage(m.chat, { text: '❌ Autoresponder desactivado.' }, { quoted: m })
    }

    // Si el autoresponder está desactivado, no responder
    if (!autoresponderActivo) return

    // Mensaje estilo "Zenitsu" mientras procesa
    await conn.sendMessage(
      m.chat,
      {
        text: '⚡ Estoy temblando... ¡Ya casi te respondo! 😳',
        contextInfo
      },
      { quoted: m }
    )

    // Llamar a la API de GokuBlack
    const url = `https://gokublack.xyz/ai/bard?text=${encodeURIComponent(query)}`
    const res = await axios.get(url)

    const replyRaw = res?.data?.result?.response || 'No entendí eso...'

    // Agregar estilo Zenitsu (puedes modificar esto a tu gusto)
    const replyText = `
⚡✨ *Zenitsu-Bot responde* ✨⚡

😳> *Pregunta:* ${query}

🎭> *Respuesta:* ${replyRaw}

😤 ¡Estoy exhausto pero lo logré! ⚡⚡
`.trim()

    // Enviar la respuesta con contexto y citando el mensaje original
    await conn.sendMessage(
      m.chat,
      {
        text: replyText,
        contextInfo
      },
      { quoted: m }
    )
  } catch (error) {
    console.error('❌ Error al obtener respuesta de la API:', error)
    await conn.sendMessage(
      m.chat,
      {
        text: `⚠️ ¡Oops! Zenitsu se tropezó intentando responder...\n🛠️ ${error.message}`,
        contextInfo
      },
      { quoted: m }
    )
  }
}

module.exports = handler