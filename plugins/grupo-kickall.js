async function handler(conn, { message }) {
    const from = message.key.remoteJid;
    const isGroup = from.endsWith('@g.us');
    const sender = message.key.participant || from;

    if (!isGroup) {
        return conn.sendMessage(from, {
            text: '😰 Este comando solo puede usarse en grupos.',
        }, { quoted: message });
    }

    const groupMetadata = await conn.groupMetadata(from);
    const participants = groupMetadata.participants;
    const admins = participants.filter(p => p.admin).map(p => p.id);
    const botId = conn.user.id.split(':')[0] + '@s.whatsapp.net';

    const isSenderAdmin = admins.includes(sender);
    const isBotAdmin = admins.includes(botId);

    if (!isSenderAdmin) {
        return conn.sendMessage(from, {
            text: '😤 Solo los administradores pueden invocar el ritual de expulsión total.',
        }, { quoted: message });
    }

    if (!isBotAdmin) {
        return conn.sendMessage(from, {
            text: '⚠️ Zenitsu no puede ejecutar el ritual si no es administrador...',
        }, { quoted: message });
    }

    const toKick = participants
        .map(p => p.id)
        .filter(id => !admins.includes(id) && id !== botId);

    if (toKick.length === 0) {
        return conn.sendMessage(from, {
            text: '🌸 Todos los miembros restantes son administradores o el bot. Ritual completo.',
        }, { quoted: message });
    }

    for (const target of toKick) {
        const caption = `
╭─「 ⚡ 𝙀𝙓𝙋𝙐𝙇𝙎𝙄𝙊𝙉 𝙍𝙄𝙏𝙐𝘼𝙇 」─╮
│ 👤 Usuario: @${target.split('@')[0]}
│ 🧹 Acción: Expulsado del grupo
│ 🕯️ Motivo: Purificación grupal ordenada por Zenitsu
╰────────────────────────────╯
`.trim();

        await conn.sendMessage(from, {
            text: caption,
            mentions: [target]
        }, { quoted: message });

        await conn.groupParticipantsUpdate(from, [target], 'remove');

        await new Promise(resolve => setTimeout(resolve, 1500)); // Pausa ritual entre expulsiones
    }

    await conn.sendMessage(from, {
        text: '✅ Ritual completado. El grupo ha sido purificado.',
    }, { quoted: message });
}

module.exports = {
    command: 'kickall',
    handler,
};