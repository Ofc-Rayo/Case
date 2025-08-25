const fetch = require('node-fetch');
const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'; // Miniatura evocadora

const contextInfo = {
    externalAdReply: {
        title: '🔮 Zenitsu Habla',
        body: 'Convierte palabras en vibraciones rituales',
        mediaType: 1,
        previewType: 0,
        sourceUrl: 'https://myapiadonix.vercel.app/api/adonixvoz',
        thumbnailUrl
    }
};

async function handler(conn, { message, args, command }) {
    const phrase = args.join(' ');
    const from = message.key.remoteJid;

    if (!phrase) {
        return conn.sendMessage(from, {
            text: `🗣️ *Invoca una frase...*\n\n> Escribe un mensaje para canalizarlo como voz ceremonial.\n\n📌 Ejemplo:\n${command} Te extraño, Mitsuri.`,
            contextInfo
        }, { quoted: message });
    }

    await conn.sendMessage(from, {
        text: '🎙️ *Zenitsu está canalizando la voz de Adonix...*',
        contextInfo
    }, { quoted: message });

    try {
        const api = `https://myapiadonix.vercel.app/api/adonixvoz?q=${encodeURIComponent(phrase)}`;
        const res = await fetch(api);
        const audioBuffer = await res.buffer();

        const caption = `
╭─「 🔊 𝙑𝙊𝙕 𝘾𝘼𝙉𝘼𝙇𝙄𝙕𝘼𝘿𝘼 」─╮
│ 📝 *Frase:* ${phrase}
│ 🎧 *Estilo:* Adonix ceremonial
│ 🌐 *Origen:* myapiadonix.vercel.app
╰────────────────────╯

Zenitsu escuchó la frase... y la convirtió en vibración emocional. ✨🔮
`.trim();

        await conn.sendMessage(from, {
            audio: audioBuffer,
            mimetype: 'audio/mp4',
            ptt: true,
            caption,
            contextInfo: {
                externalAdReply: {
                    title: '🔊 Voz invocada',
                    body: `Frase: "${phrase}"`,
                    thumbnailUrl,
                    sourceUrl: api
                }
            }
        }, { quoted: message });

    } catch (error) {
        console.error('❌ Error al canalizar la voz:', error.message);
        return conn.sendMessage(from, {
            text: `
🚫 *Algo falló al invocar la voz...*

╭─「 ⚠️ 𝙀𝙍𝙍𝙊𝙍 」─╮
│ 📄 *Detalles:* ${error.message}
│ 🔁 *Sugerencia:* Intenta más tarde o cambia la frase.
╰─────────────────╯

Zenitsu se quedó sin palabras... pero volverá con más vibración. 🎧⚡
`.trim(),
            contextInfo: {
                externalAdReply: {
                    title: 'Error en la voz',
                    body: 'No se pudo acceder al canal Adonix',
                    thumbnailUrl,
                    sourceUrl: 'https://myapiadonix.vercel.app/api/adonixvoz'
                }
            }
        }, { quoted: message });
    }
}

module.exports = {
    command: 'voz',
    handler,
};