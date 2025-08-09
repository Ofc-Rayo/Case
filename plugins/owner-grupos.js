// plugins/listgroups.js

console.log('[listgroups] Plugin cargado')

let settings
try {
  settings = require('../settings')
  console.log('[listgroups] settings cargado:', settings)
} catch (err) {
  console.error('[listgroups] Error al cargar settings:', err)
  settings = {}  // Fallback
}

const owners = Array.isArray(settings.owners) ? settings.owners : []
console.log('[listgroups] owners array:', owners)

module.exports = {
  command: 'grupos',
  handler: async (conn, { message }) => {
    const to   = message.key.remoteJid
    const from = message.key.participant || to

    console.log('[listgroups] Invocado por', from)

    if (!owners.includes(from)) {
      return conn.sendMessage(to, {
        text: [
          '❌ ╭─「 ACCESO DENEGADO 」─╮',
          `│ Tu JID: ${from}`,
          '│ Solo el owner puede usar este comando.',
          '╰─────────────────────╯'
        ].join('\n')
      }, { quoted: message })
    }

    return conn.sendMessage(to, {
      text: '✅ Chequeo de owner exitoso. Preparando lista de grupos…'
    }, { quoted: message })
  }
}