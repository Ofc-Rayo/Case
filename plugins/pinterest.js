const axios = require('axios');

const baileys = require('@whiskeysockets/baileys');

const path = require('path');

const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'; // Puedes cambiarlo por otro que evoque exploración visual

const contextInfo = {

    externalAdReply: {

        title: "🖼️ Pinterest Explorer",

        body: "Imágenes que susurran historias desde el éter...",

        mediaType: 1,

        previewType: 0,

        mediaUrl: null,

        sourceUrl: "https://pinterest.com",

        thumbnailUrl

    }

};

async function sendAlbumMessage(jid, medias, conn, options = {}) {

    if (typeof jid !== 'string') throw new TypeError(`jid debe ser un string, recibido: ${typeof jid}`);

    if (!Array.isArray(medias) || medias.length < 2) {

        throw new RangeError('Se necesitan al menos 2 imágenes para crear un álbum.');

    }

    const caption = options.text || options.caption || '';

    const delay = !isNaN(options.delay) ? Number(options.delay) : 500;

    const quoted = options.quoted || null;

    const album = baileys.generateWAMessageFromContent(

        jid,

        { messageContextInfo: {}, albumMessage: { expectedImageCount: medias.length } },

        {}

    );

    await conn.relayMessage(jid, album.message, { messageId: album.key.id });

    for (let i = 0; i < medias.length; i++) {

        const { type, data } = medias[i];

        const msg = await baileys.generateWAMessage(

            jid,

            { [type]: data, ...(i === 0 ? { caption } : {}) },

            { upload: conn.waUploadToServer }

        );

        msg.message.messageContextInfo = {

            messageAssociation: {

                associationType: 1,

                parentMessageKey: album.key,

            },

        };

        await conn.relayMessage(jid, msg.message, { messageId: msg.key.id });

        await new Promise(resolve => setTimeout(resolve, delay));

    }

    return album;

}

async function handler(conn, { message, args }) {

    const query = args.join(' ');

    if (!query) {

        return conn.sendMessage(message.key.remoteJid, {

            text: '*🔍 ¿Qué estás buscando?*\n\n> Ingresa una palabra clave para explorar imágenes en Pinterest.',

            contextInfo

        }, { quoted: message });

    }

    await conn.sendMessage(message.key.remoteJid, {

        text: '⌛ *Explorando Pinterest para ti...*',

        contextInfo

    }, { quoted: message });

    try {

        const response = await axios.get(`https://api.dorratz.com/v2/pinterest?q=${encodeURIComponent(query)}`);

        const data = response.data;

        if (!Array.isArray(data) || data.length < 2) {

            return conn.sendMessage(message.key.remoteJid, {

                text: '📭 *No encontré suficientes resultados visuales para mostrarte un álbum.*\n\n> Intenta con otra búsqueda más específica.',

                contextInfo

            }, { quoted: message });

        }

        const images = data.slice(0, 10).map(img => ({

            type: 'image',

            data: { url: img.image_large_url }

        }));

        const caption = `

╭─「 🖼️ 𝙋𝙄𝙉𝙏𝙀𝙍𝙀𝙎𝙏 - 𝘼𝙇𝘽𝙐𝙈 」─╮

│ 🔎 *Búsqueda:* ${query}

│ 🖼️ *Resultados:* ${images.length}

│ 📡 *Fuente:* Pinterest API

╰────────────────────╯

*✨ Imágenes que susurran ideas...*

`.trim();

        await sendAlbumMessage(message.key.remoteJid, images, conn, { caption, quoted: message });

        await conn.sendMessage(message.key.remoteJid, {

            text: `✅ *Listo.* Aquí están las imágenes de *${query}*. ¿Deseas buscar otra cosa o ver más resultados?`,

            contextInfo

        }, { quoted: message });

    } catch (err) {

        console.error('❌ Error al obtener imágenes de Pinterest:', err.message);

        await conn.sendMessage(message.key.remoteJid, {

            text: '🚫 *Ups... algo falló al intentar obtener imágenes de Pinterest.*\n\n> Intenta más tarde o cambia tu término de búsqueda.',

            contextInfo

        }, { quoted: message });

    }

}

module.exports = {

    command: 'pin',

    handler,

};