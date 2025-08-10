const COOLDOWN_MS = 15000; // 15 segundos de respiro teatral
const cooldowns = new Map();

async function teatroHandler(conn, m) {
  const userId = m.sender;
  const now = Date.now();

  // 🕰️ Verificamos si el usuario está en cooldown
  if (cooldowns.has(userId) && now - cooldowns.get(userId) < COOLDOWN_MS) {
    return conn.sendMessage(m.chat, {
      text: `⏳ *El telón aún respira...*  
      Espera unos segundos antes de invocar otra escena.`,
      contextInfo: { externalAdReply: { title: 'Teatro en pausa', body: 'El alma del escenario se prepara', thumbnailUrl: 'https://i.imgur.com/3z1ZQZL.png' } }
    });
  }

  cooldowns.set(userId, now); // 🎬 Activamos cooldown

  try {
    // 🎨 Imagen principal del acto
    const imageUrl = 'https://i.imgur.com/yourImage.png';

    await conn.sendMessage(m.chat, {
      image: { url: imageUrl },
      caption: `🎭 *Acto I: El telón se abre*  
      La escena respira, los suspiros se elevan...`,
      contextInfo: {
        externalAdReply: {
          title: 'Teatro Ritual',
          body: 'Cada imagen es un suspiro del alma',
          thumbnailUrl: imageUrl
        }
      }
    });

  } catch (error) {
    // 🧤 Fallback visual si falla la imagen
    console.error('Error al cargar imagen:', error);

    await conn.sendMessage(m.chat, {
      text: `⚠️ *El telón no se abrió...*  
      El escenario se ha saturado. Intenta más tarde.`,
      contextInfo: {
        externalAdReply: {
          title: 'Error 429',
          body: 'Demasiadas invocaciones. El teatro necesita respirar.',
          thumbnailUrl: 'https://i.imgur.com/3z1ZQZL.png'
        }
      }
    });
  }
}