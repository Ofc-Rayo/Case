async function handler(conn, { message, normalizedSender, isGroup }) {
    if (!isGroup) return;

    const from = message.key.remoteJid;
    const groupMetadata = await conn.groupMetadata(from);
    const admins = groupMetadata.participants.filter(p => p.admin).map(p => p.id);

    const botId = conn.user.id;
    const senderId = normalizedSender;

    // ✅ Comparación robusta
    const isSenderAdmin = admins.some(a => a.split('@')[0] === senderId.split('@')[0]);
    const isBotAdmin = admins.some(a => a.split('@')[0] === botId.split('@')[0]);

    if (!isSenderAdmin) return conn.sendMessage(from, { text: '*😤 Solo admins pueden usar esto*' });
    if (!isBotAdmin) return conn.sendMessage(from, { text: '*⚠️ No puedo expulsar si no soy admin*' });

    const prefixFilter = ['212', '20', '966']; 
    const toKick = groupMetadata.participants
        .map(p => p.id)
        .filter(id => prefixFilter.some(pref => id.startsWith(pref)));

    if (toKick.length === 0) return conn.sendMessage(from, { text: '*✅ No hay usuarios que coincidan con el filtro*' });

    for (let target of toKick) {
        const caption = `
╭─「 ⚡ 𝙀𝙓𝙋𝙐𝙇𝙎𝙄𝙊𝙉 」─╮
│ 👤 *Usuario:* @${target.split('@')[0]}
│ 🧹 *Acción:* Expulsado
│ 😳 *Motivo:* No cumple reglas del grupo
╰────────────────────╯
`.trim();

        await conn.sendMessage(from, { text: caption, mentions: [target] }, { quoted: message });
        await conn.groupParticipantsUpdate(from, [target], 'remove');
    }
}

module.exports = { command: 'kick2', handler };