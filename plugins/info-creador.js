const fs = require('fs')
const path = require('path')

const thumbnailUrl = 'https://qu.ax/MvYPM.jpg' // Miniatura ceremonial

const contextInfo = {
  externalAdReply: {
    title: '👑 Carlos - Creador',
    body: 'Creador Oficial',
    mediaType: 1,
    previewType: 0,
    mediaUrl: 'https://zenitsu.bot',
    sourceUrl: 'https://zenitsu.bot',
    thumbnailUrl
  }
}

async function handler(conn, { message }) {
  const jid = message.key.remoteJid

  const fichaImperial = `
╭─「 👑 𝙈𝙞 - 𝘾𝙍𝙀𝘼𝘿𝙊𝙍 」─╮
│ ♦ Nombre: *Carlos*
│ 🎭 Rol: _*Creador*_
│ 🧩 Contacto: +5355699866
│ 🖼️ GitHub:https://github.com/Kone457
╰────────────────────╯

🌐 Más en: https://kone457.github.io/Nexus/

🧎‍♂️ Zenitsu se inclina ante su maestro del trueno.
`.trim()

  await conn.sendMessage(
    jid,
    {
      text: fichaImperial,
      contextInfo
    },
    { quoted: message }
  )
}

module.exports = {
  command: 'creador',
  handler
}