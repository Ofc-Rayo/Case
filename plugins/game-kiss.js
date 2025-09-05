const fs = require('fs');
const path = require('path');

async function getContactName(conn, jid) {
  jid = jid.includes('@s.whatsapp.net') ? jid : jid + '@s.whatsapp.net';
  const contact = conn.contacts?.[jid] || {};
  return contact.name || contact.notify || jid.split('@')[0];
}

const handler = async (m, { conn }) => {
  let who = (m.mentionedJid && m.mentionedJid.length > 0)
    ? m.mentionedJid[0]
    : (m.quoted ? m.quoted.sender : m.sender);

  let name = await getContactName(conn, who);
  let name2 = await getContactName(conn, m.sender);

  let str =
    who === m.sender
      ? `╭──〔 💞 BESO EN SOLITARIO 〕──╮\n` +
        `┃ ${name2} se dio un beso con cariño\n` +
        `╰───────────────────────────────╯`
      : `╭──〔 💋 BESO COMPARTIDO 〕──╮\n` +
        `┃ ${name2} besó a ${name}\n` +
        `╰──────────────────────────╯`;

  if (m.isGroup) {
    const videos = [
      'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745784879173.mp4',
      'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745784874988.mp4',
      'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745784869583.mp4',
      'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745784864195.mp4',
      'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745784856547.mp4',
      'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745784908581.mp4',
      'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745784904437.mp4',
      'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745784899621.mp4',
      'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745784894649.mp4',
      'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745784889479.mp4',
      'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745784945508.mp4',
      'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745784940220.mp4',
      'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745784935466.mp4',
      'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745784918972.mp4',
      'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745784914086.mp4'
    ];

    const video = videos[Math.floor(Math.random() * videos.length)];

    await conn.sendMessage(
      m.chat,
      {
        video: { url: video },
        gifPlayback: true,
        caption: str,
        mentions: [who]
      },
      { quoted: m }
    );
  }
};

module.exports = {
  command: 'kiss',
  handler
};