// plugins/listgroups.js

const { prefix, allOwners } = require('../settings')

module.exports = {
  command: 'grupos',
  handler: async (conn, { message }) => {
    const to   = message.key.remoteJid
    const from = message.key.participant || to

    // Chequeo de owner
    if (!allOwners.includes(from)) {
      const warning = [
        '❌ ╭─「 ACCESO DENEGADO 」─╮',
        `│ Tu JID: ${from}`,
        '│ Solo el owner puede usar este comando.',
        '╰─────────────────────╯'
      ].join('\n')
      return conn.sendMessage(to, { text: warning }, { quoted: message })
    }

    // Recolección de grupos
    const groupIds = [...conn.chats.keys()].filter(id => id.endsWith('@g.us'))
    const lines = await Promise.all(groupIds.map(async id => {
      try {
        const meta    = await conn.groupMetadata(id)
        const size    = meta.participants.length
        const me      = meta.participants.find(u => u.id === conn.user.jid) || {}
        const isAdmin = !!me.admin
        let link      = 'N/A'

        if (isAdmin) {
          try {
            const code = await conn.groupInviteCode(id)
            link = 'https://chat.whatsapp.com/' + code
          } catch {}
        }

        return [
          '╭─「 ' + meta.subject + ' 」─╮',
          `│ 🌐 Miembros: ${size}`,
          `│ 🤖 Admin: ${isAdmin ? 'Sí' : 'No'}`,
          `│ 🔗 Link: ${link}`,
          '╰─────────────────╯'
        ].join('\n')
      } catch {
        return null
      }
    })).then(arr => arr.filter(Boolean))

    // Composición del mensaje
    const finalText = [
      '📋 ╭─「 LISTA DE GRUPOS 」─╮',
      ...lines,
      '╰────────────────────╯'
    ].join('\n\n')

    // Contexto visual
    const thumbnail = await fetch('https://i.imgur.com/zY4fR4F.png')
      .then(res => res.arrayBuffer())

    const contextInfo = {
      externalAdReply: {
        title: 'Tus reinos botescos',
        body:   `Total de grupos: ${groupIds.length}`,
        thumbnail,
        mediaType: 1
      }
    }

    return conn.sendMessage(to, { text: finalText, contextInfo }, { quoted: message })
  }
}