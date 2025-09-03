async function handler(m, { conn, text, command }) {
  if (!text) throw `No se encontró ningún prefijo, por favor escribe un prefijo.\n> Ejemplo: ${command} !`;
  
  global.prefix = new RegExp(
    '^[' +
      (text || global.opts['prefix'] || '‎xzXZ/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-').replace(
        /[|\\{}()[\]^$+*?.\-\^]/g,
        '\\$&'
      ) +
      ']'
  );
  
  // await m.reply(`✅ Prefijo actualizado con éxito, prefijo actual: ${text}`);
  conn.fakeReply(m.chat, `✅ Prefijo actualizado con éxito, prefijo actual: ${text}`, '0@s.whatsapp.net', '✨ PREFIJO NUEVO ✨');
}

module.exports = {
  command: 'prefix',
  handler,
  rowner: true
};