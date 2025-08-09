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
    const admins = participants.filter(p => p.admin).map(p => p.id);

    const isSenderAdmin = admins.includes(sender);
    const botId = conn.user.id.split(':')[0] + '@s.whatsapp.net';
    const isBotAdmin = admins.includes(botId);

    // Validación de admin grupal
    if (!isSenderAdmin) {
        return conn.sendMessage(from, {
            text: '🧿 Este ritual solo puede ser invocado por los guardianes del grupo (admins).'
        });
    }

    // Construcción de menciones
    const mentions = participants.map(p => p.id);
    const nombres = mentions.map(jid => `@${jid.split('@')[0]}`).join('\n');

    const ceremonialMessage = `
╭─「 🔔 𝙍𝙄𝙏𝙐𝘼𝙇 𝘿𝙀 𝙇𝘼 𝙇𝙇𝘼𝙈𝘼𝘿𝘼 」─╮
│ 🧭 Invocado por: @${sender.split('@')[0]}
│ 👥 Miembros convocados:
│ 
${nombres}
│ 
│ 🌌 Que todos escuchen el llamado...
╰────────────────trim();

    // Enviar mensaje con o sin menciones según el poder del bot
    await conn.sendMessage(from, {
        text: ceremonialMessage,
        ...(isBotAdmin ? { mentions } : {})
    }, { quoted: message });

    // Aviso ritual si el bot no es admin
    if (!isBotAdmin) {
        await conn.sendMessage(from, {
            text: '⚠️ El ritual fue invocado, pero el bot no posee poder total (no es admin). Algunos espíritus podrían no sentir el llamado completo.'
        });
    }
}

module.exports = {
    command: 'tagall',
    handler,
};