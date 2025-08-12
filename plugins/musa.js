// plugins/musa.js
const axios = require('axios');

const COOLDOWN_MS = 8000;
const cooldowns = new Map();

// Categorías SFW de waifu.pics (solo seguras)
const SFW_CATEGORIES = [
  'waifu','neko','shinobu','megumin','bully','cuddle','cry','hug','awoo','kiss',
  'lick','pat','smug','bonk','yeet','blush','smile','wave','highfive','handhold',
  'nom','bite','glomp','slap','kill','kick','happy','wink','poke','dance','cringe'
];

function pickSafeCategory(arg) {
  const c = (arg || '').toLowerCase().trim();
  return SFW_CATEGORIES.includes(c) ? c : null;
}

function makeTraceId() {
  return `${Date.now().toString(36)}-${(Math.random() * 1e6 | 0).toString(36)}`;
}

async function handler(conn, { message, args }) {
  const jid = message.key.remoteJid;
  const now = Date.now();
  const last = cooldowns.get(jid) || 0;

  // Cooldown por chat
  if (now - last < COOLDOWN_MS) {
    const wait = Math.ceil((COOLDOWN_MS - (now - last)) / 1000);
    return conn.sendMessage(jid, {
      text: `*⏳ Zenitsu respira...* Espera ${wait}s antes de invocar otra musa.`
    });
  }

  // Categoría
  const inputCategory = args[0] || 'waifu';
  const category = pickSafeCategory(inputCategory) || 'waifu';

  // Guía si la categoría no es válida
  if (!pickSafeCategory(inputCategory) && args[0]) {
    const sample = SFW_CATEGORIES.slice(0, 10).join(' · ');
    await conn.sendMessage(jid, {
      text: `*🔍 Categoría no permitida.*\n\n` +
            `> Usa alguna de estas seguras:\n${sample}\n\n` +
            `> Ejemplo: musa ${SFW_CATEGORIES[0]}`
    });
  }

  cooldowns.set(jid, now);
  const traceId = makeTraceId();

  // Mensaje de invocación
  await conn.sendMessage(jid, {
    text: `*🔮 Invocando musa \`${category}\`...*\n> id: ${traceId}`
  });

  try {
    // Waifu.pics SFW
    const apiUrl = `https://api.waifu.pics/sfw/${encodeURIComponent(category)}`;
    const res = await axios.get(apiUrl, { timeout: 15000 });

    if (!res.data || typeof res.data.url !== 'string' || !res.data.url.startsWith('http')) {
      throw new Error('ESTRUCTURA_NO_COMPATIBLE');
    }

    const imageUrl = res.data.url;

    const caption = [
      '╭─「 ✨ 𝙕𝙀𝙉𝙄𝙏𝙎𝙐 𝘽𝙊𝙏 - 𝙈𝙐𝙎𝘼 」─╮',
      `│ 🪄 *Categoría:* ${category}`,
      '│ 🧭 *Origen:* waifu.pics (SFW)',
      `│ 🧩 *Rastreo:* ${traceId}`,
      '╰────────────────────╯',
      '',
      `*Consejo:* prueba otras musas: ${SFW_CATEGORIES.slice(0, 6).join(' · ')}`
    ].join('\n');

    await conn.sendMessage(jid, {
      image: { url: imageUrl },
      caption,
      contextInfo: {
        externalAdReply: {
          title: `Musa: ${category}`,
          body: 'Z E N I T S U — invocación segura',
          mediaType: 1,
          previewType: 'PHOTO',
          thumbnailUrl: 'https://qu.ax/MvYPM.jpg',
          sourceUrl: imageUrl,
          renderLargerThumbnail: false // ✅ Miniatura pequeña activada
        }
      }
    });
  } catch (err) {
    console.error(`[musa][${traceId}]`, err?.message || err);
    await conn.sendMessage(jid, {
      text: '*⚠️ Ritual interrumpido.*\n\n' +
            '> La musa no cruzó el umbral esta vez. Intenta otra categoría o más tarde.'
    });
  }
}

module.exports = {
  command: 'musa', // Uso: musa [categoria]
  handler
};