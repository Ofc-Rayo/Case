const axios = require('axios')
const fs = require('fs')
const path = require('path')

// 🎭 Miniatura evocadora
const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'

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
  const userQuery = args.join(' ').trim()
  const jid       = message.key.remoteJid
  const rawJid    = message.key.participant || jid
  const userId    = rawJid.split('@')[0]

  if (!userQuery) {
    return conn.sendMessage(
      jid,
      {
        text: '😱 ¡¿Cómo que no escribiste nada?!\n\n> ¡No puedo leer tu mente, baka! 😤',
        contextInfo
      },
      { quoted: message }
    )
  }

  // Aviso de “procesando”
  await conn.sendMessage(
    jid,
    {
      text: '⚡ Estoy temblando... pero invocando la respuesta...',
      contextInfo
    },
    { quoted: message }
  )

  // Cargar o inicializar historial local
  const rawHistory = fs.readFileSync(historyPath, 'utf8')
  const conversationHistory = JSON.parse(rawHistory || '{}')
  if (!conversationHistory[userId]) {
    conversationHistory[userId] = []
  }

  // BLOQUE de personalidad que siempre viaja con la consulta
  const systemPrompt = `
Actúa como Zenitsu-Bot, un bot dramático, exagerado y emocional. Grita, se queja, pero responde con ternura y humor.
Habla como si estuviera siempre al borde de un colapso nervioso, pero con un corazón noble.
Su creador es Carlos, a quien admira como maestro del trueno y protector divino.
Usa expresiones como "¡Baka!", "¡Estoy temblando!", "¡No quiero morir!", pero siempre termina respondiendo con cariño.
Cada respuesta debe sentirse como una escena de anime intensa, con pausas teatrales, suspenso y alivio cómico.
`.trim()

  // Construir la carga completa (personalidad + pregunta)
  const fullPrompt = `${systemPrompt}\n\nUsuario: ${userQuery}`

  // Construir URL de la API con prompt completo
  const apiUrl =
    `https://api.vreden.my.id/api/mora?` +
    `query=${encodeURIComponent(fullPrompt)}` +
    `&username=${encodeURIComponent(userId)}`

  console.log('🔍 Invocando API con personalidad en query…', apiUrl)

  try {
    const response = await axios.get(apiUrl)
    let replyText = response.data?.result

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

    // Añadir reverencia cuando mencionan a Carlos
    if (/carlos/i.test(userQuery)) {
      replyText += '\n\n🙏 ¡Carlos-sama! ¡Gracias por no abandonarme en esta tormenta emocional!'
    }

    // Guardar en historial local
    conversationHistory[userId].push({
      role: 'user',
      content: userQuery
    })
    conversationHistory[userId].push({
      role: 'assistant',
      content: replyText
    })
    fs.writeFileSync(historyPath, JSON.stringify(conversationHistory, null, 2), 'utf8')

    // Construir el mensaje de salida con final emotivo aleatorio
    const emotionalFinales = [
      '😭 ¡Pero lo logré!',
      '😳 ¡Estoy vivo!',
      '💦 ¡Sudé como nunca!',
      '⚡ ¡Gracias, Carlos-sama!',
      '😱 ¡Pensé que iba a morir!'
    ]
    const finale = emotionalFinales[Math.floor(Math.random() * emotionalFinales.length)]

    const messageText = `
╭「 ⚡ 𝙕𝙀𝙉𝙄𝙏𝙎𝙐 - 𝙍𝙀𝙎𝙋𝙐𝙀𝙎𝙏𝘼 」╮
│ 🧠 Pregunta: ${userQuery}
│ 🎭 Estilo: Zenitsu-Bot
│ 🪷 Creador: Carlos-sama
╰────────────────────╯

${replyText}

${finale}
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
    console.error('⚠️ Error al invocar a Zenitsu-Bot:', err)
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