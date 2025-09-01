const https = require('https')
const fs = require('fs')
const path = require('path')

const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'

const contextInfo = {
  externalAdReply: {
    title: 'Zenitsu-Bot',
    body: 'Respondiendo tu consulta',
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
        text: 'No escribiste nada. Por favor, escribe una pregunta.',
        contextInfo
      },
      { quoted: message }
    )
  }

  await conn.sendMessage(
    jid,
    {
      text: 'Procesando tu solicitud, espera un momento...',
      contextInfo
    },
    { quoted: message }
  )

  const rawHistory = fs.readFileSync(historyPath, 'utf8')
  const conversationHistory = JSON.parse(rawHistory || '{}')

  if (!conversationHistory[userId]) {
    conversationHistory[userId] = []
  }

  conversationHistory[userId].push({ role: 'user', content: query })
  fs.writeFileSync(historyPath, JSON.stringify(conversationHistory, null, 2), 'utf8')

  const url = `https://gokublack.xyz/ai/bard?text=${encodeURIComponent(query)}`

  https.get(url, (res) => {
    let data = ''

    res.on('data', (chunk) => {
      data += chunk
    })

    res.on('end', async () => {
      try {
        const responseJson = JSON.parse(data)

        if (!responseJson.status || !responseJson.result || !responseJson.result.response) {
          return conn.sendMessage(
            jid,
            {
              text: 'La IA no respondió. Intenta de nuevo más tarde.',
              contextInfo
            },
            { quoted: message }
          )
        }

        const replyText = responseJson.result.response.trim()

        conversationHistory[userId].push({ role: 'assistant', content: replyText })
        fs.writeFileSync(historyPath, JSON.stringify(conversationHistory, null, 2), 'utf8')

        const messageText = `
Pregunta: ${query}

Respuesta: ${replyText}
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
            text: `Error al procesar la respuesta de la IA.\n${error.message}`,
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
        text: `Error de conexión con la IA.\n${error.message}`,
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