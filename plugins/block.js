async function handler(conn, { message }) {
  const jid = message.key.remoteJid;

  try {
    await conn.updateBlockStatus(jid, "block");
    await conn.sendMessage(jid, { text: `Usuario *bloqueado* con éxito.` });
  } catch (err) {
    console.error("Error al bloquear:", err.message);
    await conn.sendMessage(jid, { text: `No se pudo bloquear al usuario.` });
  }
}

module.exports = {
  command: "block",
  handler
};