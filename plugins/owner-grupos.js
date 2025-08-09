// plugins/listgroups.js

const { allOwners } = require('../settings')

// Helper para obtener IDs de grupos, pase lo que pase
function getGroupIds(conn) {
  // caso 1: conn.chats es un Map
  if (conn.chats instanceof Map) {
    return Array.from(conn.chats.keys())
      .filter(id => id.endsWith('@g.us'))
  }
  // caso 2: conn.store.chats es un objeto
  const storeChats = conn.store?.chats || conn.chats || {}
  return Object.keys(storeChats)
    .filter(id => id.endsWith('@g.us'))
}

module.exports = {
  command: 'grupos',
  handler: async (conn, { message }) => {
    const to   = message.key.remoteJid
    const from = message.key.participant || to

    // 1. Verificar owner
    if (!allOwners.includes(from)) {
      const warning = [
        '❌ ╭─「 ACCESO DENEGADO 」─╮',
        `│ Tu JID: ${from}`,
        '│ Solo el owner puede usar este comando.',
        '╰─────────────────────╯'
      ].join('\n')
      return conn.sendMessage(to, { text: warning }, { quoted: message })
    }

    // 2. Obtener grupos
    const groupIds = getGroupIds(conn)
    if (groupIds.length === 0) {
      return conn.sendMessage(to, {
        text: 'ℹ️ No he encontrado ningún grupo en mis chats.'
      }, { quoted: message })
    }

    // 3. Recolectar metadata
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

    // 4. Componer y enviar mensaje
    const finalText = [
      '📋 ╭─「 LISTA DE GRUPOS 」─╮',
      ...lines,
      '╰────────────────────╯'
    ].join('\n\n')

    // Contexto visual (asegúrate de tener fetch global o instalar node-fetch)
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