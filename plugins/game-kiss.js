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

const handler = async (m, { conn }) => {
  try {
    const mentionedJid = m.mentionedJid && m.mentionedJid[0];

    if (!mentionedJid) {
      const message = `@${m.sender.split('@')[0]} se besó así mismo 💋`;
      return conn.sendMessage(
        m.chat,
        {
          text: message,
          mentions: [m.sender],
        },
        { quoted: m }
      );
    }

    const videoUrl = videos[Math.floor(Math.random() * videos.length)];
    const message = `@${m.sender.split('@')[0]} le dio un beso a @${mentionedJid.split('@')[0]} 💋`;

    await conn.sendMessage(
      m.chat,
      {
        video: { url: videoUrl },
        caption: message,
        mentions: [m.sender, mentionedJid],
      }
    );
  } catch (error) {
    console.error(error);
    await conn.sendMessage(
      m.chat,
      { text: 'Ocurrió un error al ejecutar el comando.' },
      { quoted: m }
    );
  }
};

module.exports = {
  command: 'kiss',
  handler,
};