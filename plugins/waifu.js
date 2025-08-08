const axios = require('axios');

const thumbnailUrl = 'https://qu.ax/MvYPM.jpg';

const contextInfo = {

    externalAdReply: {

        title: "💖 Zenitsu invoca una waifu",

        body: "Belleza, poder y ternura en una sola imagen...",

        mediaType: 1,

        previewType: 0,

        mediaUrl: "https://waifu.pics",

        sourceUrl: "https://waifu.pics",

        thumbnailUrl

    }

};

async function handler(conn, { message }) {

    try {

        const res = await axios.get('https://api.waifu.pics/sfw/waifu');

        const waifuUrl = res.data?.url;

        if (!waifuUrl) {

            return conn.sendMessage(message.key.remoteJid, {

                text: '❌ Zenitsu no pudo encontrar una waifu esta vez...',

                contextInfo

            }, { quoted: message });

        }

        const phrases = [

            '😳 Zenitsu se sonrojó al verla...',

            '💘 Una presencia que acelera el corazón...',

            '🌸 Belleza que desafía los rayos...',

            '⚡ Zenitsu no puede dejar de mirarla...',

            '🫣 ¿Es real o solo un sueño?'

        ];

        const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];

        const caption = `

╭─「 💖 𝙒𝘼𝙄𝙁𝙐 𝘼𝙇𝙀𝘼𝙏𝙊𝙍𝙄𝘼 」─╮
│ 🧠 *Estado emocional:* ${randomPhrase}
╰─────────────────────╯

`.trim();

        await conn.sendMessage(message.key.remoteJid, {

            image: { url: waifuUrl },

            caption,

            contextInfo

        }, { quoted: message });

    } catch (err) {

        console.error('⚠️ Error en el comando waifu:', err.message);

        await conn.sendMessage(message.key.remoteJid, {

            text: `❌ *No se pudo invocar una waifu.*\n🛠️ ${err.message}`,

            contextInfo

        }, { quoted: message });

    }

}

module.exports = {

    command: 'waifu',

    handler,

};