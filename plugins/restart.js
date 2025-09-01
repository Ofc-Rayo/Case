const handler = async (m, { conn }) => {
    try {
        await m.reply('「🔁」 Reiniciando El Bot....');
        setTimeout(() => {
            process.exit(0);
        }, 3000); 
    } catch (error) {
        console.error(error);
        await m.reply(`Error al reiniciar: ${error}`);
    }
};

module.exports = {
    command: 'restart',
    handler,
};