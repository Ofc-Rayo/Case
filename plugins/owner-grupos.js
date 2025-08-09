// plugins/listgroups.js

console.log('[listgroups] Plugin cargado')

let settings  
try {
  settings = require('../settings')
  console.log('[listgroups] settings cargado:', Object.keys(settings))
} catch (err) {
  console.error('[listgroups] Error al cargar settings:', err)
  settings = {}
}

// Usa tu arreglo unificado de owners
const owners = Array.isArray(settings.allOwners)
  ? settings.allOwners
  : []

console.log('[listgroups] allOwners:', owners)

module.exports = {
  command: 'grupos',
  handler: async (conn, { message }) => {
    const to   = message.key.remoteJid
    const from = message.key.participant || to

    console.log('[listgroups] Invocado por', from)

    if (!owners.includes(from)) {
      const warning = [
        '❌ ╭─「 ACCESO DENEGADO 」─╮',
        `│ Tu JID: ${from}`,
        '│ Solo el owner puede usar este comando.',
        '╰─────────────────────╯'
      ].join('\n')
      return conn.sendMessage(to, { text: warning }, { quoted: message })
    }

    // Por ahora confirmamos el permiso
    return conn.sendMessage(to, {
      text: '✅ Permiso de owner validado. Aquí se liberará la lista de grupos…'
    }, { quoted: message })
  }
}