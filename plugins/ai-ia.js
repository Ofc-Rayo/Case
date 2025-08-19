const https = require('https')
const fs = require('fs')
const path = require('path')

const thumbnailUrl = 'https://qu.ax/MvYPM.jpg' // Miniatura evocadora

const contextInfo = {
  externalAdReply: {
    title: '⚡ Zenitsu-Bot',
    body: '¡Estoy temblando, pero responderé con todo mi corazón!',
    mediaType: 1,
    previewType: 0,
    mediaUrl: 'https://zenitsu.bot',
    sourceUrl: 'https://zenitsu.bot',
    thumbnailUrl
  }
}

const historyPath = path.resolve('./zenitsuMemory.json')
if (!fs.existsSync(historyPath)) {
  fs.writeFileSync(historyPath, JSON.stringify({}), 'utf8')
}

async function handler(conn, { message, args }) {
  const query = args.join(' ').trim()
  const jid = message.key.remoteJid
  const rawJid = message.key.participant || message.key.remoteJid
  const userId = rawJid.split('@')[0]

  if (!query) {
    return conn.sendMessage(
      jid,
      {
        text: '😱 ¡¿Cómo que no escribiste nada?!\n\n> ¡No puedo leer tu mente contextInfo
      },
      { quoted: message }
    )
  }

  await conn.sendMessage(
    jid,
    {
      text: '⚡ Estoy temblando... pero invocando la respuesta...',
      contextInfo
    },
    { quoted: message }
  )

  // Cargar historial
  const rawHistory = fs.readFileSync(historyPath, 'utf8')
  const conversationHistory = JSON.parse(rawHistory || '{}')

  if (!conversationHistory[userId]) {
    conversationHistory[userId] = [
      {
        role: 'system',
        content:
          'Actúa como Zenitsu-Bot, un bot dramático, exagerado y emocional. Grita, se queja, pero responde con ternura y humor. Su creador es Carlos, a quien admira como maestro del trueno. También agrégale muchos emojis a tus respuestas.'
      }
    ]
  }

  conversationHistory[userId].push({ role: 'user', content: query })

  const apiUrl = `https://api.dorratz.com/ai/gpt?prompt=${encodeURIComponent(query + '?country=cuba')}`

  https.get(apiUrl, async (res) => {
    let responseData = ''

    res.on('data', (chunk) => {
      responseData += chunk
    })

    res.on('end', async () => {
      try {
        const responseJson = JSON.parse(responseData)
        const replyText = responseJson?.result?.replace(/^"|"$/g, '')

        if (!replyText) {
          return conn.sendMessage(
            jid,
            {
              text: '😵 ¡La IA no dijo nada! ¡Estoy en pánico total!',
              contextInfo
            },
            { quoted: message }
          )
        }

        conversationHistory[userId].push({ role: 'assistant', content: replyText })
        fs.writeFileSync(historyPath, JSON.stringify(conversationHistory, null, 2), 'utf8')

        const messageText = `
╭「 ⚡ 𝙕𝙀𝙉𝙄𝙏𝙎𝙐 - 𝙍𝙀𝙎𝙋𝙐𝙀𝙎𝙏𝘼 」╮
│ 🧠 Pregunta: ${query}
│ 🎭 Estilo: Zenitsu-Bot
│ 🪷 Creador: Carlos
╰────────────────────╯

${replyText}

😳 Zenitsu está exhausto... ¡pero lo logró! ⚡
`.trim()

        await conn.sendMessage(
          jid,
          {
            text: messageText,
            contextInfo
          },
          { quoted: message }
        )
      } catch (error) {
        await conn.sendMessage(
          jid,
          {
            text: `❌ ¡Algo salió mal!\n\n> Zenitsu se tropezó intentando responder...\n🛠️ ${error.message}`,
            contextInfo
          },
          { quoted: message }
        )
      }
    })
  }).on('error', async (error) => {
    await conn.sendMessage(
      jid,
      {
        text: `❌ ¡Error de conexión con la IA!\n\n> Zenitsu está llorando...\n🛠️ ${error.message}`,
        contextInfo
      },
      { quoted: message }
    )
  })
}

module.exports = {
  command: 'ia',
  handler
}