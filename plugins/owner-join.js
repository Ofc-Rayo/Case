// join.js
const { allOwners, botname } = require('../settings')

module.exports = {
  command: 'join',
  handler: async (conn, { message, text }) => {
    const from   = message.key.remoteJid
    const sender = message.key.participant || from

    // 🔥 DEBUG: invocación y owners
    console.log(`🔥 [DEBUG] Comando join invocado por: ${sender}`)
    console.log('🔥 [DEBUG] allOwners:', allOwners)

    // 🔐 Validación de owner
    if (!allOwners.includes(sender)) {
      console.log(`🚫 [DEBUG] Usuario no autorizado: ${sender}`)
      return conn.sendMessage(from, {
        text: `*😤 ¡Alto ahí!*\n\n> Solo el gran asesor de ${botname} o los guardianes autorizados pueden invocar este portal ritual...`
      }, { quoted: message })
    }

    // 📥 Uso correcto
    if (!text) {
      return conn.sendMessage(from, {
        text: `*📥 Uso:* .join <enlace de invitación>\n\n> Invoca el portal ritual para transportar a Zenitsu a tu santuario.`
      }, { quoted: message })
    }

    // 🔍 Extrae el código de invitación del link
    const inviteLink = text.trim()
    const inviteCode = inviteLink.split('/').pop()

    console.log(`🔥 [DEBUG] inviteLink: ${inviteLink}`)
    console.log(`🔥 [DEBUG] inviteCode: ${inviteCode}`)

    try {
      // 🚀 Mensaje previo al salto
      await conn.sendMessage(from, {
        text: `*✨ Invocando portal...*\n\n> Zenitsu se concentra para atravesar el umbral.`
      }, { quoted: message })

      // 🌌 Acepta la invitación y une al bot al grupo
      const groupJid = await conn.groupAcceptInvite(inviteCode)
      console.log(`✅ [DEBUG] Zenitsu se unió al grupo: ${groupJid}`)

      // ✅ Confirmación al invocador
      await conn.sendMessage(from, {
        text: `*✅ ¡Portal abierto!* \nZenitsu ha llegado al grupo ${groupJid}`
      }, { quoted: message })

      // 👋 Saludo al nuevo grupo
      await conn.sendMessage(groupJid, {
        text: `*👋 Ha llegado Zenitsu, el maestro del trueno se une al santuario.*`
      })
    } catch (err) {
      console.error('💥 [DEBUG] Error al aceptar invitación:', err)
      return conn.sendMessage(from, {
        text: `*💥 ¡Fallo al abrir el portal!*\n\n> Zenitsu no pudo atravesar el enlace...\n🛠️ ${err.message}`
      }, { quoted: message })
    }
  }
}