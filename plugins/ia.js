// plugins/ia.js

const axios = require('axios')
const fs = require('fs')
const path = require('path')

const thumbnailUrl = 'https://qu.ax/MvYPM.jpg' // Imagen dramática

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

  if (!query) {
    return conn.sendMessage(
      jid,
      {
        text:
          '😱 ¡¿Cómo que no escribiste nada?!\n\n> ¡No puedo leer tu mente, baka! 😤',
        contextInfo
      },
      { quoted: message }
    )
  }

  // Aviso de “procesando”
  await conn.sendMessage(
    jid,
    {
      text: '⚡ *Estoy temblando... pero invocando la respuesta...*',
      contextInfo
    },
    { quoted: message }
  )

  // Cargar o inicializar historial
  const rawHistory = fs.readFileSync(historyPath, 'utf8')
  const conversationHistory = JSON.parse(rawHistory || '{}')
  const rawJid = message.key.participant || message.key.remoteJid
  const userId = rawJid.split('@')[0]

  if (!conversationHistory[userId]) {
    conversationHistory[userId] = [
      {
        role: 'system',
        content:
          'Actúa como Zenitsu-Bot, un bot dramático, exagerado y emocional. Grita, se queja, pero responde con ternura y humor. Su creador es Carlos, a quien admira como maestro del trueno.'
      }
    ]
  }
  conversationHistory[userId].push({ role: 'user', content: query })

  // Construir URL de la nueva API
  const apiUrl = `https://api.vreden.my.id/api/mora?query=${encodeURIComponent(
    query
  )}&username=${encodeURIComponent(userId)}`

  try {
    const response = await axios.get(apiUrl)
    const replyText = response.data?.result

    if (!replyText) {
      return conn.sendMessage(
        jid,
        {
          text: '😵 *¡La IA no dijo nada! ¡Estoy en pánico total!*',
          contextInfo
        },
        { quoted: message }
      )
    }

    // Guardar en historial
    conversationHistory[userId].push({
      role: 'assistant',
      content: replyText
    })
    fs.writeFileSync(historyPath, JSON.stringify(conversationHistory, null, 2), 'utf8')

    // Formato ritualístico de la respuesta
    const messageText = `
╭─「 ⚡ 𝙕𝙀𝙉𝙄𝙏𝙎𝙐 - 𝙍𝙀𝙎𝙋𝙐𝙀𝙎𝙏𝘼 」─╮
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
  } catch (err) {
    console.error('⚠️ Error al invocar a Zenitsu-Bot:', err.message)
    await conn.sendMessage(
      jid,
      {
        text: `❌ ¡Algo salió mal!\n\n> Zenitsu se tropezó intentando responder...\n🛠️ ${err.message}`,
        contextInfo
      },
      { quoted: message }
    )
  }
}

module.exports = {
  command: 'ia',
  handler
}