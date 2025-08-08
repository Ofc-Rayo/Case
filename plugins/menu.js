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

    const currentFile = path.basename(__filename);
    const fs = require('fs');
    const files = fs.readdirSync(__dirname)
        .filter(file => file !== currentFile && file.endsWith('.js'))
        .map(file => file.replace('.js', ''));

    const totalPlugins = files.length;
    let dynamicMenu = '';
    for (const file of files) {
        dynamicMenu += `   ⚡ ${botPrefix}${file}\n`;
    }

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