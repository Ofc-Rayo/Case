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
  const escena = ESCENAS[Math.floor(Math.random() * ESCENAS.length)];
  const texto = escena.diálogo.map(linea => `_${linea}_`).join('\n');

  await conn.sendMessage(jid, {
    image: { url: escena.imagen },
    caption: `🎭 *Escena teatral: ${escena.personajes.join(' vs ')}*\n\n${texto}`,
    contextInfo: {
      externalAdReply: {
        title: 'Teatro ritual',
        body: 'Diálogo emocional',
        mediaType: 1,
        previewType: 'PHOTO',
        thumbnailUrl: escena.imagen,
        sourceUrl: escena.imagen,
        renderLargerThumbnail: false
      }
    }
  });
}

module.exports = {
  command: 'teatro',
  handler
};