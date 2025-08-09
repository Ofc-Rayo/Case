async function handler(conn, { message }) {
  const from      = message.key.remoteJid
  const isGroup   = from?.endsWith?.('@g.us')
  const senderJid = message.key.participant || from

  // 1) Solo en grupos
  if (!isGroup) {
    return conn.sendMessage(from, {
      text: '🌌 Este ritual solo puede invocarse en grupos.'
    })
  }

  // 2) Recuperar metadata y participantes
  const meta         = await conn.groupMetadata(from)
  const participants = meta.participants

  // Extrae el número base de un JID
  const getBase = jid => jid.replace(/^lid:/, '').split('@')[0]

  // 3) Filtrar solo admins del grupo
  const adminsBase = participants
    .filter(p => p.isAdmin || p.isSuperAdmin)
    .map(p => getBase(p.jid || p.id))

  const senderBase = getBase(senderJid)

  // 4) Validar invocador
  if (!adminsBase.includes(senderBase)) {
    return conn.sendMessage(from, {
      text: '🧿 Este ritual solo puede invocarlo un guardián del grupo (admin).'
    })
  }

  // 5) Construir la ceremonia
  const mentions = participants.map(p => p.jid || p.id)
  const nombres  = mentions.map(j => `@${getBase(j)}`).join('\n')

  const ceremonialMessage = `
╭─「 🔔 𝙍𝙄𝙏𝙐𝘼𝙇 𝘿𝙀 𝙇𝘼 𝙇𝙇𝘼𝙈𝘼𝘿𝘼 」─╮
│ 🧭 Invocado por: @${senderBase}
│ 👥 Miembros convocados:
│ 
${nombres}
│ 
│ 🌌 Que todos escuchen el llamado...
╰────────────────────────────╯
  `.trim()

  // 6) Enviar sin más validaciones
  await conn.sendMessage(from, {
    text: ceremonialMessage,
    mentions
  }, { quoted: message })
}

module.exports = {
  command: 'tagall',
  handler,
}