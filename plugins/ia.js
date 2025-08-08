const axios = require('axios');
const fs = require('fs');
const path = require('path');

const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'; // Imagen dramática

const contextInfo = {
    externalAdReply: {
        title: "⚡ Zenitsu-Bot",
        body: "¡Estoy temblando, pero responderé con todo mi corazón!",
        mediaType: 1,
        previewType: 0,
        mediaUrl: "https://zenitsu.bot",
        sourceUrl: "https://zenitsu.bot",
        thumbnailUrl
    }
};

const historyPath = './zenitsuMemory.json';

if (!fs.existsSync(historyPath)) {
    fs.writeFileSync(historyPath, JSON.stringify({}));
}

async function handler(conn, { message, args }) {
    const query = args.join(' ');
    const jid = message.key.remoteJid;

    if (!query) {
        return conn.sendMessage(jid, {
            text: '😱 ¡¿Cómo que no escribiste nada?!\n\n> ¡No puedo leer tu mente, baka! 😤',
            contextInfo
        }, { quoted: message });
    }

    await conn.sendMessage(jid, {
        text: '⚡ *Estoy temblando... pero invocando la respuesta...*',
        contextInfo
    }, { quoted: message });

    let conversationHistory = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
    const userId = message.key.participant || message.key.remoteJid;

    if (!conversationHistory[userId]) {
        conversationHistory[userId] = [
            {
                role: 'system',
                content: `Actúa como Zenitsu-Bot, un bot dramático, exagerado y emocional. Grita, se queja, pero responde con ternura y humor. Su creador es Carlos, a quien admira como maestro del trueno.`
            }
        ];
    }

    conversationHistory[userId].push({ role: 'user', content: query });

    const conversationText = conversationHistory[userId]
        .map(msg =>
            msg.role === 'system' ? `⚙️ Sistema: ${msg.content}\n\n`
                : msg.role === 'user' ? `👤 Usuario: ${msg.content}\n\n`
                    : `⚡ Zenitsu-Bot: ${msg.content}\n\n`
        ).join('');

    try {
        const response = await axios.post(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBrYQZ3s5IVrp-on-ewJON8Gj6ZoD_NWWI',
            {
                contents: [{ parts: [{ text: conversationText }] }]
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        const replyText = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!replyText) {
            return conn.sendMessage(jid, {
                text: '😵 *¡La IA no dijo nada! ¡Estoy en pánico total!*',
                contextInfo
            }, { quoted: message });
        }

        conversationHistory[userId].push({ role: 'assistant', content: replyText });
        fs.writeFileSync(historyPath, JSON.stringify(conversationHistory, null, 2));

        const messageText = `
╭─「 ⚡ 𝙕𝙀𝙉𝙄𝙏𝙎𝙐 - 𝙍𝙀𝙎𝙋𝙐𝙀𝙎𝙏𝘼 」─╮
│ 🧠 Pregunta: ${query}
│ 🎭 Estilo: Zenitsu-Bot
│ 🪷 Creador: Carlos
╰────────────────────╯

${replyText}

😳 Zenitsu está exhausto... ¡pero lo logró! ⚡
`.trim();

        await conn.sendMessage(jid, {
            text: messageText,
            contextInfo
        }, { quoted: message });

    } catch (err) {
        console.error('⚠️ Error al invocar a Zenitsu-Bot:', err.message);
        await conn.sendMessage(jid, {
            text: `❌ ¡Algo salió mal!\n\n> Zenitsu se tropezó intentando responder...\n🛠️ ${err.message}`,
            contextInfo
        }, { quoted: message });
    }
}

module.exports = {
    command: 'ia',
    handler,
};
