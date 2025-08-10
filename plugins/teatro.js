// plugins/teatro.js
const ESCENAS = [
  {
    personajes: ['Ariadna', 'El Guardián'],
    diálogo: [
      '— ¿Por qué me sigues en sueños?',
      '— Porque tu alma aún no ha despertado.',
      '— Entonces... ¿esto es real?',
      '— Todo lo que arde en tu pecho lo es.'
    ],
    imagen: 'https://i.imgur.com/Teatro1.jpg'
  },
  {
    personajes: ['Luz', 'El Eco'],
    diálogo: [
      '— ¿Me escuchas cuando grito en silencio?',
      '— Soy el eco de tu sombra, siempre estoy.',
      '— ¿Y si dejo de buscar?',
      '— Entonces te encontraré.'
    ],
    imagen: 'https://i.imgur.com/Teatro2.jpg'
  }
];

async function handler(conn, { message }) {
  const jid = message.key.remoteJid;
  const traceId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

  try {
    const escena = ESCENAS[Math.floor(Math.random() * ESCENAS.length)];
    const diálogo = escena.diálogo.map(linea => `_${linea}_`).join('\n');
    const título = `🎭 *Escena teatral: ${escena.personajes.join(' vs ')}*`;

    await conn.sendMessage(jid, {
      image: { url: escena.imagen },
      caption: `${título}\n\n${diálogo}\n\n🔮 id: ${traceId}`,
      contextInfo: {
        externalAdReply: {
          title: 'Teatro ritual',
          body: `Actores: ${escena.personajes.join(', ')}`,
          mediaType: 1,
          previewType: 'PHOTO',
          thumbnailUrl: escena.imagen,
          sourceUrl: escena.imagen,
          renderLargerThumbnail: false
        }
      }
    });
  } catch (err) {
    await conn.sendMessage(jid, {
      text: `⚠️ *El telón no se abrió...*\n> Error: ${err.message}\n> id: ${traceId}`
    });
  }
}

module.exports = {
  command: 'teatro',
  handler
};