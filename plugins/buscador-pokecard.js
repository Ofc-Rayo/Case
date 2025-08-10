const thumbnailUrl = 'https://delirius-apiofc.vercel.app/search/pokecard?text=caterpie';

const contextInfo = {
  externalAdReply: {
    title: '🃏 PokéCard Ritual',
    body: 'Cartas que emergen del éter pixelado...',
    mediaType: 1,
    previewType: 0,
    sourceUrl: 'https://delirius-apiofc.vercel.app',
    thumbnailUrl
  }
};

async function handler(conn, { message, args }) {
  const jid = message.key.remoteJid;
  const quoted = message;
  const query = args.join(' ');

  if (!query) {
    return conn.sendMessage(jid, {
      text: '*🔍 ¿Qué criatura deseas invocar?*\n\n> Escribe el nombre de un Pokémon para buscar su carta.',
      contextInfo
    }, { quoted });
  }

  const imageUrl = `https://delirius-apiofc.vercel.app/search/pokecard?text=${encodeURIComponent(query)}`;

  const caption = `
╭─「 🃏 𝙋𝙊𝙆𝙀𝘾𝘼𝙍𝘿 - 𝙍𝙄𝙏𝙐𝘼𝙇 」─╮
│ 🔍 *Búsqueda:* ${query}
│ 🌐 *Fuente:* Delirius PokéAPI
╰────────────────────────╯
*✨ Carta invocada con éxito...*
`.trim();

  await conn.sendMessage(jid, {
    image: { url: imageUrl },
    caption,
    contextInfo,
    quoted
  });
}

module.exports = {
  command: 'pokecard',
  handler
};