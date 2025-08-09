async function handler(conn, { message }) {
    const from = message.key.remoteJid;
    const isGroup = from.endsWith('@g.us');
    const sender = message.key.participant || from;

    if (!isGroup) {
        return conn.sendMessage(from, {
            text: '🌌 Este ritual solo puede invocarse en grupos.'
        });
    }

    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants;

    // Extraer número base sin importar formato
    const getNumber = jid => {
        if (!jid) return '';
        return jid.replace(/^lid:/, '').split('@')[0];
    };

    const adminsRaw = participants.filter(p => p.admin).map(p => p.id);
    const adminsBase = adminsRaw.map(getNumber);

    const senderBase = getNumber(sender);
    const botBase = getNumber(conn.user.id);

    const isSenderAdmin = adminsBase.includes(senderBase);
    const isBotAdmin = adminsBase.includes(botBase);

    if (!isSenderAdmin) {
        return conn.sendMessage(from, {
            text: '🧿 Este ritual solo puede ser invocado por los guardianes del grupo (admins).'
        });
    }

    const mentions = participants.map(p => p.id);
    const nombres = mentions.map(jid => `@${getNumber(jid)}`).join('\n');

    const ceremonialMessage = `
╭─「 🔔 𝙍𝙄𝙏𝙐𝘼𝙇 𝘿𝙀 𝙇𝘼 𝙇𝙇𝘼𝙈𝘼𝘿𝘼 」─╮
│ 🧭 Invocado por: @${senderBase}
│ 👥 Miembros convocados:
│ 
${nombres}
│ 
│ 🌌 Que todos escuchen el llamado...
╰────────────────────────────╯
`.trim();

    await conn.sendMessage(from, {
        text: ceremonialMessage,
        ...(isBotAdmin ? { mentions } : {})
    }, { quoted: message });

    if (!isBotAdmin) {
        await conn.sendMessage(from, {
            text: '⚠️ El ritual fue invocado, pero el bot no posee poder total. Algunos espíritus podrían no sentir el llamado completo.'
        });
    }

    // Logging ritual para depuración
    console.log('🔍 Bot ID:', conn.user.id);
    console.log('🔍 Bot Base:', botBase);
    console.log('🔍 Admins Raw:', adminsRaw);
    console.log('🔍 Admins Base:', adminsBase);
}

module.exports = {
    command: 'tagall',
    handler,
};