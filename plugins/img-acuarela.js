const axios = require('axios');

const fs = require('fs');

const path = require('path');

const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'; // Puedes cambiarlo por una miniatura artística

const contextInfo = {

    externalAdReply: {

        title: "🎨 Texto Acuarela",

        body: "Transforma palabras en pigmentos digitales...",

        mediaType: 1,

        previewType: 0,

        mediaUrl: "https://api.vreden.my.id",

        sourceUrl: "https://api.vreden.my.id",

        thumbnailUrl

    }

};

async function handler(conn, { message, args }) {

    const query = args.join(' ');

    if (!query) {

        return conn.sendMessage(message.key.remoteJid, {

            text: '*🖌️ ¿Qué palabra deseas pintar en acuarela?*\n\n> Ejemplo: `acuarela esperanza`',

            contextInfo

        }, { quoted: message });

    }

    try {

        const apiUrl = `https://api.vreden.my.id/api/maker/ephoto/watercolortext?text=${encodeURIComponent(query)}`;

        const response = await axios.get(apiUrl);

        const imageUrl = response.data?.result;

        if (!imageUrl) {

            throw new Error('No se pudo generar la imagen acuarela.');

        }

        const caption = `

╭─「 🖼️ 𝘼𝘾𝙐𝘼𝙍𝙀𝙇𝘼 - 𝙏𝙀𝙓𝙏𝙊 」─╮

│ 🖋️ *Palabra:* ${query}

│ 🎨 *Estilo:* Acuarela digital

│ 📡 *Fuente:* Vreden API

╰────────────────────╯

*✨ Tu palabra ha sido pintada con alma digital...*

`.trim();

        await conn.sendMessage(message.key.remoteJid, {

            image: { url: imageUrl },

            caption,

            contextInfo

        }, { quoted: message });

    } catch (err) {

        console.error('⚠️ Error en el comando acuarela:', err.message);

        await conn.sendMessage(message.key.remoteJid, {

            text: `*❌ No se pudo pintar tu palabra...*\n\n> Detalles: ${err.message}`,

            contextInfo

        }, { quoted: message });

    }

}

module.exports = {

    command: 'acuarela',

    handler,

};
