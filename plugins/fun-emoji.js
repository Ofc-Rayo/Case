const fetch = require('node-fetch');
const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'; // Miniatura evocadora

const contextInfo = {
    externalAdReply: {
        title: '🎭 Galería Emoji',
        body: 'Explora cómo cada mundo dibuja la misma emoción',
        mediaType: 1,
        previewType: 0,
        sourceUrl: 'https://emojigraph.org/es',
        thumbnailUrl
    }
};

async function handler(conn, { message, args, command }) {
    const emoji = args[0];
    const from = message.key.remoteJid;

    if (!emoji) {
        return conn.sendMessage(from, {
            text: `🎨 *Invoca una emoción...*\n\n> Escribe un emoji para ver cómo se representa en cada universo digital.\n\n📌 Ejemplo:\n.emoji 😁`,
            contextInfo
        }, { quoted: message });
    }

    await conn.sendMessage(from, {
        text: '🖌️ *Zenitsu está reuniendo las versiones del emoji...*',
        contextInfo
    }, { quoted: message });

    try {
        const api = `https://delirius-apiofc.vercel.app/tools/emoji?text=${encodeURIComponent(emoji)}`;
        const res = await fetch(api);
        const json = await res.json();
        const data = json.data;

        if (!data || Object.keys(data).length === 0) {
            return conn.sendMessage(from, {
                text: `📭 *No se encontraron versiones para:* "${emoji}"\n\n> Intenta con otro emoji más común.`,
                contextInfo: {
                    externalAdReply: {
                        title: 'Sin versiones',
                        body: 'La emoción no se manifestó en otros mundos...',
                        thumbnailUrl,
                        sourceUrl: 'https://emojigraph.org/es'
                    }
                }
            }, { quoted: message });
        }

        const caption = `
╭─「 🌐 𝙀𝙈𝙊𝙅𝙄 𝙑𝙀𝙍𝙎𝙄𝙊𝙉𝙀𝙎 」─╮
│ 😁 *Emoji:* ${emoji}
╰────────────────────╯

Zenitsu reunió los rostros... ¡y cada uno sonríe con su propio estilo! 🎭✨
`.trim();

        await conn.sendMessage(from, {
            image: { url: data.apple },
            caption,
            contextInfo: {
                externalAdReply: {
                    title: '😁 Versión Apple',
                    body: 'Haz clic para ver más estilos en Emojigraph',
                    thumbnailUrl: data.google,
                    sourceUrl: 'https://emojigraph.org/es'
                }
            }
        }, { quoted: message });

    } catch (error) {
        console.error('❌ Error al obtener versiones del emoji:', error.message);
        return conn.sendMessage(from, {
            text: `
🚫 *Algo falló al invocar las versiones del emoji...*

╭─「 ⚠️ 𝙀𝙍𝙍𝙊𝙍 」─╮
│ 📄 *Detalles:* ${error.message}
│ 🔁 *Sugerencia:* Intenta más tarde o cambia el emoji.
╰─────────────────╯

Zenitsu se confundió entre tantas sonrisas... pero volverá con más claridad. 😊⚡
`.trim(),
            contextInfo: {
                externalAdReply: {
                    title: 'Error en la galería',
                    body: 'No se pudo acceder a las versiones del emoji',
                    thumbnailUrl,
                    sourceUrl: 'https://emojigraph.org/es'
                }
            }
        }, { quoted: message });
    }
}

module.exports = {
    command: 'emoji',
    handler,
};