const { allOwners, botname } = require('../settings')

module.exports = {
  command: 'join',
  handler: async (conn, { message, args }) => {
    const from   = message.key.remoteJid
    const sender = message.key.participant || from

    console.log(`[DEBUG] Comando join invocado por: ${sender}`)
    console.log('[DEBUG] allOwners:', allOwners)

    if (!allOwners.includes(sender)) {
      console.log(`[DEBUG] Usuario no autorizado: ${sender}`)
      return conn.sendMessage(from, {
        text: `No estás autorizado para usar este comando.`
      }, { quoted: message })
    }

    const inviteLink = args.join(' ').trim()
    if (!inviteLink) {
      return conn.sendMessage(from, {
        text: `Uso: .join <enlace de invitación>`
      }, { quoted: message })
    }

    let inviteCode = inviteLink.split('/').pop()
    inviteCode = inviteCode.split('?')[0]

    console.log(`[DEBUG] inviteLink: ${inviteLink}`)
    console.log(`[DEBUG] inviteCode: ${inviteCode}`)

    try {
      await conn.sendMessage(from, {
        text: `Uniéndome al grupo...`
      }, { quoted: message })

      const groupJid = await conn.groupAcceptInvite(inviteCode)
      console.log(`[DEBUG] Bot se unió al grupo: ${groupJid}`)

      await conn.sendMessage(from, {
        text: `Listo, me uní al grupo: ${groupJid}`
      }, { quoted: message })

      await conn.sendMessage(groupJid, {
        text: `llegó la diversión`
      })
    } catch (err) {
      console.error('[DEBUG] Error al aceptar invitación:', err)
      return conn.sendMessage(from, {
        text: `Error al unirme al grupo: ${err.message}`
      }, { quoted: message })
    }
  }
}