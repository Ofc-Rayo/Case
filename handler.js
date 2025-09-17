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
    console.error('💥 fallé al guardar los datos! Pero lo intentaré otra vez', err);
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

const welcomeStatus = {};

function setWelcomeStatus(groupId, status) {
  welcomeStatus[groupId] = status;
}

function getWelcomeStatus(groupId) {
  return welcomeStatus[groupId] || 'on';
}

const nsfwStatus = {};

function setNsfwStatus(groupId, status) {
  nsfwStatus[groupId] = status;
}

function getNsfwStatus(groupId) {
  return nsfwStatus[groupId] || 'off';
}

const createDecoratedBox = (text) => {
  const top = '╔══⚡══╗';
  const bottom = '╚══⚡══╝';
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
    await sendText(conn, to, 'No sé qué es eso no puedo enviarlo');
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
  user = 'Eres un humano aterrador masivo',
  groupName = '',
  groupLink = ''
) {
  const now = new Date().toLocaleString('es-Py', {
    timeZone: 'America/Asuncion',
  });

  const isGroup = m.key.remoteJid.endsWith('@g.us');
  const id = m.key.remoteJid;

  const usedBy = isGroup
    ? `${chalk.greenBright(groupName)} ${chalk.gray(`[${id}]`)}`
    : chalk.magentaBright(user);

  console.log(`${chalk.green('╭────═[ Simple-Bot ⚡ ]═─────⋆')}
${chalk.green('│╭───────────────···')}
${chalk.green('││')}👤 ${chalk.cyan('Usuario/Grupo:')} ${usedBy}
${chalk.green('││')}⏱️ ${chalk.cyan('Hora:')} ${chalk.black(chalk.bgGreen(now))}
${chalk.green('││')}📑 ${chalk.cyan('Evento:')} ${chalk.magenta(type)}
${chalk.green('││')}🔓 ${chalk.cyan('Modo:')} ${chalk.yellowBright(conn.public ? 'Público ⚡' : 'Privado ✨')}
${isGroup ? `${chalk.green('││')}🔗 ${chalk.cyan('Link:')} ${chalk.blueBright(groupLink)}` : ''}
${chalk.green('│╰────────────────···')}
${chalk.green('╰────────────═┅═────────────')}`);
}

async function handleMessage(conn, message) {
  const { message: msgContent, key } = message;
  const from = key.remoteJid;
  const isGroup = from.endsWith('@g.us');
  const sender = key.participant || from;

  const normalizedSender = sender.replace(/@lid$/, '@s.whatsapp.net');
  const altNormalizedSender = sender.replace(/@s\.whatsapp\.net$/, '@lid');

  let groupName = '', groupLink = '';

  if (isGroup) {
    try {
      const metadata = await conn.groupMetadata(from);
      groupName = metadata.subject;
      const inviteCode = await conn.groupInviteCode(from);
      groupLink = `https://chat.whatsapp.com/${inviteCode}`;
    } catch {
      groupLink = 'No pude conseguir el link lo siento mucho.';
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
      if (plugins[commandName].nsfw && !getNsfwStatus(from)) {
        await sendText(conn, from, '🚫 Este comando está desactivado para este grupo');
        return;
      }

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
        console.error(chalk.red(`hubo un error con el comando ${commandName}`), err);
      }
    }
  }
}

async function handleGroupEvents(conn, update) {
  const { id, participants, action } = update;
  for (const participant of participants) {
    const welcomeStat = getWelcomeStatus(id);

    if (welcomeStat === 'on') {
      const metadata = await conn.groupMetadata(id);
      const groupName = metadata.subject;
      const username = participant.split('@')[0];
      const memberCount = metadata.participants.length;

      const ppUrl = await conn.profilePictureUrl(participant, 'image').catch(
        () => 'https://cdn.discordapp.com/embed/avatars/0.png'
      );

      if (action === 'add') {
        const welcomeCardUrl = `https://api.popcat.xyz/v2/welcomecard?background=https://cdn.popcat.xyz/welcome-bg.png&text1=${encodeURIComponent(
          username
        )}&text2=Bienvenid@+a+${encodeURIComponent(
          groupName
        )}&text3=Miembro+${memberCount}&avatar=${encodeURIComponent(ppUrl)}`;

        const caption = `Bievenido @${username}, al grupo *${groupName}* recuerda respetar las reglas`;

        await conn.sendMessage(id, {
          image: { url: welcomeCardUrl },
          caption,
          mentions: [participant],
        });

        incrementGrups();
      } else if (action === 'remove') {
        const goodbyeCardUrl = `https://api.popcat.xyz/v2/welcomecard?background=https://cdn.popcat.xyz/welcome-bg.png&text1=${encodeURIComponent(
          username
        )}&text2=Adiós+de+${encodeURIComponent(
          groupName
        )}&text3=Adios+humano+cuidate&avatar=${encodeURIComponent(ppUrl)}`;

        const caption = `Adios @${username} se salió del *${groupName}* \nCuídate mucho 💖`;

        await conn.sendMessage(id, {
          image: { url: goodbyeCardUrl },
          caption,
          mentions: [participant],
        });
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
  setWelcomeStatus,
  getWelcomeStatus,
  setNsfwStatus,
  getNsfwStatus,
};