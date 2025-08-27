const miniatura = 'https://qu.ax/MvYPM.jpg'; 

module.exports = {
  command: 'welcome',
  handler: async (conn, { message, args }) => {
    const { key, participant, remoteJid } = message.key;
    const from = remoteJid;
    const isGroup = from.endsWith('@g.us');

    if (!isGroup) {
      await conn.sendMessage(from, {
        image: { url: miniatura },
        caption: `*😰 ¡Este comando solo funciona en grupos!*\n\n> Zenitsu se sonroja... no sabe cómo dar la bienvenida en privado 💦`,
        quoted: message
      });
      return;
    }

    if (args.length === 0 || !['on', 'off'].includes(args[0].toLowerCase())) {
      await conn.sendMessage(from, {
        image: { url: miniatura },
        caption: `*📥 Uso correcto del ritual:*\n\n> \`welcome on\` para activar 🌸\n> \`welcome off\` para desactivar 🌙\n\nZenitsu necesita instrucciones claras... ¡se pone nervioso! 😳`,
        quoted: message
      });
      return;
    }

    const status = args[0].toLowerCase();

    try {
      const groupMetadata = await conn.groupMetadata(from);
      const admins = groupMetadata.participants.filter((p) => p.admin).map((p) => p.id);
      const isAdmin = admins.includes(participant) || participant === conn.user.id;

      if (!isAdmin) {
        await conn.sendMessage(from, {
          image: { url: miniatura },
          caption: `*😤 Solo los administradores pueden invocar este ritual.*\n\n> Zenitsu no quiere meterse en problemas... ¡tiembla de miedo! 🫣`,
          quoted: message
        });
        return;
      }

      const { setWelcomeStatus } = require('../main'); // Ajusta la ruta si es necesario
      setWelcomeStatus(from, status);

      const aura = status === 'on' ? '✨ Activado en este grupo' : '🌑 Desactivado en este grupo';
      const response = `
╭─「 👋 𝙍𝙄𝙏𝙐𝘼𝙇 𝘿𝙀 𝘽𝙄𝙀𝙉𝙑𝙀𝙉𝙄𝘿𝘼 」─╮
│ Estado: ${aura}
│ Grupo: ${groupMetadata.subject}
╰────────────────────────────╯
`.trim();

      await conn.sendMessage(from, {
        image: { url: miniatura },
        caption: response,
        quoted: message
      });
    } catch (err) {
      await conn.sendMessage(from, {
        image: { url: miniatura },
        caption: `*❌ ¡Algo salió mal!*\n\n> Zenitsu se tropezó intentando cambiar el estado de bienvenida... ¡ayúdalo con cariño! 😢`,
        quoted: message
      });
      console.error('Error en el comando welcome:', err.message);
    }
  }
};