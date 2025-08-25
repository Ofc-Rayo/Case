const fetch = require('node-fetch');
const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'; // Miniatura evocadora

const contextInfo = {
    externalAdReply: {
        title: '📸 Captura Web',
        body: 'Convierte URLs en recuerdos visuales',
        mediaType: 1,
        previewType: 0,
        sourceUrl: 'https://delirius-apiofc.vercel.app/tools/ssweb',
        thumbnailUrl
    }
};

async function handler(conn, { message, args, command }) {
    const url = args[0];
    const from = message.key.remoteJid;

    if (!url) {
        return conn.sendMessage(from, {
            text: `🌐 *Invoca un portal digital...*\n\n> Escribe una URL para capturar su esencia visual.\n\n📌 Ejemplo:\n${command} https://github.com/delirius0`,
            contextInfo
        }, { quoted: message });
    }

    await conn.sendMessage(from, {
        text: '📷 *Zenitsu está enfocando el portal...*',
        contextInfo
    }, { quoted: message });

    try {
        const api = `https://delirius-apiofc.vercel.app/tools/ssweb?url=${encodeURIComponent(url)}`;
        const res = await fetch(api);
        const json = await res.json();
        const data = json.data;

        if (!data || !data.download) {
            return conn.sendMessage(from, {
                text: `📭 *No se pudo capturar la URL:* "${url}"\n\n> Verifica que esté bien escrita.`,
                contextInfo: {
                    externalAdReply: {
                        title: 'Sin captura',
                        body: 'El portal no reveló su imagen...',
                        thumbnailUrl,
                        sourceUrl: 'https://delirius-apiofc.vercel.app/tools/ssweb'
                    }
                }
            }, { quoted: message });
        }

        const caption = `
╭─「 🖼️ 𝘾𝘼𝙋𝙏𝙐𝙍𝘼 𝙒𝙀𝘽 」─╮
│ 🌐 *URL:* ${url}
│ 🧭 *Origen:* Delirius (神志不清)
╰────────────────────╯

Zenitsu capturó el portal... ¡y quedó hipnotizado por su estética! ✨📸
`.trim();

        await conn.sendMessage(from, {
            image: { url: data.download },
            caption,
            contextInfo: {
                externalAdReply: {
                    title: '📸 Captura lista',
                    body: 'Haz clic para ver el portal congelado',
                    thumbnailUrl,
                    sourceUrl: url
                }
            }
        }, { quoted: message });

    } catch (error) {
        console.error('❌ Error al capturar la web:', error.message);
        return conn.sendMessage(from, {
            text: `
🚫 *Algo falló al capturar el portal...*

╭─「 ⚠️ 𝙀𝙍𝙍𝙊𝙍 」─╮
│ 📄 *Detalles:* ${error.message}
│ 🔁 *Sugerencia:* Intenta más tarde o revisa la URL.
╰─────────────────╯

Zenitsu se quedó sin enfoque... pero volverá con más claridad. 🎞️⚡
`.trim(),
            contextInfo: {
                externalAdReply: {
                    title: 'Error en la captura',
                    body: 'No se pudo acceder al portal visual',
                    thumbnailUrl,
                    sourceUrl: 'https://delirius-apiofc.vercel.app/tools/ssweb'
                }
            }
        }, { quoted: message });
    }
}

module.exports = {
    command: 'ssweb',
    handler,
};