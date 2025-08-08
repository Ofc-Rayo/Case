const axios = require('axios');

const fs = require('fs');

const path = require('path');

const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'; // Puedes cambiarlo por otro que evoque tecnología o apps

const contextInfo = {

    externalAdReply: {

        title: "📲 Play Store Explorer",

        body: "Descubre apps ocultas entre bytes y estrellas...",

        mediaType: 1,

        previewType: 0,

        mediaUrl: "https://play.google.com",

        sourceUrl: "https://play.google.com",

        thumbnailUrl

    }

};

async function handler(conn, { message, args }) {

    const query = args.join(' ');

    if (!query) {

        return conn.sendMessage(message.key.remoteJid, {

            text: '*🔍 ¿Qué app estás buscando?*\n\n> Usa: `playstore WhatsApp` o algo similar.',

            contextInfo

        }, { quoted: message });

    }

    try {

        const apiUrl = `https://api.vreden.my.id/api/playstore?query=${encodeURIComponent(query)}`;

        const response = await axios.get(apiUrl);

        const results = response.data?.result;

        if (!results || results.length === 0) {

            return conn.sendMessage(message.key.remoteJid, {

                text: '*😕 No encontré resultados...*\n\n> Intenta con otro término o revisa la ortografía.',

                contextInfo

            }, { quoted: message });

        }

        for (const app of results.slice(0, 5)) {

            const nombre = app.nama || app.nombre;

            const dev = app.developer || app.desarrollador;

            const rate = app.rate || app.calificación;

            const link = app.link;

            const devLink = app.link_dev;

            const icon = app.img;

            const caption = `

╭─「 🧠 𝘼𝙋𝙋 𝘿𝙀𝙎𝘾𝙐𝘽𝙄𝙀𝙍𝙏𝘼 」─╮

│ 📲 *Nombre:* ${nombre}

│ 👨‍💻 *Desarrollador:* ${dev}

│ ⭐ *Calificación:* ${rate}

│ 🔗 [Ver en Play Store](${link})

│ 🏢 [Más del desarrollador](${devLink})

╰────────────────────╯

*✨ Explora, instala y transforma tu dispositivo...*

`.trim();

            await conn.sendMessage(message.key.remoteJid, {

                image: { url: icon },

                caption,

                contextInfo

            }, { quoted: message });

        }

    } catch (err) {

        console.error('❌ Error al consultar la API de Play Store:', err.message);

        await conn.sendMessage(message.key.remoteJid, {

            text: '*💥 Algo salió mal al buscar en la Play Store...*\n\n> Intenta más tarde o revisa tu conexión.',

            contextInfo

        }, { quoted: message });

    }

}

module.exports = {

    command: 'playstore',

    handler,

}; 