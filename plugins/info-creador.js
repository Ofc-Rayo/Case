const fs = require('fs')
const path = require('path')

const thumbnailUrl = 'https://qu.ax/MvYPM.jpg' // Miniatura ceremonial

const contextInfo = {
  externalAdReply: {
    title: 'Creador - Rayo',
    body: 'Creador - Rayo-ofc',
    mediaType: 1,
    previewType: 0,
    thumbnailUrl
  }
}

async function handler(conn, { message }) {
  const jid = message.key.remoteJid

  const fichaImperial = `
╭─「 𝘾𝙍𝙀𝘼𝘿𝙊𝙍 」─╮
│ 💥 Nombre: *Ivan*
│ 🌌 Rol: _*Creador*_
│ ✨ Contacto: +595972157130
│ 💸 PayPal: https://paypal.me/black374673
apoyenme con el proyecto para seguir mejorando
╰────────────────────╯
*No olvides de seguir el canal*`.trim()

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