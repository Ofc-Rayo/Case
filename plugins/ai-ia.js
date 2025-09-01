const https = require('https');

async function handler(conn, { message, args }) {
  const jid = message.key.remoteJid;
  const msgObj = (message.message?.conversation) ||
      (message.message?.extendedTextMessage?.text) ||
      (message.message?.imageMessage?.caption) ||
      (message.message?.videoMessage?.caption) ||
      (message.message?.documentMessage?.caption) ||
      '';
  const query = msgObj.trim();

  if (!query) return;

  const url = `https://gokublack.xyz/ai/bard?text=${encodeURIComponent(query)}`;

  https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => { data += chunk; });
    res.on('end', async () => {
      try {
        const response = JSON.parse(data);
        if (response.status && response.result && response.result.response) {
          await conn.sendMessage(
            jid,
            { text: response.result.response },
            { quoted: message }
          );
        }
      } catch (e) {
        await conn.sendMessage(
          jid,
          { text: 'Ocurrió un error procesando la respuesta de la IA.' },
          { quoted: message }
        );
      }
    });
  }).on('error', async (err) => {
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