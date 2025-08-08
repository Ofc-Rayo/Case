import fetch from 'node-fetch';

const thumbnailCard = 'https://qu.ax/MvYPM.jpg'; // Miniatura evocadora

const handler = async (m, { conn, text, usedPrefix, command }) => {

  if (!text) {

    return conn.sendMessage(m.chat, {

      text: `🎬 *Invoca un momento animado...*\n\n> Escribe una palabra clave para buscar GIFs de Nayeon.\n\n📌 Ejemplo:\n${usedPrefix + command} nayeon`,

      footer: '🌀 Tenor Finder por Delirius API',

      contextInfo: {

        externalAdReply: {

          title: '🎞️ Buscador de GIFs',

          body: 'Explora animaciones con estilo y emoción',

          thumbnailUrl: thumbnailCard,

          sourceUrl: 'https://tenor.com'

        }

      }

    }, { quoted: m });

  }

  await m.react('🔍');

  try {

    const api = `https://delirius-apiofc.vercel.app/search/tenor?q=${encodeURIComponent(text)}`;

    const res = await fetch(api);

    const json = await res.json();

    const results = json.data;

    if (!Array.isArray(results) || results.length === 0) {

      return conn.sendMessage(m.chat, {

        text: `📭 *No se encontraron GIFs para:* "${text}"\n\n> Intenta con otra palabra clave más específica.`,

        contextInfo: {

          externalAdReply: {

            title: 'Sin resultados',

            body: 'Tu búsqueda no trajo animaciones...',

            thumbnailUrl: thumbnailCard,

            sourceUrl: 'https://tenor.com'

          }

        }

      }, { quoted: m });

    }

    const gif = results[0];

    const caption = `

╭─「 🎀 𝙂𝙄𝙁 𝘿𝙀𝙏𝘼𝙇𝙇𝙀 」─╮

│ 📝 *Descripción:* ${gif.title}

│ 📅 *Fecha:* ${gif.created}

│ 🌐 *Tenor:* ${gif.gif}

╰────────────────────╯

`.trim();

    await conn.sendMessage(m.chat, {

      video: { url: gif.mp4 },

      caption,

      footer: '🚀 GIF obtenido vía Delirius API',

      contextInfo: {

        externalAdReply: {

          title: `🎬 ${text}`,

          body: gif.title,

          thumbnailUrl: thumbnailCard,

          sourceUrl: gif.gif

        }

      }

    }, { quoted: m });

    await m.react('✅');

  } catch (error) {

    console.error('❌ Error al obtener GIFs:', error.message);

    await m.react('⚠️');

    return conn.sendMessage(m.chat, {

      text: `

🚫 *Algo falló al invocar el GIF...*

╭─「 ⚠️ 𝙀𝙍𝙍𝙊𝙍 」─╮

│ 📄 *Detalles:* ${error.message}

│ 🔁 *Sugerencia:* Intenta más tarde o cambia tu búsqueda.

╰─────────────────╯

`.trim(),

      contextInfo: {

        externalAdReply: {

          title: 'Error en la búsqueda',

          body: 'No se pudo acceder al portal de GIFs',

          thumbnailUrl: thumbnailCard,

          sourceUrl: 'https://tenor.com'

        }

      }

    }, { quoted: m });

  }

};

handler.command : 'tenor';

export default handler;