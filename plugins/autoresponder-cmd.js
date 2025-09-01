export default async function (m, { conn }) {
  const chat = global.db.data.chats[m.chat] ?? {}
  const text = m.body || m.message?.conversation || ''

  if (!text.toLowerCase().startsWith('autoresponder')) return

  const args = text.trim().split(/\s+/)
  const subcmd = args[1]?.toLowerCase()

  if (subcmd === 'on' || subcmd === 'enable') {
    chat.autoresponder = true
    global.db.data.chats[m.chat] = chat
    return await conn.sendMessage(m.chat, { text: '✅ *Autoresponder activado en este chat.*' }, { quoted: m })
  } else if (subcmd === 'off' || subcmd === 'disable') {
    chat.autoresponder = false
    global.db.data.chats[m.chat] = chat
    return await conn.sendMessage(m.chat, { text: '✖️ *Autoresponder desactivado en este chat.*' }, { quoted: m })
  } else {
    const estado = chat.autoresponder ? '✅ Activado' : '✖️ Desactivado'
    return await conn.sendMessage(m.chat, { text: `🤖 Estado actual del autoresponder: *${estado}*\n\nUsa:\n• *autoresponder on* — Activar\n• *autoresponder off* — Desactivar` }, { quoted: m })
  }
}