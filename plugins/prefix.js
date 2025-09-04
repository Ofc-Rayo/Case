const fs = require('fs');

async function execute(conn, { message, text, usedPrefix, command }) {
  const jid = message.key.remoteJid;

  if (!text) {
    await conn.sendMessage(jid, {
      text: `⚠️ 𝙉𝙊 𝙄𝙉𝙂𝙍𝙀𝙎𝘼𝙎𝙏𝙀 𝙐𝙉 𝙋𝙍𝙀𝙁𝙄𝙅𝙊.\n\n📌 Ejemplo de uso:\n${usedPrefix + command} #`
    }, { quoted: message });
    return;
  }

  const escapedPrefix = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  global.prefix = new RegExp('^[' + escapedPrefix + ']');

  const confirmMessage = `
╭─「 𝙋𝙍𝙀𝙁𝙄𝙅𝙊 𝘼𝘾𝙏𝙐𝘼𝙇𝙄𝙕𝘼𝘿𝙊 」─╮
│ ✅ Prefijo actualizado a: *${text}*
│ 📌 Usa comandos así: *${text}menu*
╰────────────────────────────╯`.trim();

  await conn.sendMessage(jid, { text: confirmMessage }, { quoted: message });
}

module.exports = {
  command: 'setprefix'
  async handler(conn, data) {
    await execute(conn, data);
  }
};