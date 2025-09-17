const { default: makeWASocket, useSingleFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const P = require('pino');
const { Boom } = require('@hapi/boom');
const fs = require('fs');

const { handleMessage, handleGroupEvents } = require('./handler');

const authFile = './auth_info.json';
const { state, saveState } = useSingleFileAuthState(authFile);

const startBot = () => {
  const conn = makeWASocket({
    logger: P({ level: 'silent' }),
    printQRInTerminal: true,
    auth: state,
    browser: ['Simple-Bot', 'Chrome', '1.0.0'],
  });

  conn.public = true;

  conn.ev.on('messages.upsert', async (msg) => {
    const m = msg.messages[0];
    if (!m || m.key.fromMe) return;
    try {
      await handleMessage(conn, m);
    } catch (err) {
      console.error('❌ Error al manejar mensaje:', err);
    }
  });

  conn.ev.on('group-participants.update', async (update) => {
    try {
      await handleGroupEvents(conn, update);
    } catch (err) {
      console.error('❌ Error en evento de grupo:', err);
    }
  });

  conn.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error instanceof Boom)
        ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
        : true;

      console.log('❌ Conexión cerrada. Reconectando...', shouldReconnect);

      if (shouldReconnect) {
        startBot();
      } else {
        console.log('🛑 Sesión cerrada. Escanea el código QR nuevamente.');
      }
    }

    if (connection === 'open') {
      console.log('✅ Bot conectado exitosamente ✅');
    }
  });

  conn.ev.on('creds.update', saveState);
};

startBot();