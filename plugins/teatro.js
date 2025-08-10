const COOLDOWN_MS = 15000;
const cooldowns = new Map();

const escenas = [
  'https://i.imgur.com/yourImage1.png',
  'https://i.imgur.com/yourImage2.png',
  'https://i.imgur.com/yourImage3.png'
];

export const teatro = {
  command: ['teatro'],
  tags: ['ritual'],
  help: ['teatro'],
  description: 'Abre el telón y muestra una escena ritual',
  handler: async (conn, m) => {
    const userId = m.sender;
    const now = Date.now();
    const isOwner = global.owner?.includes(userId);

    // ⏳ Cooldown ritual
    if (!isOwner && cooldowns.has(userId) && now - cooldowns.get(userId) < COOLDOWN_MS) {
      return conn.sendMessage(m.chat, {
        text: `⏳ *El telón aún respira...*  
        Espera unos segundos antes de invocar otra escena.`,
        contextInfo: {
          externalAdReply: {
            title: 'Teatro en pausa',
            body: 'El alma del escenario se prepara',
            thumbnailUrl: 'https://i.imgur.com/3z1ZQZL.png'
          }
        }
      });
    }

    cooldowns.set(userId, now);

    const escenaElegida = escenas[Math.floor(Math.random() * escenas.length)];

    try {
      await conn.sendMessage(m.chat, {
        image: { url: escenaElegida },
        caption: `🎭 *Acto I: El telón se abre*  
        La escena respira, los suspiros se elevan...`,
        contextInfo: {
          externalAdReply: {
            title: 'Teatro Ritual',
            body: 'Cada imagen es un suspiro del alma',
            thumbnailUrl: escenaElegida
          }
        }
      });

      console.log(`[🎭 Teatro] ${userId} invocó escena a las ${new Date().toLocaleTimeString()}`);

    } catch (error) {
      console.warn(`[⚠️ Teatro] Error al cargar imagen para ${userId}: ${error.message}`);

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
};