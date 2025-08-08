const axios = require('axios');

const thumbnailUrl = 'https://qu.ax/MvYPM.jpg'; // Miniatura de portal visual

const contextInfo = {
    externalAdReply: {
        title: "🖼️ Pinterest Akame",
        body: "Fragmentos de belleza desde el universo de Akame",
        mediaType: 1,
        previewType: 0,
        mediaUrl: "https://api.dorratz.com",
        sourceUrl: "https://api.dorratz.com",
        thumbnailUrl
    }
};

async function handler(conn, { args, message }) {
    const query = args.join(" ") || "Akame";
    const apiUrl = `https://api.dorratz.com/v2/pinterest?q=${encodeURIComponent(query)}`;

    try {
        const res = await axios.get(apiUrl);
        const results = res.data;

        if (!Array.isArray(results) || results.length === 0) {
            throw new Error("No se encontraron imágenes.");
        }

        for (let i = 0; i < Math.min(results.length, 5); i++) {
            const img = results[i].image_large_url || results[i].URL_grande_de_la_imagen;
            if (!img) continue;

            const caption = `
╭─「 🖼️ 𝘼𝙆𝘼𝙈𝙀 - 𝙑𝙄𝙎𝙄𝙊𝙉𝙀𝙎 」─╮
│ 🌌 *Imagen ${i + 1}:* Fragmento de universo
│ 🔍 *Tema:* ${query}
│ 📡 *Fuente:* Pinterest API
╰────────────────────────╯

*✨ Cada imagen es un suspiro visual, una memoria congelada del alma de Akame...*
`.trim();

            await conn.sendMessage(message.key.remoteJid, {
                image: { url: img },
                caption,
                contextInfo
            }, { quoted: message });
        }

    } catch (err) {
        console.error("⚠️ Error en pinterest:", err.message);
        await conn.sendMessage(message.key.remoteJid, {
            text: `*❌ No se pudo obtener imágenes de Pinterest.*\n\n> Detalles: ${err.message}`,
            contextInfo
        }, { quoted: message });
    }
}

module.exports = {
    command: 'pinterest',
    handler,
};
