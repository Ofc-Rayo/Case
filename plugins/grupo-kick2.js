// plugins/kick-filter.js
async function handler(conn, { message }) {
    const from = message.key.remoteJid;
    const isGroup = from.endsWith('@g.us');
    const sender = message.key.participant || from;

    if (!isGroup) {
        return conn.sendMessage(from, {
            text: '*😰 Este comando solo puede usarse en grupos.*',
        });
    }

    const groupMetadata = await conn.groupMetadata(from);
    const admins = groupMetadata.participants.filter(p => p.admin).map(p => p.id);

    // ✅ detectar el ID del bot de forma segura
    const botId = conn.user.id.split(':')[0] + '@s.whatsapp.net';
    const isSenderAdmin = admins.includes(sender);
    const isBotAdmin = admins.includes(botId) || admins.some(a => a.includes(conn.user.id.split('@')[0]));

    if (!isSenderAdmin) {
        return conn.sendMessage(from, {
            text: '*😤 Solo los administradores pueden usar este comando.*',
        });
    }
    if (!isBotAdmin) {
        return conn.sendMessage(from, {
            text: '*⚠️ No puedo expulsar si no soy administrador...*',
        });
    }

    // 🔹 FILTRO: prefijos a expulsar
    const prefixFilter = ['212', '20', '966']; // ejemplo: Marruecos, Egipto, Arabia Saudita

    let toKick = groupMetadata.participants
        .map(p => p.id)
        .filter(id => prefixFilter.some(pref => id.startsWith(pref)));

    if (toKick.length === 0) {
        return conn.sendMessage(from, {
            text: '*✅ No se encontraron usuarios que coincidan con el filtro.*',
        });
    }

    for (let target of toKick) {
        const caption = `
╭─「 ⚡ 𝙀𝙓𝙋𝙐𝙇𝙎𝙄𝙊𝙉 」─╮
│ 👤 *Usuario:* @${target.split('@')[0]}
│ 🧹 *Acción:* Expulsado del grupo
│ 😳 *Motivo:* No cumple con las reglas del grupo
╰────────────────────╯
`.trim();

        await conn.sendMessage(from, {
            text: caption,
            mentions: [target]
        }, { quoted: message });

        await conn.groupParticipantsUpdate(from, [target], 'remove');
    }
}

module.exports = {
    command: 'kick2',
    handler,
};