else if (comando === '.ia') {
  const query = args.slice(1).join(' ');
  if (!query) {
    return message.reply('😱 ¡¿Cómo que no escribiste nada?! ¡No puedo leer tu mente, baka! 😤');
  }

  message.channel.sendTyping();

  const fs = require('fs');
  const path = './zenitsuMemory.json';

  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, JSON.stringify({}));
  }

  let conversationHistory = JSON.parse(fs.readFileSync(path, 'utf8'));
  const userId = message.author.id;

  if (!conversationHistory[userId]) {
    conversationHistory[userId] = [
      {
        role: 'system',
        content: `Actúa como Zenitsu-Bot, un bot de Discord con personalidad exagerada, dramática y emocional. Grita, se queja, pero siempre responde con cariño y humor. Su creador es Carlos, a quien respeta como a un maestro del trueno.`
      }
    ];
  }

  conversationHistory[userId].push({ role: 'user', content: query });

  const conversationText = conversationHistory[userId]
    .map(msg =>
      msg.role === 'system' ? `⚙️ Sistema: ${msg.content}\n\n`
        : msg.role === 'user' ? `👤 Usuario: ${msg.content}\n\n`
          : `⚡ Zenitsu-Bot: ${msg.content}\n\n`
    ).join('');

  try {
    const https = require('https');
    const data = JSON.stringify({
      contents: [{ parts: [{ text: conversationText }] }]
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: '/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBrYQZ3s5IVrp-on-ewJON8Gj6ZoD_NWWI',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const responseJson = JSON.parse(responseData);
          const replyText = responseJson?.candidates?.[0]?.content?.parts?.[0]?.text;

          if (replyText) {
            conversationHistory[userId].push({ role: 'assistant', content: replyText });
            fs.writeFileSync(path, JSON.stringify(conversationHistory, null, 2));

            message.reply({
              embeds: [{
                color: 0xffcc00,
                title: '⚡ ¡Zenitsu-Bot ha hablado!',
                description: replyText,
                thumbnail: {
                  url: 'https://qu.ax/zenitsu.jpg' // Imagen con aura dramática
                },
                footer: {
                  text: '💛 Zenitsu está temblando... pero responde igual'
                }
              }]
            });
          } else {
            message.reply("😵 ¡Nooo! ¡La IA no dijo nada! ¡Estoy en pánico total!");
          }
        } catch (error) {
          message.reply(`💥 ¡Error al procesar la respuesta! ¡Esto es demasiado para mí! 😭\n> ${error.message}`);
        }
      });
    });

    req.on('error', (error) => {
      message.reply(`🔌 ¡No me pude conectar con la IA! ¡Estoy electrocutado de frustración! ⚡😫\n> ${error.message}`);
    });

    req.write(data);
    req.end();

  } catch (error) {
    message.reply(`🔥 ¡Todo se está derrumbando! ¡Carlos, sálvame! 😱\n> ${error.message}`);
  }
                                              }
