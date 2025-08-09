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

  // 2) Metadata y lista de admins reales
  const meta         = await conn.groupMetadata(from)
  const participants = meta.participants

  // Extrae el número base de un JID (soporta lid:, @s.whatsapp.net, @c.us, etc.)
  const getBase = jid => jid?.replace(/^lid:/, '').split?.('@')[0] || ''

  // Detecta admins (admin o superadmin)
  const adminsBase = participants
    .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
    .map(p => getBase(p.jid || p.id))

  const senderBase = getBase(senderJid)

  // 3) Solo admins pueden invocar
  if (!adminsBase.includes(senderBase)) {
    return conn.sendMessage(from, {
      text: '🧿 Este ritual solo puede ser invocado por los guardianes del grupo (admins).'
    })
  }

  // 4) Construye menciones y nombres
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

  // 5) Lanza el mensaje con menciones sin más validaciones
  await conn.sendMessage(from, {
    text: ceremonialMessage,
    mentions
  }, { quoted: message })
}

module.exports = {
  command: 'tagall',
  handler,
}