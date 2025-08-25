const fs = require('fs');
const { prefix } = require('./settings.js');
const path = './database.json';
const chalk = require('chalk');
const pathPlugins = './plugins';

let plugins = {};

const readDB = () => {
  try {
    const data = fs.readFileSync(path, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return { groups: {}, comads: 0, users: 0 };
  }
};

const writeDB = (data) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(
      '¡Ay no! ¡Algo terrible pasó al guardar los datos! ¡Tengo miedo!:',
      err
    );
  }
};

const incrementComms = () => {
  const db = readDB();
  db.comads += 1;
  writeDB(db);
};

const incrementGrups = () => {
  const db = readDB();
  db.users += 1;
  writeDB(db);
};

const incrementUsers = () => {
  const db = readDB();
  db.users += 1;
  writeDB(db);
};

const getWelcomeStatus = (groupId) => {
  const db = readDB();
  return db.groups[groupId]?.welcomeStatus || 'off';
};

const setWelcomeStatus = (groupId, status) => {
  const db = readDB();
  if (!db.groups[groupId]) db.groups[groupId] = {};
  db.groups[groupId].welcomeStatus = status;
  writeDB(db);
};

// ┏━╸┏━┓╻  ┏━╸┏━┓┏━╸┏┓┏━╸┏━┓
// ┗━┓┣━┫┃  ┣╸ ┃ ┃┣╸ ┃┃┃╺┓┃ ┃
// ┗━┛╹ ╹┗━╸┗━╸┗━┛┗━╸╹╹┗━┛┗━┛

const createDecoratedBox = (text) => {
  const top = '╔═ೋ❀❀═══╗';
  const bottom = '╚═ೋ❀❀═══╝';
  const lines = text.split('\n');
  const maxLen = Math.max(...lines.map((line) => line.length));

  const decoratedLines = lines
    .map((line) => {
      const padding = ' '.repeat(maxLen - line.length);
      return `║ ${line}${padding} ║`;
    })
    .join('\n');

  return `${top}\n${decoratedLines}\n${bottom}`;
};

const sendText = async (conn, to, text) => {
  const decoratedText = createDecoratedBox(text);
  await conn.sendMessage(to, { text: decoratedText });
};

const sendImage = async (conn, to, image, caption = '') => {
  const decoratedCaption = caption ? createDecoratedBox(caption) : '';
  await conn.sendMessage(to, { image, caption: decoratedCaption });
};

const sendSticker = async (conn, to, sticker) => {
  await conn.sendMessage(to, { sticker });
};

const sendAudio = async (conn, to, audio, ptt = false) => {
  await conn.sendMessage(to, { audio, ptt });
};

const sendVideo = async (conn, to, video, caption = '') => {
  const decoratedCaption = caption ? createDecoratedBox(caption) : '';
  await conn.sendMessage(to, { video, caption: decoratedCaption });
};

const sendMedia = async (conn, to, media, caption = '', type = 'image') => {
  if (type === 'image') {
    await sendImage(conn, to, media, caption);
  } else if (type === 'sticker') {
    await sendSticker(conn, to, media);
  } else if (type === 'audio') {
    await sendAudio(conn, to, media);
  } else if (type === 'video') {
    await sendVideo(conn, to, media, caption);
  } else {
    await sendText(conn, to, '¡Kyaa! ¡No sé cómo enviar eso! ¡Qué miedo!');
  }
};

const loadPlugins = () => {
  plugins = {};
  fs.readdirSync(pathPlugins).forEach((file) => {
    if (file.endsWith('.js')) {
      try {
        delete require.cache[require.resolve(`${pathPlugins}/${file}`)];
        const command = require(`${pathPlugins}/${file}`);
        plugins[command.command] = command;
      } catch (err) {}
    }
  });
};

fs.watch(pathPlugins, { recursive: true }, (eventType, filename) => {
  if (eventType === 'change' || eventType === 'rename') {
    loadPlugins();
  }
});

loadPlugins();

