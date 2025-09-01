const fs = require('fs');
const path = require('path');

async function handler(conn, { message }) {
  const userName = message.pushName || 'Simple Bot';

  const caption = `
✧ Hola, *${userName}*
✧ Muy pronto el menú estará disponible...
✧ 🌱 El bot sigue en desarrollo.
✧ 👨‍💻 Developed by: *Rayo-ofc*
˖𓍢🌷˚.`;

  try {
    console.log('Enviando mensaje del desarrollador...');
    await conn.sendMessage(message.key.remoteJid, {
      text: caption
    }, { quoted: message });
    console.log('✅ Mensaje enviado correctamente');
  } catch (err) {
    console.error('⚠️ Error al enviar el mensaje de desarrollo:', err.message);
  }
}

module.exports = {
  command: 'menu',
  handler,
  tag: 'main',
  description: 'Muestra un mensaje temporal mientras el menú está en desarrollo'
};