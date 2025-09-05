async function handler(conn, { message }) {
  const from = message.key.remoteJid
  const sender = message.key.participant || from

  // Verificar si es un grupo
  if (!from.endsWith('@g.us')) {
    return conn.sendMessage(from, { text: '🌌 Este ritual solo puede invocarse en grupos.' })
  }

  // Obtener datos del grupo
  const group = await conn.groupMetadata(from)
  const participants = group.participants

  // Verificar si el remitente es admin
  const isAdmin = participants.some(p =>
    (p.id === sender || p.jid === sender) &&
    (p.isAdmin || p.isSuperAdmin)
  )

  if (!isAdmin) {
    return conn.sendMessage(from, { text: '🧿 Este ritual solo puede invocarlo un guardián del grupo (admin).' })
  }

  // Crear menciones
  const mentions = participants.map(p => p.id || p.jid)
  const nombres = mentions.map(j => `@${j.split('@')[0]}`).join('\n')

  const ceremonialMessage = `
╭─「 🔔 𝙍𝙄𝙏𝙐𝘼𝙇 𝘿𝙀 𝙇𝘼 𝙇𝙇𝘼𝙈𝘼𝘿𝘼 」─╮
│ 🧭 Invocado por: @${sender.split('@')[0]}
│ 👥 Miembros convocados:
│ 
${nombres}
│ 
│ 🌌 Que todos escuchen el llamado...
╰────────────────────────────╯
  `.trim()

  // Enviar mensaje
  await conn.sendMessage(from, {
    text: ceremonialMessage,
    mentions
  }, { quoted: message })
}

module.exports = {
  command: 'tagall',
  handler,
}