async function logEvent(
  conn,
  m,
  type,
  user = 'Un pobre chico asustado',
  groupName = '',
  groupLink = ''
) {
  console.log(
    chalk.bold.red(
      '━━━━━━━━━━ Zenitsu Bot: ¡Ay no, otro evento! ━━━━━━━━━━'
    ) +
      '\n' +
      chalk.blue('│⏰ Hora del miedo: ') +
      chalk.green(
        new Date().toLocaleString('es-ES', {
          timeZone: 'America/Argentina/Buenos_Aires',
        })
      ) +
      '\n' +
      chalk.yellow('️│🏷️ Modo (¡qué nervios!): ') +
      chalk.magenta([`${conn.public ? 'Público' : 'Privado'}`]) +
      '\n' +
      chalk.cyan('│📑 Tipo de... ¡Algo está pasando!: ') +
      chalk.white(type) +
      (m.key.remoteJid.endsWith('@g.us')
        ? `\n${chalk.bgGreen(
            '│🌸 Grupo (¡espero que no haya demonios!):'
          )} ${chalk.greenBright(groupName)} ➜ ${chalk.green(
            m.key.remoteJid
          )}` +
          `\n${chalk.bgBlue(
            '│🔗 Enlace del grupo (¡podría ser una trampa!):'
          )} ${chalk.blueBright(groupLink)}`
        : `\n${chalk.bgMagenta('│💌 Un mensaje de:')} ${chalk.magentaBright(
            user
          )}`)
  );
}

async function handleMessage(conn, message) {
  const { message: msgContent, key } = message;
  const from = key.remoteJid;
  const isGroup = from.endsWith('@g.us');
  const sender = key.participant || from;

  const normalizedSender = sender.replace(/@lid$/, '@s.whatsapp.net');
  const altNormalizedSender = sender.replace(
    /@s\.whatsapp\.net$/,
    '@lid'
  );

  let groupName = '',
    groupLink = '';

  if (isGroup) {
    try {
      const metadata = await conn.groupMetadata(from);
      groupName = metadata.subject;
      const inviteCode = await conn.groupInviteCode(from);
      groupLink = `https://chat.whatsapp.com/${inviteCode}`;
    } catch {
      groupLink =
        '¡Me temblaron las manos y no pude conseguir el enlace! ¡Lo siento mucho!';
    }
  }

  const body =
    msgContent?.conversation ||
    msgContent?.extendedTextMessage?.text ||
    msgContent?.imageMessage?.caption ||
    msgContent?.videoMessage?.caption ||
    null;

  if (body && body.startsWith(prefix[0])) {
    const args = body.slice(prefix[0].length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (plugins[commandName]) {
      try {
        await plugins[commandName].handler(conn, {
          conn,
          message,
          args,
          sender,
          normalizedSender,
          altNormalizedSender,
          isGroup,
          groupId: from,
          groupName,
          groupLink,
        });

        await logEvent(
          conn,
          message,
          `Comando: ${commandName}`,
          sender,
          groupName,
          groupLink
        );
        incrementComms();
      } catch (err) {
        console.error(
          chalk.red(`💥 ¡Error al ejecutar el comando ${commandName}!`),
          err
        );
      }
    }
  }
}

async function handleGroupEvents(conn, update) {
  const { id, participants, action } = update;
  for (const participant of participants) {
    if (action === 'add') {
      const welcomeStatus = getWelcomeStatus(id);
      if (welcomeStatus === 'on') {
        const metadata = await conn.groupMetadata(id);
        const groupName = metadata.subject;

        const username = participant.split('@')[0];
        const memberCount = metadata.participants.length;

        // Avatar del usuario
        const ppUrl = await conn.profilePictureUrl(participant, 'image').catch(
          () =>
            'https://cdn.discordapp.com/embed/avatars/0.png'
        );

        // URL de la tarjeta de bienvenida Popcat
        const welcomeCardUrl = `https://api.popcat.xyz/v2/welcomecard?background=https://cdn.popcat.xyz/welcome-bg.png&text1=${encodeURIComponent(
          username
        )}&text2=Bienvenido+a+${encodeURIComponent(
          groupName
        )}&text3=Miembro+${memberCount}&avatar=${encodeURIComponent(ppUrl)}`;

        const caption = `¡Kyaa! 🌸 Bienvenido @${username} a *${groupName}* 🎉\nPor favor, no me asustes mucho...`;

        await conn.sendMessage(id, {
          image: { url: welcomeCardUrl },
          caption,
          mentions: [participant],
        });

        incrementGrups();
      }
    }
  }
}

module.exports = {
  handleMessage,
  handleGroupEvents,
  sendMedia,
  incrementComms,
  incrementGrups,
  incrementUsers,
  getWelcomeStatus,
  setWelcomeStatus,
};