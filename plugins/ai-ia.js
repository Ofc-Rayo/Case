const axios = require('axios')

const prefix = '.'
let autoresponderActivo = true

const contextInfo = {
  externalAdReply: {
    title: '⚡ Zenitsu-Bot',
    body: '¡Estoy temblando pero responderé con todo mi corazón! ❤️⚡',
    mediaType: 1,
    previewType: 0,
    mediaUrl: 'https://zenitsu.bot',
    sourceUrl: 'https://zenitsu.bot',
    thumbnailUrl: 'https://qu.ax/MvYPM.jpg'
  }
}

async function handler(m, { conn }) {
  try {
    const text = m.body || m.text || '' // ✅ Asegurarse de que haya texto
    if (!text) return

    // ✅ Comando para activar o desactivar autoresponder
    if (text.startsWith(prefix)) {
      const args = text.slice(prefix.length).trim().split(/\s+/)
      const command = args.shift().toLowerCase()

      if (command === 'on' && args[0] === 'autoresponder') {
        autoresponderActivo = true
        return await conn.sendMessage(
          m.chat,
          {
            text: '✅ *Autoresponder activado.*',
            contextInfo
          },
          { quoted: m }
        )
      }

      if (command === 'off' && args[0] === 'autoresponder') {
        autoresponderActivo = false
        return await conn.sendMessage(
          m.chat,
          {
            text: '❌ *Autoresponder desactivado.*',
            contextInfo
          },
          { quoted: m }
        )
      }

      return // 👉 Detener aquí si es otro comando
    }

    // ✅ Autoresponder si está activo
    if (!autoresponderActivo) return

    await conn.sendMessage(
      m.chat,
      {
        text: '⚡ Estoy temblando... ¡Ya casi te respondo! 😳',
        contextInfo
      },
      { quoted: m }
    )

    const url = `https://gokublack.xyz/ai/bard?text=${encodeURIComponent(text)}`
    const res = await axios.get(url)
    const replyRaw = res?.data?.result?.response || 'No entendí eso...'

    const replyText = `
⚡✨ *Zenitsu-Bot responde* ✨⚡

😳> *Pregunta:* ${text}

🎭> *Respuesta:* ${replyRaw}

😤 ¡Estoy exhausto pero lo logré! ⚡⚡
    `.trim()

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