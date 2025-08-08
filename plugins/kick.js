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

    const botId = conn.user.id.split(':')[0] + '@s.whatsapp.net';

    const isSenderAdmin = admins.includes(sender);

    const isBotAdmin = admins.includes(botId);

    if (!isSenderAdmin) {

        return conn.sendMessage(from, {

            text: '*😤 Solo los administradores pueden usar este comando.*',

        });

    }

    if (!isBotAdmin) {

        return conn.sendMessage(from, {

            text: '*⚠️ Zenitsu no puede expulsar a nadie si no es administrador...*',

        });

    }

    const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

    const replyTarget = message.message?.extendedTextMessage?.contextInfo?.participant;

    const target = mentioned[0] || replyTarget;

    if (!target) {

        return conn.sendMessage(from, {

            text: '*📌 Menciona o responde al usuario que deseas expulsar.*',

        });

    }

    if (admins.includes(target)) {

        return conn.sendMessage(from, {

            text: '*🛡️ Zenitsu no puede expulsar a otro administrador.*',

        });

    }

    const caption = `

╭─「 ⚡ 𝙀𝙓𝙋𝙐𝙇𝙎𝙄𝙊𝙉 」─╮

│ 👤 *Usuario:* @${target.split('@')[0]}

│ 🧹 *Acción:* Expulsado del grupo

│ 😳 *Motivo:* Zenitsu recibió la orden...

╰────────────────────╯

`.trim();

    await conn.sendMessage(from, {

        text: caption,

        mentions: [target]

    }, { quoted: message });

    await conn.groupParticipantsUpdate(from, [target], 'remove');

}

module.exports = {

    command: 'kick',

    handler,

};