const fetch = require('node-fetch');
const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'; // Miniatura evocadora

const contextInfo = {
    externalAdReply: {
        title: '🔮 Lectura Facial',
        body: 'Descubre la edad emocional y la energía del rostro',
        mediaType: 1,
        previewType: 0,
        sourceUrl: 'https://delirius-apiofc.vercel.app/ia/age',
        thumbnailUrl
    }
};

async function handler(conn, { message, command }) {
    const from = message.key.remoteJid;
    const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    const imageMessage = quoted?.imageMessage || message.message?.imageMessage;
    const imageUrl = imageMessage?.url || imageMessage?.directPath;

    if (!imageUrl) {
        return conn.sendMessage(from, {
            text: `🖼️ *Invoca un rostro...*\n\n> Responde a una imagen con el comando para leer su energía facial.\n\n📌 Ejemplo:\n.age (respondiendo a una foto)`,
            contextInfo
        }, { quoted: message });
    }

    await conn.sendMessage(from, {
        text: '🧿 *Zenitsu está contemplando el rostro con ternura...*',
        contextInfo
    }, { quoted: message });

    try {
        const api = `https://delirius-apiofc.vercel.app/ia/age?image=${encodeURIComponent(imageUrl)}&language=es`;
        const res = await fetch(api);
        const json = await res.json();
        const data = json.data;

        if (!data || !data.age) {
            return conn.sendMessage(from, {
                text: `📭 *No se pudo leer el rostro de la imagen.*\n\n> Asegúrate de que sea una foto clara y visible.`,
                contextInfo: {
                    externalAdReply: {
                        title: 'Sin lectura',
                        body: 'El rostro no reveló su energía...',
                        thumbnailUrl,
                        sourceUrl: 'https://delirius-apiofc.vercel.app/ia/age'
                    }
                }
            }, { quoted: message });
        }

        const caption = `
╭─「 🧠 𝙍𝙊𝙎𝙏𝙍𝙊 𝘼𝙉𝘼𝙇𝙄𝙕𝘼𝘿𝙊 」─╮
│ 🎂 *Edad estimada:* ${data.age}
│ 🚺 *Género:* ${data.gender}
│ 😊 *Expresión:* ${data.expression}
│ 🔷 *Forma del rostro:* ${data.face_shape}
│ 🌐 *Idioma:* ${data.lang}
╰────────────────────╯

Zenitsu contempló el rostro... y sonrió con ternura. Cada rasgo cuenta una historia. ✨📷
`.trim();

        await conn.sendMessage(from, {
            image: { url: imageUrl },
            caption,
            contextInfo: {
                externalAdReply: {
                    title: '🔍 Lectura completada',
                    body: `Edad: ${data.age} | Expresión: ${data.expression}`,
                    thumbnailUrl,
                    sourceUrl: imageUrl
                }
            }
        }, { quoted: message });

    } catch (error) {
        console.error('❌ Error al analizar el rostro:', error.message);
        return conn.sendMessage(from, {
            text: `
🚫 *Algo falló al leer la imagen...*

╭─「 ⚠️ 𝙀𝙍𝙍𝙊𝙍 」─╮
│ 📄 *Detalles:* ${error.message}
│ 🔁 *Sugerencia:* Intenta más tarde o usa otra imagen.
╰─────────────────╯

Zenitsu se sonrojó... pero volverá con más sensibilidad. 💫⚡
`.trim(),
            contextInfo: {
                externalAdReply: {
                    title: 'Error en la lectura',
                    body: 'No se pudo acceder al rostro emocional',
                    thumbnailUrl,
                    sourceUrl: 'https://delirius-apiofc.vercel.app/ia/age'
                }
            }
        }, { quoted: message });
    }
}

module.exports = {
    command: 'age',
    handler,
};