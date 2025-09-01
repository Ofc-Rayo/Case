const https = require('https');

async function handler(conn, { message, args }) {
  const jid = message.key.remoteJid;

  // Obtener el texto del mensaje recibido
  const msgObj = (message.message?.conversation) ||
      (message.message?.extendedTextMessage?.text) ||
      (message.message?.imageMessage?.caption) ||
      (message.message?.videoMessage?.caption) ||
      (message.message?.documentMessage?.caption) ||
      '';

  const query = msgObj.trim();
  if (!query) {
    console.log('No se detectó texto en el mensaje.');
    return;
  }

  const url = `https://gokublack.xyz/ai/bard?text=${encodeURIComponent(query)}`;
  console.log('Consultando URL:', url);

  https.get(url, (res) => {
    let data = '';

    res.on('data', chunk => {
      data += chunk;
    });

    res.on('end', async () => {
      try {
        console.log('Respuesta completa recibida:', data);
        const response = JSON.parse(data);

        if (response.status && response.result && response.result.response) {
          await conn.sendMessage(
            jid,
            { text: response.result.response },
            { quoted: message }
          );
          console.log('Respuesta enviada al usuario.');
        } else {
          console.error('Respuesta de API inválida:', response);
          await conn.sendMessage(
            jid,
            { text: 'No se obtuvo una respuesta válida de la IA.' },
            { quoted: message }
          );
        }
      } catch (e) {
        console.error('Error al parsear JSON o al enviar mensaje:', e);
        await conn.sendMessage(
          jid,
          { text: 'Ocurrió un error procesando la respuesta de la IA.' },
          { quoted: message }
        );
      }
    });

  }).on('error', async (err) => {
    console.error('Error al hacer la solicitud HTTPS:', err.message);
    await conn.sendMessage(
      jid,
      { text: `Error al conectar con la API: ${err.message}` },
      { quoted: message }
    );
  });
}

module.exports = {
  handler
};