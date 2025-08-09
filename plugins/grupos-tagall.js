async function handler(conn, { message }) {
    const from = message.key.remoteJid;
    const isGroup = from.endsWith('@g.us');
    const sender = message.key.participant || from;

    // Validación de entorno grupal
    if (!isGroup) {
        return conn.sendMessage(from, {
            text: '🌌 Este ritual solo puede invocarse en grupos.'
        });
    }

    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants;

    // Normalizador universal de JIDs (soporta lid, c.us, s.whatsapp.net, etc.)
    const normalize = jid => {
        if (!jid) return '';
        return jid.replace(/^lid:/, '').split('@')[0];
    };

    const admins = participants.filter(p => p.admin).map(p => normalize(p.id));
    const senderId = normalize(sender);
    const botId = normalize(conn.user.id);

    const isSenderAdmin = admins.includes(senderId);
    const isBotAdmin = admins.includes(botId);

    // Validación de admin grupal
    if (!isSenderAdmin) {
        return conn.sendMessage(from, {
            text: '🧿 Este ritual solo puede ser invocado por los guardianes del grupo (admins).'
        });
    }

    // Construcción de menciones
    const mentions = participants.map(p => p.id);
    const nombres = mentions.map(jid => `@${normalize(jid)}`).join('\n');

    const ceremonialMessage = `
╭─「 🔔 𝙍𝙄𝙏𝙐𝘼𝙇 𝘿𝙀 𝙇𝘼 𝙇𝙇𝘼𝙈𝘼𝘿𝘼 」─╮
│ 🧭 Invocado por: @${senderId}
│ 👥 Miembros convocados:
│ 
${nombres}
│ 
│ 🌌 Que todos escuchen el llamado...
╰────────────────────────────╯
`.trim();

    // Enviar mensaje con menciones si el bot es admin
    await conn.sendMessage(from, {
        text: ceremonialMessage,
        ...(isBotAdmin ? { mentions } : {})
    }, { quoted: message });

    // Aviso ritual si el bot no es admin
    if (!isBotAdmin) {
        await conn.sendMessage(from, {
            text: '⚠️ El ritual fue invocado, pero el bot no posee poder total. Algunos espíritus podrían no sentir el llamado completo.'
        });
    }

    // Logging ritual para depuración
    console.log('🔍 Bot ID:', botId);
    console.log('🔍 Sender ID:', senderId);
    console.log('🔍 Admins:', admins);
}

module.exports = {
    command: 'tagall',
    handler,
};