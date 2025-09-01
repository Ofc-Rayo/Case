const axios = require('axios');

let handler = async function (m, { conn }) {
    try {
        const query = m.text;
        if (!query) return;

        const res = await axios.get(`https://gokublack.xyz/ai/bard?text=${encodeURIComponent(query)}`);
        const reply = res?.data?.result?.response || 'No entendí eso...';

        await conn.reply(m.chat, reply.trim(), m);
    } catch (error) {
        console.error('❌ Error al obtener respuesta de la API:', error);
        await conn.reply(m.chat, '⚠️ Hubo un error al procesar tu mensaje. Intenta nuevamente más tarde.', m);
    }
};

module.exports = handler;