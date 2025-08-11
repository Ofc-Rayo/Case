const fs = require('fs');
const path = require('path');
const { users, comads } = require('../main.js');

const tags = {
  main: 'ℹ️ INFOBOT',
  jadibot: '✨ SER SUB BOT',
  downloader: '🚀 DESCARGAS',
  game: '👾 JUEGOS',
  gacha: '✨️ NEW - RPG GACHA',
  rg: '🟢 REGISTRO',
  group: '⚙️ GRUPO',
  nable: '🕹 ENABLE/DISABLE',
  nsfw: '🥵 COMANDO +18',
  buscadores: '🔍 BUSCADORES',
  sticker: '🧧 STICKER',
  econ: '🛠 RPG',
  convertidor: '🎈 CONVERTIDORES',
  logo: '🎀 LOGOS',
  tools: '🔧 HERRAMIENTA',
  randow: '🪄 RANDOW',
  efec: '🎙 EFECTO NOTA DE VOZ',
  owner: '👑 OWNER',
};

const sendMessage = async (conn, to, message, options = {}, additionalOptions = {}) => {
  try {
    await conn.sendMessage(to, message, additionalOptions);
  } catch (error) {
    console.error('⚠️ Zenitsu se tropezó al enviar el mensaje:', error);
  }
};

async function handler(conn, { message }) {
  const botPrefix = '.';
  const currentFile = path.basename(__filename);
  const pluginFiles = fs.readdirSync(__dirname)
    .filter(file => file !== currentFile && file.endsWith('.js'));

  const categorias = {};

  for (const file of pluginFiles) {
    try {
      const pluginPath = path.join(__dirname, file);
      const plugin = require(pluginPath);

      const nombre = plugin.command || file.replace('.js', '');
      const tag = plugin.tag || 'misc';
      const categoria = tags[tag] || '📦 Misceláneos';
      const descripcion = plugin.description || '✨ Comando sin descripción aún.';

      if (!categorias[categoria]) categorias[categoria] = [];
      categorias[categoria].push({ nombre, descripcion });
    } catch (err) {
      console.warn(`⚠️ Error al cargar el plugin ${file}:`, err.message);
    }
  }

  let dynamicMenu = '';
  for (const [categoria, comandos] of Object.entries(categorias)) {
    dynamicMenu += `\n╭─🎭 *${categoria}*\n`;
    for (const { nombre, descripcion } of comandos) {
      dynamicMenu += `┃ ⚡ ${botPrefix}${nombre} → ${descripcion}\n`;
    }
    dynamicMenu += `╰────────────────╯\n`;
  }

  const totalPlugins = pluginFiles.length;
  const menuCaption = `
╭─━━━━━━༺💛༻━━━━━━─╮
┃ *🌩️ 𝙕𝙀𝙉𝙄𝙏𝙎𝙐 𝘽𝙊𝙏 - 𝙈𝙀𝙉𝙐* ⚡
┃
┃ 👥 *Usuarios activos:* ${users}
┃ 🧠 *Comandos ejecutados:* ${comads}
┃ 📦 *Plugins disponibles:* ${totalPlugins}
┃ 🌀 *Prefijo actual:* ${botPrefix}
╰─━━━━━━༺⚡༻━━━━━━─╯

*📜 Técnicas que Zenitsu aprendió entre rayos y lágrimas:*
${dynamicMenu}
╰─━━━━━━༺🌙༻━━━━━━─╯
`;

  try {
    const menuMessage = {
      image: { url: 'https://qu.ax/MvYPM.jpg' },
      caption: menuCaption
    };

    await sendMessage(conn, message.key.remoteJid, menuMessage, { quoted: message });
  } catch (err) {
    console.log('😖 Zenitsu se desmayó al enviar el menú:', err.message);
    await sendMessage(conn, message.key.remoteJid, { text: `😭 No pude mostrar el menú... Error: ${err.message}` });
  }
}

module.exports = {
  command: 'menu',
  handler,
};