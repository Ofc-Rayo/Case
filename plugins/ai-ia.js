const axios = require('axios')

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

async function handler(m, { conn, args }) {
  try {
    if (!args || args.length === 0) {
      return await conn.sendMessage(
        m.chat,
        {
          text: '⚠️ Por favor, escribe tu pregunta después del comando. Ejemplo:\nai ¿Cómo estás?',
          contextInfo
        },
        { quoted: m }
      )
    }

    const prompt = args.join(' ')

    await conn.sendMessage(
      m.chat,
      {
        text: '⚡ Estoy temblando... ¡Ya casi te respondo! 😳',
        contextInfo
      },
      { quoted: m }
    )

    const url = `https://gokublack.xyz/ai/bard?text=${encodeURIComponent(prompt)}`
    const res = await axios.get(url)
    const replyRaw = res?.data?.result?.response || 'No entendí eso...'

    const replyText = `
⚡✨ *Zenitsu-Bot responde* ✨⚡

😳> *Pregunta:* ${prompt}

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

module.exports = {
  command: 'ai',
  handler,
}