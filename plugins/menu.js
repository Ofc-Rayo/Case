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
        '🎀 LOGOS': ['acuarela'],
        '🔧 HERRAMIENTA': ['debugadmin', 'logs', 'update'],
        '🪄 RANDOW': ['waifu', 'aisuki'],
        '🎙 EFECTO NOTA DE VOZ': [],
        '👑 OWNER': ['ds']
    };

    let dynamicMenu = '';
    for (const [titulo, comandos] of Object.entries(categorias)) {
        if (comandos.length > 0) {
            dynamicMenu += `\n${titulo}:\n`;
            for (const cmd of comandos) {
                dynamicMenu += `   ⚡ ${botPrefix}${cmd}\n`;
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
            caption: menuCaption,
            contextInfo: {
                externalAdReply: {
                    title: '⚡ Zenitsu Bot',
                    body: 'Menú de técnicas electrizantes',
                    sourceUrl: 'https://zenitsu.bot/menu',
                    mediaType: 1,
                    renderLargerThumbnail: false // Miniatura desactivada
                }
            }
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
