async function handler(conn, { message }) {

    const from = message.key.remoteJid;

    const isGroup = from.endsWith('@g.us');

    const senderRaw = message.key.participant || from;

    const botRaw = conn.user.id.split(':')[0] + '@s.whatsapp.net';

    const cleanID = id => id.replace(/:.*$/, '');

    const sender = cleanID(senderRaw);

    const botId = cleanID(botRaw);

    if (!isGroup) {

        return conn.sendMessage(from, {

            text: '*📌 Este comando solo funciona en grupos.*',

        });

    }

    const groupMetadata = await conn.groupMetadata(from);

    const admins = groupMetadata.participants.filter(p => p.admin).map(p => p.id);

    const isSenderAdmin = admins.includes(sender);

    const isBotAdmin = admins.includes(botId);

    const caption = `

╭─「 ⚡ 𝘿𝙀𝘽𝙐𝙂 𝘼𝘿𝙈𝙄𝙉 」─╮

│ 👤 *Tú:* @${sender.split('@')[0]}

│ 🤖 *Bot:* @${botId.split('@')[0]}

│ 

│ 🧠 *¿Eres admin?* ${isSenderAdmin ? '✅ Sí' : '❌ No'}

│ ⚙️ *¿Bot es admin?* ${isBotAdmin ? '✅ Sí' : '❌ No'}

╰────────────────────╯

`.trim();

    await conn.sendMessage(from, {

        text: caption,

        mentions: [sender, botId]

    }, { quoted: message });

}

module.exports = {

    command: 'debugadmin',

    handler,

};