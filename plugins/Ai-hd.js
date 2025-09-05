const cp = require('child_process');
const { promisify } = require('util');

const exec = promisify(cp.exec).bind(cp);

module.exports = {
  command: "$",
  customPrefix: /^[$] /, // activa solo si el mensaje comienza con $
  rowner: true, // solo el dueño real puede usar este comando
  help: ["$"],
  tags: ["owner"],
  
  handler: async function (m, { conn, isOwner, command, text }) {
    if (!isOwner) return;

    let result;
    try {
      result = await exec(command.trimStart() + ' ' + text.trimEnd());
    } catch (e) {
      result = e;
    }

    const { stdout, stderr } = result;

    if (stdout?.trim()) {
      await conn.reply(m.chat, stdout, m);
    }

    if (stderr?.trim()) {
      await conn.reply(m.chat, stderr, m);
    }
  }
};