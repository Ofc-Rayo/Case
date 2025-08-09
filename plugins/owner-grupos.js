// plugins/listgroups.js

const { prefix, owners } = require('../settings')
const fetch = require('node-fetch') // si no lo tienes, npm install node-fetch

module.exports = {
  command: 'grupos',
  handler: async (conn, { message }) => {
    const to       = message.key.remoteJid
    const from     = message.key.participant || to  // group → participant, chat individual → remoteJid

    // Debug: imprime JID que llega
    console.log('[.listgroups] mensaje de:', from)
    console.log('[.listgroups] owners config:', owners)

    // Chequeo de owner
    if (!owners.includes(from)) {
      const warning = [
        '❌ ╭─「 ACCESO DENEGADO 」─╮',
        '│ Solo el owner puede usar este comando.',
        `│ Tu JID: ${from}`,
        '╰─────────────────────╯'
      ].join('\n')
      return conn.sendMessage(to, { text: warning }, { quoted: message })
    }

    // Filtrar chats de grupo
    const groupIds = [...conn.chats.keys()].filter(id => id.endsWith('@g.us'))
    const lines = []

    for (const id of groupIds) {
      try {
        const meta      = await conn.groupMetadata(id)
        const size      = meta.participants.length
        const me        = meta.participants.find(u => u.id === conn.user.jid) || {}
        const isAdmin   = !!me.admin
        let link        = 'N/A'

        if (isAdmin) {
          try {
            const code = await conn.groupInviteCode(id)
            link = 'https://chat.whatsapp.com/' + code
          } catch {}
        }

        lines.push([
          '╭─「 ' + meta.subject + ' 」─╮',
          `│ 🌐 Miembros: ${size}`,
          `│ 🤖 Admin: ${isAdmin ? 'Sí' : 'No'}`,
          `│ 🔗 Link: ${link}`,
          '╰─────────────────╯'
        ].join('\n'))

      } catch (err) {
        console.error(`[.listgroups] Error al obtener metadata de ${id}:`, err.message)
      }
    }

    const finalText = [
      '📋 ╭─「 LISTA DE GRUPOS 」─╮',
      ...lines,
      '╰────────────────────╯'
    ].join('\n\n')

    const thumbnailBuffer = await fetch('https://i.imgur.com/zY4fR4F.png')
      .then(res => res.arrayBuffer())

    const contextInfo = {
      externalAdReply: {
        title: 'Tus reinos botescos',
        body: `Total de grupos: ${groupIds.length}`,
        thumbnail: thumbnailBuffer,
        mediaType: 1
      }
    }

    return conn.sendMessage(to, { text: finalText, contextInfo }, { quoted: message })
  }
}