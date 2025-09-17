async function before(m, { groupMetadata, prefix, db, conn, owner, plugins }) {
  if (!m.text || !prefix.test(m.text)) return;

  const usedPrefix = prefix.exec(m.text)[0];
  const command = m.text.slice(usedPrefix.length).trim().split(' ')[0].toLowerCase();

  const validCommand = (command, plugins) => {
    for (let plugin of Object.values(plugins)) {
      const cmds = Array.isArray(plugin.command) ? plugin.command : [plugin.command];
      if (cmds.includes(command)) return true;
    }
    return false;
  };

  const chat = db.data.chats[m.chat];
  const id = conn.user.jid;
  const settings = db.data.settings[id];
  const isOwner = owner
    .map(([number]) => number.replace(/[^0-9]/g, "") + "@s.whatsapp.net")
    .includes(m.sender);

  if (chat.adminonly) return;
  if (settings.self) return;
  if (!command) return;
  if (command === 'mute') return;
  if (chat.bannedGrupo && !isOwner) return;

  if (validCommand(command, plugins)) {
    return;
  } else {
    await m.reply(`🕸 El comando *${command}* no existe.\n> Usa *${usedPrefix}help* para ver la lista de comandos disponibles.`);
  }
}

module.exports = {
  before
};