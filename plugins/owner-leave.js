// plugins/leave.js
const { allOwners, botname } = require('../settings')

module.exports = {
  command: 'xd',
  handler: async (conn, { message }) => {
    const from    = message.key.remoteJid
    const sender  = message.key.participant || from
    const isGroup = from.endsWith('@g.us')

    // 🔥 DEBUG: invocación
    console.log(`🔥 [DEBUG] Comando leave invocado por: ${sender} en: ${from}`)

    // 🔐 Validación de owner
    if (!allOwners.includes(sender)) {
      console.log(`🚫 [DEBUG] Usuario no autorizado: ${sender}`)
      return conn.sendMessage(from, {
        text: `*😤 ¡Alto ahí!*\n\n> Solo el gran maestro de ${botname} o los guardianes autorizados pueden ordenar mi partida.`
      }, { quoted: message })
    }

    // ❌ Solo se ejecuta en grupos
    if (!isGroup) {
      console.log('🚫 [DEBUG] Comando leave usado en privado')
      return conn.sendMessage(from, {
        text: '*❌ Este comando solo puede usarse dentro de un grupo.*'
      }, { quoted: message })
    }

    try {
      // 👋 Aviso al grupo antes de abandonar
      await conn.sendMessage(from, {
        text: `*👋 Zenitsu abandona el santuario...*\n\n> Que el trueno siempre os proteja.`
      })

      // 🏃‍♂️ Salida del grupo
      await conn.groupLeave(from)
      console.log(`✅ [DEBUG] Salida exitosa de: ${from}`)

      // ✅ Confirmación al invocador en privado
      await conn.sendMessage(sender, {
        text: `*✅ ¡Ritual completado!*\n\n> Zenitsu ha dejado el grupo \`${from}\`.`
      })
    } catch (err) {
      console.error('💥 [DEBUG] Error en comando leave:', err)
      return conn.sendMessage(from, {
        text: '*💥 ¡Algo salió mal al abandonar el grupo!*\n\n> Zenitsu no pudo completar el ritual de partida.'
      }, { quoted: message })
    }
  }
}