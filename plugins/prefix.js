const fs = require('fs')

async function handler(conn, { message, text, usedPrefix, command }) {
  const jid = message.key.remoteJid;

  if (!text) {
    throw `Ingrese el prefijo que quieres\n\nEjemplo: ${usedPrefix + command} #`;
  }

  // rayo
  let escapedPrefix = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  global.prefix = new RegExp('^' + escapedPrefix);

  const confirmMessage = `
╭─「 𝙋𝙍𝙀𝙁𝙄𝙅𝙊 𝘼𝘾𝙏𝙐𝘼𝙇𝙄𝙕𝘼𝘿𝙊 」─╮
│ ✅ Nuevo prefijo: *${text}*
│ 📌 Ejemplo de uso: *${text}menu*
╰────────────────────────────╯`.trim();

  await conn.sendMessage(
    jid,
    {
      text: confirmMessage
    },
    { quoted: message }
  );
}

module.exports = {
  command: 'setprefix',
  handler
};