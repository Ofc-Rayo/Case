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
    figlet('ZenitsuBot', (err, data) => {
        if (err) {
            console.log(chalk.red('⚠️ Zenitsu se tropezó generando el banner...'));
            console.log(err);
            return;
        }
        console.log(chalk.yellowBright(data));
        console.log(chalk.magentaBright('\n😳 Zenitsu está preparando todo... ¡No lo presiones!'));
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
❘ ${chalk.bgYellow('        𝗠𝗘𝗧𝗢𝗗𝗢 𝗗𝗘 𝗖𝗢𝗡𝗘𝗫𝗜𝗢𝗡        ')}
❘ ${chalk.bgMagenta('➥')} ${chalk.bold.cyan('1. Conexión por QR (Zenitsu tiembla...)')}
❘ ${chalk.bgMagenta('➥')} ${chalk.green.bold('2. Conexión por número (¡Más miedo aún!)')}
╚${lineM}╝\n${chalk.bold.yellow('➥ ')}${chalk.bold.green('➜ ')}`);

            if (!/^[1-2]$/.test(opcion)) {
                console.log(chalk.bold.redBright(`❌ ¡Opción inválida!\nSolo puedes elegir ${chalk.bold.greenBright("1")} o ${chalk.bold.greenBright("2")}.\nZenitsu se confunde con letras o símbolos... 😵`));
            }
        } while (opcion !== '1' && opcion !== '2' || fs.existsSync('./sessions/creds.json'));
    }

    const socket = makeWASocket({
        version,
        auth: state,
        logger: pino({ level: 'silent' }),
    });

    if (opcion === '2') {
        let phoneNumber = await question('📱 Introduce tu número de teléfono (Ej: +123456789): ');
        phoneNumber = phoneNumber.replace(/\D/g, '');
        const pairingCode = await socket.requestPairingCode(phoneNumber);
        console.log(chalk.cyanBright(`📲 Código de emparejamiento generado:\n${chalk.bold(pairingCode)}\n\n😳 Zenitsu lo consiguió... ¡aunque casi se desmaya!`));
    }

    socket.ev.on('connection.update', (update) => {
        const { connection, qr } = update;

        if (connection === 'open') {
            figlet('Zenitsu\nBOT', (err, data) => {
                if (err) {
                    console.log(chalk.red('⚠️ Zenitsu se tropezó mostrando el banner...'));
                    return;
                }
                console.log(chalk.magentaBright(data));
                console.log(chalk.greenBright(`✅ ¡Zenitsu está conectado como ${socket.user.id}!`));
                console.log(chalk.gray('😳 Aunque sigue temblando...'));
            });
        }

        if (connection === 'close') {
            console.log(chalk.redBright('\n❌ Zenitsu se desconectó...'));
            console.log(chalk.yellowBright('🔄 Intentando reconectar... ¡No lo abandones! 😢'));
            startBot();
        }

        if (qr) {
            console.log(chalk.cyanBright('\n📷 Escanea este código QR para conectar:'));
            qrcode.generate(qr, { small: true });
        }
    });

    socket.ev.on('creds.update', saveCreds);

    socket.ev.on('messages.upsert', async (m) => {
        try {
            const main = require('./main.js');
            await main.handleMessage(socket, m.messages[0]);
        } catch (err) {
            console.error(chalk.red('💥 Error procesando el mensaje:'), err.message);
        }
    });

    socket.ev.on('group-participants.update', async (update) => {
        try {
            const main = require('./main.js');
            await main.handleGroupEvents(socket, update);
        } catch (err) {
            console.error(chalk.red('💥 Error procesando evento de grupo:'), err.message);
        }
    });
}

startBot();