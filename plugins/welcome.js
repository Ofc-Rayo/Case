const thumbnailUrl = 'https://qu.ax/MvYPM.jpg' // Miniatura evocadora estilo Zenitsu

const contextInfo = {
  externalAdReply: {
    title: '👋 Bienvenida Ritual',
    body: 'Zenitsu está temblando... ¡pero activando el aura grupal!',
    mediaType: 1,
    previewType: 0,
    mediaUrl: 'https://zenitsu.bot',
    sourceUrl: 'https://zenitsu.bot',
    thumbnailUrl
  }
}

module.exports = {
  command: 'welcome',
  handler: async (conn, { message, args }) => {
    const { key, participant, remoteJid } = message.key;
    const from = remoteJid;
    const isGroup = from.endsWith('@g.us');

    if (!isGroup) {
      await conn.sendMessage(from, {
        text: '😰 ¡Este comando solo funciona en grupos!\n\n> Zenitsu se sonroja... no sabe cómo dar la bienvenida en privado 💦',
        contextInfo
      }, { quoted: message });
      return;
    }

    if (args.length === 0 || !['on', 'off'].includes(args[0].toLowerCase())) {
      await conn.sendMessage(from, {
        text: '📥 *Uso correcto del ritual:*\n\n> `welcome on` para activar 🌸\n> `welcome off` para desactivar 🌙\n\nZenitsu necesita instrucciones claras... ¡se pone nervioso! 😳',
        contextInfo
      }, { quoted: message });
      return;
    }

    const status = args[0].toLowerCase();

    try {
      const groupMetadata = await conn.groupMetadata(from);
      const admins = groupMetadata.participants.filter((p) => p.admin).map((p) => p.id);
      const isAdmin = admins.includes(participant) || participant === conn.user.id;

      if (!isAdmin) {
        await conn.sendMessage(from, {
          text: '😤 *Solo los administradores pueden invocar este ritual.*\n\n> Zenitsu no quiere meterse en problemas... ¡tiembla de miedo! 🫣',
          contextInfo
        }, { quoted: message });
        return;
      }

      const { setWelcomeStatus } = require('../main');
      setWelcomeStatus(from, status);

      const aura = status === 'on' ? '✨ Activado en este grupo' : '🌑 Desactivado en este grupo';
      const response = `
╭「 👋 𝙍𝙄𝙏𝙐𝘼𝙇 𝘿𝙀 𝘽𝙄𝙀𝙉𝙑𝙀𝙉𝙄𝘿𝘼 」╮
│ Estado: ${aura}
│ Grupo: ${groupMetadata.subject}
╰──────────────────────╯

Zenitsu está exhausto... ¡pero lo logró! ⚡
`.trim();

      await conn.sendMessage(from, {
        text: response,
        contextInfo
      }, { quoted: message });

    } catch (err) {
      await conn.sendMessage(from, {
        text: `❌ ¡Algo salió mal!\n\n> Zenitsu se tropezó intentando cambiar el estado de bienvenida...\n🛠️ ${err.message}`,
        contextInfo
      }, { quoted: message });
    }
  }
};