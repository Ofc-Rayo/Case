// ds.js
const fs = require('fs')
const path = require('path')
const { allOwners, botname } = require('../settings')

module.exports = {
  command: 'ds',
  handler: async (conn, { message }) => {
    const from   = message.key.remoteJid
    const sender = message.key.participant || from

    // 🔥 DEBUG: invocación y owners
    console.log(`🔥 [DEBUG] Comando ds invocado por: ${sender}`)
    console.log('🔥 [DEBUG] allOwners:', allOwners)

    // 🔐 Validación universal de owner
    if (!allOwners.includes(sender)) {
      console.log(`🚫 [DEBUG] Usuario no autorizado: ${sender}`)
      return conn.sendMessage(from, {
        text: `*😤 ¡Alto ahí!*\n\n> Solo el gran maestro de ${botname} o los guardianes autorizados pueden usar este comando...\nZenitsu está vigilando 👀`
      }, { quoted: message })
    }

    try {
      const sessionsPath = path.resolve(__dirname, '../sessions')
      console.log(`🔥 [DEBUG] sessionsPath: ${sessionsPath}`)

      // ❓ ¿Existe la carpeta de sesiones?
      if (!fs.existsSync(sessionsPath)) {
        console.log('🚫 [DEBUG] carpeta de sesiones no encontrada')
        return conn.sendMessage(from, {
          text: '*😰 ¡No encuentro la carpeta de sesiones!*\n\n> Zenitsu entra en pánico… ¿seguro que existe?',
        }, { quoted: message })
      }

      // 🚨 Lee y filtra archivos
      const files = fs.readdirSync(sessionsPath)
      const unnecessaryFiles = files.filter(f => f !== 'creds.json')
      console.log('🔥 [DEBUG] archivos detectados:', files)
      console.log('🔥 [DEBUG] a eliminar:', unnecessaryFiles)

      // ✅ Si no hay nada que borrar
      if (unnecessaryFiles.length === 0) {
        console.log('✅ [DEBUG] no hay archivos innecesarios')
        return conn.sendMessage(from, {
          text: '*✅ Todo está limpio, como el corazón de Zenitsu.*\n\n> No hay archivos innecesarios que eliminar.',
        }, { quoted: message })
      }

      // 🗑️ Borra cada archivo no esencial
      unnecessaryFiles.forEach(file => {
        fs.unlinkSync(path.join(sessionsPath, file))
        console.log(`🗑️ [DEBUG] eliminado: ${file}`)
      })

      // 🎉 Reporte de eliminación
      await conn.sendMessage(from, {
        text: `*🧹 Zenitsu eliminó las sesiones con valentía:*\n${unnecessaryFiles.map(f => `⚡ ${f}`).join('\n')}\n\n> ¡${botname} está listo para brillar otra vez! ✨`,
      }, { quoted: message })

      // 😳 Mensaje final de personalidad
      return conn.sendMessage(from, {
        text: '*😳 ¿Eh? ¿Me estás viendo? ¡No me mires tanto!*',
      }, { quoted: message })

    } catch (err) {
      console.error('💥 [DEBUG] Error en comando ds:', err)
      return conn.sendMessage(from, {
        text: '*💥 ¡Algo salió mal!*\n\n> Zenitsu se tropezó mientras borraba las sesiones… intenta de nuevo más tarde.',
      }, { quoted: message })
    }
  }
}