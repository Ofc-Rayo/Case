const path = require('path');
const { users, comads } = require('../main.js');

const sendMessage = async (conn, to, message, options = {}, additionalOptions = {}) => {
    try {
        await conn.sendMessage(to, message, additionalOptions);
    } catch (error) {
        console.error('⚠️ Zenitsu se tropezó al enviar el mensaje:', error);
    }
};

async function handler(conn, { message }) {
    const botPrefix = '.';

    const comandosConDescripcion = {
        ia: '🧠 Invoca la inteligencia artificial para conversar o crear.',
        anime: '🎌 Busca información o imágenes de tus animes favoritos.',
        ds: '📊 Muestra estadísticas internas del bot.',
        guar: '🛡️ Activa el modo guardián o sub bot.',
        play: '🎶 Descarga música desde YouTube.',
        play2: '🎧 Alternativa para descargar música.',
        get: '📥 Descarga archivos desde enlaces directos.',
        tiktok: '🎵 Descarga videos de TikTok sin marca de agua.',
        trm: '🎮 Juego de adivinanza con palabras ocultas.',
        welcome: '👋 Configura mensajes de bienvenida en grupos.',
        kick: '🥾 Expulsa a un usuario del grupo.',
        promote: '🔺 Asciende a alguien como administrador.',
        demote: '🔻 Revoca permisos de administrador.',
        debugadmin: '🛠️ Activa o desactiva funciones de depuración.',
        update: '🔄 Actualiza el bot o sus módulos.',
        logs: '📜 Muestra registros recientes del sistema.',
        nsfw: '🔥 Comandos para contenido +18 (solo admins).',
        p: '💋 Accede a imágenes subidas de tono.',
        google: '🔍 Realiza búsquedas en Google.',
        bingsearch: '🧭 Explora resultados con Bing.',
        playstore: '📱 Busca apps en Play Store.',
        clima: '🌦️ Consulta el clima actual en tu ciudad.',
        pinterest: '🖼️ Busca imágenes inspiradoras en Pinterest.',
        tenor: '🎭 Encuentra GIFs animados para cualquier emoción.',
        cosplay: '🧝‍♀️ Imágenes de cosplay artístico.',
        rm: '🌀 Convierte stickers en imágenes o viceversa.',
        acuarela: '🎨 Genera logos con estilo de acuarela.',
        waifu: '💖 Invoca una waifu aleatoria.',
        aisuki: '🌸 Frases románticas generadas por IA.'
    };

    const categorias = {
        'ℹ️ INFOBOT': ['ia', 'anime', 'ds'],
        '✨ SER SUB BOT': ['guar'],
        '🚀 DESCARGAS': ['play', 'play2', 'get', 'tiktok'],
        '👾 JUEGOS': ['trm'],
        '✨️ NEW - RPG GACHA': ['guar'],
        '🟢 REGISTRO': ['welcome'],
        '⚙️ GRUPO': ['kick', 'promote', 'demote'],
        '🕹 ENABLE/DISABLE': ['debugadmin', 'update', 'logs'],
        '🥵 COMANDO +18': ['nsfw', 'p'],
        '🔍 BUSCADORES': ['google', 'bingsearch', 'playstore', 'clima'],
        '🧧 STICKER': ['pinterest', 'tenor', 'cosplay'],
        '🛠 RPG': ['guar'],
        '🎈 CONVERTIDORES': ['rm'],
        '🔧 HERRAMIENTA': ['debugadmin', 'logs', 'update'],
        '🪄 RANDOM': ['waifu', 'aisuki'],
        '👑 OWNER': ['ds']
    };

    let dynamicMenu = '';
    for (const [titulo, comandos] of Object.entries(categorias)) {
        if (comandos.length > 0) {
            dynamicMenu += `\n${titulo}:\n`;
            for (const cmd of comandos) {
                const desc = comandosConDescripcion[cmd] || '✨ Comando sin descripción aún.';
                dynamicMenu += `   ⚡ ${botPrefix}${cmd} → ${desc}\n`;
            }
        }
    }

    const totalPlugins = Object.values(categorias).reduce((acc, cmds) => acc + cmds.length, 0);

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
${dynamicMenu}╰─━━━━━━༺🌙༻━━━━━━─╯
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
