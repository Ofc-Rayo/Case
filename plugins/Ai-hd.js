const cp = require('child_process');
const { promisify } = require('util');
const exec = promisify(cp.exec);

async function handler(m, { conn, isOwner, command, text }) {
  // Solo permitimos que el propietario ejecute comandos
  if (!isOwner) {
    await conn.reply(m.chat, '❌ No tienes permisos para usar este comando.', m);
    return;
  }

  // Comando completo para ejecutar
  const fullCommand = (command + ' ' + text).trim();

  console.log(`Ejecutando comando: ${fullCommand}`);

  let result;
  try {
    result = await exec(fullCommand);
  } catch (e) {
    // Si hay error, lo devolvemos en stderr para el usuario
    result = { stdout: '', stderr: e.message || String(e) };
  }

  const { stdout, stderr } = result;

  if (stdout?.trim()) {
    await conn.reply(m.chat, `✅ Resultado:\n${stdout}`, m);
    console.log('STDOUT:', stdout);
  }

  if (stderr?.trim()) {
    await conn.reply(m.chat, `⚠️ Error:\n${stderr}`, m);
    console.log('STDERR:', stderr);
  }

  // Si no hay salida ni error, enviamos mensaje genérico
  if (!stdout?.trim() && !stderr?.trim()) {
    await conn.reply(m.chat, '⚠️ Comando ejecutado pero no produjo salida.', m);
  }
}

module.exports = {
  command: '$',
  handler,
};