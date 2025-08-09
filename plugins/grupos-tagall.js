async function handler(conn, { message }) {
  const from = message.key.remoteJid;
  const isGroup = from.endsWith('@g.us');
  const sender = message.key.participant || from;

  if (!isGroup) {
    return conn.sendMessage(from, {
      text: '🌌 Este ritual solo puede invocarse en grupos.'
    });
  }

  const groupMetadata = await conn.groupMetadata(from);
  const participants = groupMetadata.participants;

  // DEBUG: mira la estructura real de cada participante
  console.log('🔍 PARTICIPANTS RAW:', JSON.stringify(participants, null, 2));

  // Normalizador universal de JIDs
  const getNumber = jid => jid.replace(/^lid:/, '').split('@')[0];

  // Extraer solo admins (incluye superadmins)
  const adminsRaw = participants
    .filter(p => p.isAdmin === true || p.isSuperAdmin === true)
    .map(p => p.jid);

  const adminsBase = adminsRaw.map(getNumber);
  const senderBase = getNumber(sender);
  const botBase = getNumber(conn.user.jid || conn.user.id);

  const isSenderAdmin = adminsBase.includes(senderBase);
  const isBotAdmin     = adminsBase.includes(botBase);

  if (!isSenderAdmin) {
    return conn.sendMessage(from, {
      text: '🧿 Este ritual sólo lo pueden invocar los guardianes del grupo (admins).'
    });
  }

  // Construir menciones
  const mentions = participants.map(p => p.jid);
  const nombres  = mentions.map(j => `@${getNumber(j)}`).join('\n');

  const ceremonialMessage = `
╭─「 🔔 𝙍𝙄𝙏𝙐𝘼𝙇 𝘿𝙀 𝙇𝘼 𝙇𝙇𝘼𝙈𝘼𝘿𝘼 」─╮
│ 🧭 Invocado por: @${senderBase}
│ 👥 Miembros convocados:
│ 
${nombres}
│ 
│ 🌌 Que todos escuchen el llamado...
╰────────────────────────────╯
  `.trim();

  // Enviar con o sin mentions
  await conn.sendMessage(from, {
    text: ceremonialMessage,
    ...(isBotAdmin ? { mentions } : {})
  }, { quoted: message });

  if (!isBotAdmin) {
    await conn.sendMessage(from, {
      text: '⚠️ El ritual fue invocado, pero el bot no posee poder total (no es admin).'
    });
  }

  // Logs finales
  console.log('🔍 Sender Base ID:', senderBase);
  console.log('🔍 Bot   Base ID:', botBase);
  console.log('🔍 Admins Base:', adminsBase);
}

module.exports = {
  command: 'tagall',
  handler,
};