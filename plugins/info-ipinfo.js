const fetch = require('node-fetch');
const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'; // Miniatura evocadora

const contextInfo = {
    externalAdReply: {
        title: '🗺️ Rastreador IP',
        body: 'Descubre la historia detrás de cada coordenada',
        mediaType: 1,
        previewType: 0,
        sourceUrl: 'https://delirius-apiofc.vercel.app/tools/ipinfo',
        thumbnailUrl
    }
};

async function handler(conn, { message, args, command }) {
    const ip = args[0];
    const from = message.key.remoteJid;

    if (!ip) {
        return conn.sendMessage(from, {
            text: `🌐 *Invoca una coordenada...*\n\n> Escribe una dirección IP para revelar su historia.\n\n📌 Ejemplo:\n${command} 8.8.8.8`,
            contextInfo
        }, { quoted: message });
    }

    await conn.sendMessage(from, {
        text: '🔍 *Zenitsu está rastreando las vibraciones digitales...*',
        contextInfo
    }, { quoted: message });

    try {
        const api = `https://delirius-apiofc.vercel.app/tools/ipinfo?ip=${ip}`;
        const res = await fetch(api);
        const json = await res.json();
        const data = json.data;

        if (!data || data.status !== 'success') {
            return conn.sendMessage(from, {
                text: `📭 *No se pudo rastrear la IP:* "${ip}"\n\n> Verifica que esté bien escrita.`,
                contextInfo: {
                    externalAdReply: {
                        title: 'Sin coordenadas',
                        body: 'La IP no reveló su historia...',
                        thumbnailUrl,
                        sourceUrl: 'https://delirius-apiofc.vercel.app/tools/ipinfo'
                    }
                }
            }, { quoted: message });
        }

        const caption = `
╭─「 🧭 𝙄𝙋 𝘿𝙀𝙏𝘼𝙇𝙇𝙀 」─╮
│ 🌍 *Continente:* ${data.continent}
│ 🗺️ *País:* ${data.country} (${data.countryCode})
│ 🏙️ *Ciudad:* ${data.city}, ${data.regionName}
│ 🧭 *Coordenadas:* ${data.lat}, ${data.lon}
│ 🕰️ *Zona horaria:* ${data.timezone}
│ 💸 *Moneda:* ${data.currency}
│ 🛰️ *ISP:* ${data.isp}
│ 🏢 *Organización:* ${data.org}
│ 🛡️ *Proxy:* ${data.proxy ? 'Sí' : 'No'}
│ 🏡 *Hosting:* ${data.hosting ? 'Sí' : 'No'}
╰────────────────────╯

Zenitsu rastreó la IP... y encontró un rincón digital lleno de historia. 📡✨
`.trim();

        await conn.sendMessage(from, {
            text: caption,
            contextInfo: {
                externalAdReply: {
                    title: `📍 IP: ${data.query}`,
                    body: `${data.city}, ${data.country}`,
                    thumbnailUrl,
                    sourceUrl: `https://delirius-apiofc.vercel.app/tools/ipinfo?ip=${data.query}`
                }
            }
        }, { quoted: message });

    } catch (error) {
        console.error('❌ Error al rastrear IP:', error.message);
        return conn.sendMessage(from, {
            text: `
🚫 *Algo falló al rastrear la IP...*

╭─「 ⚠️ 𝙀𝙍𝙍𝙊𝙍 」─╮
│ 📄 *Detalles:* ${error.message}
│ 🔁 *Sugerencia:* Intenta más tarde o revisa la IP.
╰─────────────────╯

Zenitsu se perdió en el mapa... pero volverá con más coordenadas. 🗺️⚡
`.trim(),
            contextInfo: {
                externalAdReply: {
                    title: 'Error en el rastreo',
                    body: 'No se pudo acceder al mapa emocional',
                    thumbnailUrl,
                    sourceUrl: 'https://delirius-apiofc.vercel.app/tools/ipinfo'
                }
            }
        }, { quoted: message });
    }
}

module.exports = {
    command: 'ipinfo',
    handler,
};