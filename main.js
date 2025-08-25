import { smsg } from './lib/simple.js'
import { format } from 'util'
import { fileURLToPath } from 'url'
import path, { join } from 'path'
import { unwatchFile, watchFile } from 'fs'
import chalk from 'chalk'
import fetch from 'node-fetch'
import ws from 'ws'

const { proto, default: baileys } = await import('@whiskeysockets/baileys')

const isNumber = x => typeof x === 'number' && !isNaN(x)
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(resolve, ms))

export async function handler(chatUpdate) {
    this.msgqueque = this.msgqueque || []
    this.uptime = this.uptime || Date.now()
    if (!chatUpdate) return
    this.pushMessage(chatUpdate.messages).catch(console.error)

    let m = chatUpdate.messages[chatUpdate.messages.length - 1]
    if (!m) return

    if (global.db.data == null) await global.loadDatabase()

    try {
        m = smsg(this, m) || m
        if (!m) return

        // Inicialización de usuario
        let user = global.db.data.users[m.sender] || {}
        if (!isNumber(user.exp)) user.exp = 0
        if (!isNumber(user.coin)) user.coin = 10
        if (!('premium' in user)) user.premium = false
        if (!('registered' in user)) user.registered = false
        if (!('name' in user)) user.name = m.name
        global.db.data.users[m.sender] = user

        // Inicialización de chat
        let chat = global.db.data.chats[m.chat] || {}
        if (!('isBanned' in chat)) chat.isBanned = false
        if (!('antiLink' in chat)) chat.antiLink = true
        global.db.data.chats[m.chat] = chat

        // Settings del bot
        let settings = global.db.data.settings[this.user.jid] || {}
        if (!('self' in settings)) settings.self = false
        global.db.data.settings[this.user.jid] = settings

        // Verificación de permisos y roles
        const detectwhat = m.sender.includes('@lid') ? '@lid' : '@s.whatsapp.net'
        const isROwner = [...global.owner.map(([number]) => number)]
            .map(v => v.replace(/[^0-9]/g, '') + detectwhat)
            .includes(m.sender)
        const isOwner = isROwner || m.fromMe
        const isMods = isROwner || global.mods.map(v => v.replace(/[^0-9]/g, '') + detectwhat).includes(m.sender)
        const isPrems = isROwner || global.prems.map(v => v.replace(/[^0-9]/g, '') + detectwhat).includes(m.sender) || user.premium

        if (m.isBaileys) return
        if (!isROwner && settings.self) return

        // Metadata de grupo
        const groupMetadata = m.isGroup ? ((this.chats[m.chat] || {}).metadata || await this.groupMetadata(m.chat).catch(_ => null)) : {}
        const participants = m.isGroup ? (groupMetadata?.participants || []) : []
        const participantUser = participants.find(p => p.id === m.sender) || {}
        const participantBot = participants.find(p => p.id === this.user.jid) || {}
        const isRAdmin = participantUser?.admin === "superadmin"
        const isAdmin = isRAdmin || participantUser?.admin === "admin"
        const isBotAdmin = !!participantBot?.admin

        // Loop plugins
        const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './plugins')
        for (let name in global.plugins) {
            let plugin = global.plugins[name]
            if (!plugin || plugin.disabled) continue
            const __filename = join(___dirname, name)

            // Ejecutar función global 'all' si existe
            if (typeof plugin.all === 'function') {
                try { await plugin.all.call(this, m, { chatUpdate, __dirname: ___dirname, __filename }) } 
                catch (e) { console.error(e) }
            }

            // Chequeo de prefijo y comando
            let _prefix = plugin.customPrefix || this.prefix || global.prefix
            let match = (_prefix instanceof RegExp ? [[_prefix.exec(m.text), _prefix]] :
                Array.isArray(_prefix) ? _prefix.map(p => [p instanceof RegExp ? p.exec(m.text) : new RegExp(p).exec(m.text), new RegExp(p)]) :
                [[new RegExp(_prefix).exec(m.text), new RegExp(_prefix)]]
            ).find(p => p[1])

            if (!match) continue
            const usedPrefix = (match[0] || '')[0]
            let [command, ...args] = m.text.replace(usedPrefix, '').trim().split` `.filter(Boolean)
            command = (command || '').toLowerCase()
            args = args || []

            // Verificación permisos plugin
            if (plugin.botAdmin && !isBotAdmin) continue
            if (plugin.admin && !isAdmin) continue
            if (plugin.owner && !isOwner) continue
            if (plugin.mods && !isMods) continue
            if (plugin.group && !m.isGroup) continue
            if (plugin.private && m.isGroup) continue
            if (plugin.register && !user.registered) continue

            // Ejecutar plugin
            try { await plugin.call(this, m, { usedPrefix, command, args, participants, groupMetadata, isOwner, isAdmin, isBotAdmin, isMods, isPrems }) }
            catch (e) {
                m.error = e
                console.error(e)
                let text = format(e)
                m.reply(text)
            }
        }

    } catch (e) { console.error(e) }

    finally {
        // Lectura automática si está activado
        if (settings.autoread) await this.readMessages([m.key])
    }
}

// Reload automático del handler
let file = global.__filename(import.meta.url, true)
watchFile(file, async () => {
    unwatchFile(file)
    console.log(chalk.magenta("Se actualizo 'main.js'"))
    if (global.conns?.length > 0) {
        for (const conn of [...new Set(global.conns.filter(c => c.user && c.ws.socket && c.ws.socket.readyState !== ws.CLOSED))]) {
            conn.subreloadHandler(false)
        }
    }
})