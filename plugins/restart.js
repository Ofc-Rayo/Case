const handler = async (m, { conn, usedPrefix, command }) => {
    try {
        m.reply('「🔁」 Reiniciando El Bot....');
        setTimeout(() => {
            process.exit(0);
        }, 3000); 
    } catch (error) {
        console.log(error);
        m.reply(`${error}`);
    }
};

module.exports = {
    command: 'restart',
    handler,
};