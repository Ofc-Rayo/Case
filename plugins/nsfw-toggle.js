
const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'

const contextInfo = {
  externalAdReply: {
    title: '🔞 Control NSFW',
    body: 'Zenitsu está sonrojado... pero configurando el modo adulto',
    mediaType: 1,
    previewType: 0,
    mediaUrl: 'https://zenitsu.bot',
    sourceUrl: 'https://zenitsu.bot',
    thumbnailUrl
  }
}

module.exports = {
  command: 'nsfw',
  handler: async (conn, { message, args }) => {
    const { key, participant, remoteJid } = message.key;
    const from = remoteJid;
    const isGroup = from.endsWith('@g.us');

    if (!isGroup) {
      await conn.sendMessage(from, {
        text: '😳 ¡Este comando solo funciona en grupos!\n\n> Zenitsu se sonroja... no puede activar el modo adulto en privado 💦',
        contextInfo
      }, { quoted: message });
      return;
    }

    if (args.length === 0 || !['on', 'off'].includes(args[0].toLowerCase())) {
      await conn.sendMessage(from, {
        text: '🔞 *Uso correcto del control NSFW:*\n\n> `nsfw on` para activar 🔥\n> `nsfw off` para desactivar ❄️\n\nZenitsu necesita instrucciones claras... ¡se pone muy nervioso con estos temas! 😳',
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
          text: '😤 *Solo los administradores pueden controlar el contenido adulto.*\n\n> Zenitsu no quiere meterse en problemas... ¡tiembla de miedo! 🫣',
          contextInfo
        }, { quoted: message });
        return;
      }

      const { setNsfwStatus } = require('../main');
      setNsfwStatus(from, status);

      const mode = status === 'on' ? '🔥 Activado en este grupo' : '❄️ Desactivado en este grupo';
      const response = `
╭「 🔞 𝘾𝙊𝙉𝙏𝙍𝙊𝙇 𝙉𝙎𝙁𝙒 」╮
│ Estado: ${mode}
│ Grupo: ${groupMetadata.subject}
╰──────────────────────╯

Zenitsu está completamente rojo... ¡pero lo configuró! ⚡
`.trim();

      await conn.sendMessage(from, {
        text: response,
        contextInfo
      }, { quoted: message });

    } catch (err) {
      await conn.sendMessage(from, {
        text: `❌ ¡Algo salió mal!\n\n> Zenitsu se tropezó intentando cambiar el modo NSFW...\n🛠️ ${err.message}`,
        contextInfo
      }, { quoted: message });
    }
  }
};
