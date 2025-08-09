// plugins/listgroups.js

const { prefix, owners } = require('../settings')

module.exports = {
  command: ['grupos', 'listgroups'],
  owner: true,
  handler: async (conn, { message, isOwner }) => {
    const to = message.key.remoteJid

    if (!isOwner) {
      const warning = [
        '❌ ╭─「 ACCESO DENEGADO 」─╮',
        '│ Solo el owner puede usar este comando.',
        '╰─────────────────────╯'
      ].join('\n')
      return conn.sendMessage(to, { text: warning }, { quoted: message })
    }

    // Filtrar chats de grupo
    const groupIds = [...conn.chats.keys()].filter(id => id.endsWith('@g.us'))
    const lines = []

    for (const id of groupIds) {
      try {
        const meta = await conn.groupMetadata(id)
        const size = meta.participants.length
        const me     = meta.participants.find(u => u.id === conn.user.jid) || {}
        const isAdmin = !!me.admin
        let link = 'N/A'

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
        // ignorar errores de metadata
      }
    }

    const finalText = [
      '📋 ╭─「 LISTA DE GRUPOS 」─╮',
      ...lines,
      '╰────────────────────╯'
    ].join('\n\n')

    const contextInfo = {
      externalAdReply: {
        title: 'Tus reinos botescos',
        body: 'Número de grupos: ' + groupIds.length,
        thumbnail: await (await fetch('https://i.imgur.com/zY4fR4F.png')).arrayBuffer(),
        mediaType: 1
      }
    }

    return conn.sendMessage(to, { text: finalText, contextInfo }, { quoted: message })
  }
}