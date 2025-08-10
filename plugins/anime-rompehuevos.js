Este si funcionaba :
/*───────────────────────────────────────
  ⚡ Módulo:     zenitsu-rompehuevos.js
  🎭 Protagonista: Zenitsu Agatsuma
  🧠 Autor:      Carlos
  🛠 Proyecto:   Zenitsu Bot 
───────────────────────────────────────*/

const thumbnailUrl = 'https://qu.ax/QuwNu.jpg'; // Miniatura de Zenitsu

const contextInfo = {
  externalAdReply: {
    title: "⚡ Zenitsu - Ataque ancestral",
    body: "¡Golpe testicular con precisión anime!",
    mediaType: 1,
    previewType: 0,
    mediaUrl: "https://github.com/Kone457/Zenitsu-Bot",
    sourceUrl: "https://github.com/Kone457/Zenitsu-Bot",
    thumbnailUrl
  }
};

const handler = async (conn, { message }) => {
  const autor = message.key.participant || message.key.remoteJid;
  const mencionado = message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  const objetivo = mencionado || autor;
  const nombre = @${objetivo.split('@')[0]};

  // 🎬 Clips de impacto
  const gifs = [
    'https://sylphy.xyz/download/7KvKOn.mp4',
    'https://sylphy.xyz/download/eFyjep.mp4',
    'https://sylphy.xyz/download/TZj66W.mp4',
    'https://sylphy.xyz/download/U2x0S7.mp4'
  ];

  // 🗯️ Frases con atmósfera Zenitsu
  const frases = [
    ⚡ Zenitsu se armó de valor y le rompió los huevos a ${nombre},
    😱 ${nombre} fue víctima del miedo canalizado en forma de patada,
    🥚💥 ${nombre} recibió el golpe ancestral de un héroe tembloroso,
    🌀 ${nombre} no podrá olvidar el grito previo al impacto,
    🎯 Zenitsu apuntó... y ${nombre} ya no podrá reproducirse jamás,
    👺 ${nombre} fue neutralizado por el ataque más temido del escuadrón,
    🔥 El linaje de ${nombre} ha sido interrumpido por un rayo de cobardía heroica
  ];

  // Selección aleatoria
  const gifUrl = gifs[Math.floor(Math.random() * gifs.length)];
  const frase = frases[Math.floor(Math.random() * frases.length)];

  // Mensaje inicial
  await conn.sendMessage(message.key.remoteJid, {
    text: 🥚💥 ${nombre}, Zenitsu está temblando... pero va con todo ⚡,
    mentions: [objetivo],
    contextInfo
  }, { quoted: message });

  // Mensaje con video + frase
  await conn.sendMessage(message.key.remoteJid, {
    video: { url: gifUrl },
    gifPlayback: true,
    caption: frase,
    mentions: [objetivo],
    contextInfo
  }, { quoted: message });
};

module.exports = {
  command: 'rompehuevos',
  handler
};