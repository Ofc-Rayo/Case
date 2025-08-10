// plugins/ia.js

const axios = require('axios')
const fs = require('fs')
const path = require('path')

// 🎭 Variables rituales
const BOT_NAME    = 'Zenitsu-Bot'
const CREATOR     = 'Carlos'
const VERSION     = 'v1.0.0'
const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'

// Construye el prompt de “system” + usuario + pregunta
function buildPrompt(userId, userQuery) {
  return `
Actúa como Zenitsu-Bot, un bot dramático, exagerado y emocional. Grita, se queja, pero responde con ternura y humor.
Habla como si estuviera siempre al borde de un colapso nervioso, pero con un corazón noble.
Su creador es ${CREATOR}, a quien admira como maestro del trueno y protector divino.
Usa expresiones como "¡Baka!", "¡Estoy temblando!", "¡No quiero morir!", pero siempre termina respondiendo con cariño.
Cada respuesta debe sentirse como una escena de anime intensa, con pausas teatrales, suspenso y alivio cómico.

Usuario: ${userId}
Pregunta: ${userQuery}
`.trim()
}

const contextInfo = {
  externalAdReply: {
    title: `⚡ ${BOT_NAME}`,
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
  const jid   = message.key.remoteJid
  const rawJid = message.key.participant || jid
  const userId = rawJid.split('@')[0]

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
    { text: '⚡ Estoy temblando... pero invocando la respuesta...', contextInfo },
    { quoted: message }
  )

  // Cargar o inicializar historial local (opcional)
  const rawHistory = fs.readFileSync(historyPath, 'utf8')
  const conversationHistory = JSON.parse(rawHistory || '{}')
  conversationHistory[userId] = conversationHistory[userId] || []
  conversationHistory[userId].push({ role: 'user', content: query })

  // Inyecta el “system role” en el prompt
  const fullPrompt = buildPrompt(userId, query)
  const apiUrl = `https://api.vreden.my.id/api/mora?` +
                 `query=${encodeURIComponent(fullPrompt)}` +
                 `&username=${encodeURIComponent(userId)}`

  try {
    const response = await axios.get(apiUrl)
    let replyText = response.data?.result

    if (!replyText) {
      return conn.sendMessage(
        jid,
        { text: '😵 ¡La IA no dijo nada! ¡Estoy en pánico total!', contextInfo },
        { quoted: message }
      )
    }

    // Reverencia extra si mencionan a Carlos
    if (/carlos/i.test(query)) {
      replyText += '\n\n🙏 ¡Carlos-sama! ¡Gracias por no abandonarme en esta tormenta emocional!'
    }

    conversationHistory[userId].push({ role: 'assistant', content: replyText })
    fs.writeFileSync(historyPath, JSON.stringify(conversationHistory, null, 2), 'utf8')

    // Mensaje final ritualístico
    const messageText = `
╭「 ⚡ 𝙕𝙀𝙉𝙄𝙏𝙎𝙐 - 𝙍𝙀𝙎𝙋𝙐𝙀𝙎𝘛𝘼 」╮
│ 🧠 Pregunta: ${query}
│ 🎭 Estilo: ${BOT_NAME}
│ 🪷 Creador: ${CREATOR}
╰────────────────────╯

${replyText}

😳 Zenitsu está exhausto... ¡pero lo logró! ⚡
`.trim()

    await conn.sendMessage(
      jid,
      { text: messageText, contextInfo },
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