// autoResponder.js
const https = require('https')
const fs = require('fs')
const path = require('path')

const historyPath = path.resolve('./zenitsuMemory.json')
if (!fs.existsSync(historyPath)) {
  fs.writeFileSync(historyPath, JSON.stringify({}), 'utf8')
}

async function processMessage(conn, message) {
  const jid = message.key.remoteJid
  const rawJid = message.key.participant || message.key.remoteJid
  const userId = rawJid.split('@')[0]

  // Solo mensajes de texto y no propios
  if (!message.message || !message.message.conversation) return
  if (message.key.fromMe) return

  const query = message.message.conversation.trim()
  if (!query) return

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
            { text: 'La IA no respondió. Intenta de nuevo más tarde.' },
            { quoted: message }
          )
        }

        const replyText = responseJson.result.response.trim()

        conversationHistory[userId].push({ role: 'assistant', content: replyText })
        fs.writeFileSync(historyPath, JSON.stringify(conversationHistory, null, 2), 'utf8')

        await conn.sendMessage(
          jid,
          { text: replyText },
          { quoted: message }
        )
      } catch (error) {
        await conn.sendMessage(
          jid,
          { text: `Error al procesar la respuesta de la IA.\n${error.message}` },
          { quoted: message }
        )
      }
    })
  }).on('error', async (error) => {
    await conn.sendMessage(
      jid,
      { text: `Error de conexión con la IA.\n${error.message}` },
      { quoted: message }
    )
  })
}

module.exports = { processMessage }