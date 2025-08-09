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
    const botId = conn.user.id.split(':')[0] + '@s.whatsapp.net';

    // Validación de owner universal
    const allOwners = ['1234567890@s.whatsapp.net', '9876543210@s.whatsapp.net']; // ← Personaliza este array
    const isSenderOwner = allOwners.includes(sender);
    const isBotAdmin = admins.includes(botId);

    if (!isSenderOwner) {
        return conn.sendMessage(from, {
            text: '🧿 Solo los invocadores supremos (owners) pueden usar este ritual.'
        });
    }

    if (!isBotAdmin) {
        return conn.sendMessage(from, {
            text: '⚠️ El bot no tiene poder suficiente para invocar el ritual. Hazlo administrador.'
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
╰────────────────────────────╯
`.trim();

    await conn.sendMessage(from, {
        text: ceremonialMessage,
        mentions
    }, { quoted: message });
}

module.exports = {
    command: 'tagall',
    handler,
};