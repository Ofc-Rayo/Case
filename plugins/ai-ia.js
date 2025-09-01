import axios from 'axios';

let handler = m => m;

handler.all = async function (m, { conn }) {
    let user = global.db.data.users[m.sender];
    let chat = global.db.data.chats[m.chat];

    m.isBot = m.id.startsWith('BAE5') && m.id.length === 16 
           || m.id.startsWith('3EB0') && (m.id.length === 12 || m.id.length === 20 || m.id.length === 22) 
           || m.id.startsWith('B24E') && m.id.length === 20;

    if (m.isBot || m.sender.includes('bot') || m.sender.includes('Bot')) return;

    const prefixRegex = new RegExp('^[' + (opts['prefix'] || '‎z/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.,\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']');
    if (prefixRegex.test(m.text)) return;

    let query = m.text;
    let username = m.pushName || "Usuario";

    let prompt = `
Eres MeguminBot 💥, el bot creado por David-Chian para WhatsApp. Estás aquí para entretener con humor, ayudarte a programar y responder preguntas. Siempre con un toque divertido. 🙃😂🎉
Usuario: ${username}
Mensaje: ${query}
`.trim();

    try {
        await this.sendPresenceUpdate('composing', m.chat);

        const res = await axios.get(`https://gokublack.xyz/ai/bard?text=${encodeURIComponent(query)}`);
        let reply = res.data?.result || res.data?.respuesta || res.data || "Lo siento, no entendí eso.";

        if (reply && reply.trim().length > 0) {
            await this.reply(m.chat, reply.trim(), m);
        }

    } catch (error) {
        console.error('❌ Error al procesar la respuesta:', error);
        await this.reply(m.chat, '😢 Ocurrió un error procesando tu mensaje.', m);
    }

    return true;
};

module.exports = handler;