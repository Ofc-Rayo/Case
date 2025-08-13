const fs = require('fs');
const path = require('path');

const tags = {
  main: 'ℹ️ INFORMACIÓN PRINCIPAL',
  ai: '🤖 INTELIGENCIA ARTIFICIAL', 
  downloader: '🚀 DESCARGAS',
  buscadores: '🔍 BUSCADORES',
  nsfw: '🥵 COMANDO +18',
  group: '⚙️ GRUPO',
  img: '🎨 GENERADOR DE IMÁGENES',
  fun: '🎮 DIVERSIÓN',
  owner: '👑 OWNER',
  info: '📊 INFORMACIÓN',
  anime: '🌸 ANIME',
  tools: '🔧 HERRAMIENTAS',
};

const sendMessage = async (conn, to, message, options = {}) => {
  try {
    await conn.sendMessage(to, message, options);
    console.log('✅ Menú enviado correctamente.');
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
  let users = 0;
  let comads = 0;

  try {
    const dbPath = path.join(__dirname, '../database.json');
    if (fs.existsSync(dbPath)) {
      const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      users = Object.keys(db.users || {}).length;
      comads = db.stats?.commands || 0;
    }
  } catch (err) {
    console.log('⚠️ No se pudo cargar estadísticas:', err.message);
  }

  for (const file of pluginFiles) {
    console.log(`🔍 Cargando plugin: ${file}`);
    try {
      const pluginPath = path.join(__dirname, file);
      delete require.cache[require.resolve(pluginPath)];
      const plugin = require(pluginPath);

      if (!plugin || typeof plugin !== 'object') throw new Error('Plugin inválido o vacío');

      const nombre = plugin.command || file.replace('.js', '');
      
      let tag = plugin.tag;
      if (!tag || !tags[tag]) {
        if (file.startsWith('ai-') || file.startsWith('ia-')) tag = 'ai';
        else if (file.startsWith('descargas-')) tag = 'downloader';
        else if (file.startsWith('buscador-')) tag = 'buscadores';
        else if (file.startsWith('nsfw-')) tag = 'nsfw';
        else if (file.startsWith('grupo-') || file.startsWith('grupos-')) tag = 'group';
        else if (file.startsWith('img-')) tag = 'img';
        else if (file.startsWith('fun-')) tag = 'fun';
        else if (file.startsWith('owner-')) tag = 'owner';
        else if (file.startsWith('info-')) tag = 'info';
        else if (file.startsWith('anime-')) tag = 'anime';
        else tag = 'tools';
      }
      
      const categoria = tags[tag] || '🔧 HERRAMIENTAS';

      console.log(`🎭 Invocando técnica: ${nombre} ⚡ Categoría: ${categoria}`);

      if (!categorias[categoria]) categorias[categoria] = [];
      categorias[categoria].push({ nombre });
    } catch (err) {
      console.warn(`⚠️ Error al cargar el plugin ${file}:`, err.message);
    }
  }

  let dynamicMenu = '';
  for (const [categoria, comandos] of Object.entries(categorias)) {
    dynamicMenu += `\n╭─🎭 *${categoria}*\n`;
    for (const { nombre } of comandos) {
      dynamicMenu += `┃ ⚡ ${botPrefix}${nombre} \n`;
    }
    dynamicMenu += `╰────────────────╯\n`;
  }

  // 🕰️ Saludo y hora ajustados a Cuba
  const now = new Date();
  const cubaTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Havana' }));
  const hour = cubaTime.getHours();
  const minutes = cubaTime.getMinutes().toString().padStart(2, '0');
  const horaActual = `${hour}:${minutes}`;

  let saludo = '✨ Buenas noches';
  if (hour >= 5 && hour < 12) saludo = '🌞 Buenos días';
  else if (hour >= 12 && hour < 18) saludo = '🌤️ Buenas tardes';
  else if (hour >= 0 && hour < 5) saludo = '🌙 Buenas madrugadas';

  const userName = message.pushName || 'viajero estelar';

  const totalPlugins = pluginFiles.length;
  const menuCaption = `
╭─━━━━━━༺💛༻━━━━━━─╮
┃ *🌩️ 𝙕𝙀𝙉𝙄𝙏𝙎𝙐 𝘽𝙊𝙏 - 𝙈𝙀𝙉𝙐* ⚡
┃ ${saludo}, *${userName}*
┃ 🕰️ Hora actual: *${horaActual}*
┃ 📦 *Plugins disponibles:* ${totalPlugins}
┃ 🌀 *Prefijo actual:* ${botPrefix}
╰─━━━━━━༺⚡༻━━━━━━─╯

*📜 Técnicas que Zenitsu aprendió entre rayos y lágrimas:*
${dynamicMenu}
╰─━━━━━━༺🌙༻━━━━━━─╯
`;

  try {
    console.log('📤 Enviando menú con imagen...');
    const imageUrls = [
      'https://qu.ax/MvYPM.jpg',
      'https://telegra.ph/file/2e4c8c0b2e06a3b2c6b7e.jpg',
      'https://pomf2.lain.la/f/7c6e8qyr.jpg'
    ];
    
    let imageSent = false;
    for (const imageUrl of imageUrls) {
      try {
        await conn.sendMessage(message.key.remoteJid, {
          image: { url: imageUrl },
          caption: menuCaption
        }, { quoted: message });
        console.log('✅ Menú enviado correctamente con imagen');
        imageSent = true;
        break;
      } catch (imageError) {
        console.log(`⚠️ Fallo con imagen ${imageUrl}:`, imageError.message);
        continue;
      }
    }
    
    if (!imageSent) {
      throw new Error('Todas las imágenes fallaron');
    }
  } catch (err) {
    console.log('⚠️ Zenitsu no pudo enviar la imagen, enviando solo texto...');
    await conn.sendMessage(message.key.remoteJid, {
      text: menuCaption
    }, { quoted: message });
  }
}

module.exports = {
  command: 'menu',
  handler,
  tag: 'main',
  description: 'Muestra el menú principal del bot'
};