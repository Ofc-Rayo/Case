module.exports = {
  command: 'setprefix',
  handler: async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Ingrese el prefijo que quieres\n\nej: ${usedPrefix + command} #`;

    let escapedPrefix = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    global.prefix = new RegExp('^' + escapedPrefix);

    await m.reply(`*Se actualizó el prefijo:* [ ${text} ]`);
  },
};