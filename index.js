const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const readline = require('readline');
const pino = require('pino');
const chalk = require('chalk');
const figlet = require('figlet');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (text) => new Promise((resolve) => rl.question(text, resolve));

async function startBot() {
    console.clear();
    figlet('Simple-Bot', (err, data) => {
        if (err) {
            console.log(chalk.red('Error al generar el banner.'));
            console.log(err);
            return;
        }
        console.log(chalk.yellowBright(data));
        console.log(chalk.magentaBright('\nIniciando...'));
    });

    await new Promise(resolve => setTimeout(resolve, 2000));
    console.clear();

    const { state, saveCreds } = await useMultiFileAuthState('./sessions');
    const { version } = await fetchLatestBaileysVersion();

    let opcion;
    if (!fs.existsSync('./sessions/creds.json')) {
        do {
            const lineM = '━━━━━━━━━━━━━━━━━━━━';
            opcion = await question(`╔${lineM}╗
❘ ${chalk.bgYellow('        MÉTODO DE CONEXIÓN        ')}
❘ ${chalk.bgMagenta('➥')} ${chalk.bold.cyan('1. Conexión por QR')}
❘ ${chalk.bgMagenta('➥')} ${chalk.green.bold('2. Conexión por número')}
╚${lineM}╝\n${chalk.bold.yellow('➥ ')}${chalk.bold.green('➜ ')}`);

            if (!/^[1-2]$/.test(opcion)) {
                console.log(chalk.bold.redBright(`Opción inválida. Solo puedes elegir 1 o 2.`));
            }
        } while (opcion !== '1' && opcion !== '2' || fs.existsSync('./sessions/creds.json'));
    }

    const socket = makeWASocket({
        version,
        auth: state,
        logger: pino({ level: 'silent' }),
    });

    if (opcion === '2') {
        let phoneNumber = await question('Introduce tu número de teléfono (Ej: +595972xxxxx): ');
        phoneNumber = phoneNumber.replace(/\D/g, '');
        const pairingCode = await socket.requestPairingCode(phoneNumber);
        console.log(chalk.cyanBright(`Código de emparejamiento:\n${chalk.bold(pairingCode)}`));
    }

    socket.ev.on('connection.update', (update) => {
        const { connection, qr } = update;

        if (connection === 'open') {
            figlet('Simple-Bot Conectado', (err, data) => {
                if (err) {
                    console.log(chalk.red('Error al mostrar el banner.'));
                    return;
                }
                console.log(chalk.magentaBright(data));
                console.log(chalk.greenBright(`Me conecte al usuario: ${socket.user.id}`));
            });
        }

        if (connection === 'close') {
            console.log(chalk.redBright('\nDesconectado.'));
            console.log(chalk.yellowBright('Intentando reconectar...'));
            startBot();
        }

        if (qr) {
            console.log(chalk.cyanBright('\nEscanea este código QR para conectar:'));
            qrcode.generate(qr, { small: true });
        }
    });

    socket.ev.on('creds.update', saveCreds);

    socket.ev.on('messages.upsert', async (m) => {
        try {
            const main = require('./main.js');
            await main.handleMessage(socket, m.messages[0]);
        } catch (err) {
            console.error(chalk.red('Error procesando el mensaje:'), err.message);
        }
    });

    socket.ev.on('group-participants.update', async (update) => {
        try {
            const main = require('./main.js');
            await main.handleGroupEvents(socket, update);
        } catch (err) {
            console.error(chalk.red('Error procesando evento de grupo:'), err.message);
        }
    });
}

startBot();