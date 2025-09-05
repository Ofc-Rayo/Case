const cp = require('child_process');
const { promisify } = require('util');
const exec = promisify(cp.exec).bind(cp);

async function handler(m, { conn, isOwner, command, text }) {
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

module.exports = {
  command: '$',
  handler,
};