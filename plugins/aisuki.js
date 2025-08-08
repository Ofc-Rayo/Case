const axios = require('axios');

async function handler(conn, { message, args }) {
    const query = args.join(' ');

    if (!query) {
        return conn.sendMessage(message.key.remoteJid, {
            text: '*😰 ¡Zenitsu está confundido!*\n\n> Por favor, dime qué imagen quieres que cree... ¡No me hagas pensar demasiado!',
        });
    }

    try {
        const promptText = query;
        const captionPrompt = `Responderás como ZenitsuBot, un bot de WhatsApp con alma temblorosa pero poderosa. Actuarás como si acabas de crear una imagen de: ${promptText}. Sé dramático, tierno y electrizante.`;

        const imageResponse = await axios.get(
            `https://eliasar-yt-api.vercel.app/api/ai/text2img?prompt=${encodeURIComponent(promptText)}`,
            { responseType: 'arraybuffer' }
        );

        if (imageResponse.status === 200) {
            const imageBuffer = Buffer.from(imageResponse.data, 'binary');

            const captionResponse = await axios.get(
                `https://eliasar-yt-api.vercel.app/api/chatgpt?text=hola&prompt=${encodeURIComponent(captionPrompt)}`
            );

            const caption = captionResponse.data?.status
                ? captionResponse.data.response || '*⚡ Aquí está la imagen... ¡No me desmayé esta vez!*'
                : '*⚡ Aquí está la imagen... ¡No me desmayé esta vez!*';

            await conn.sendMessage(message.key.remoteJid, {
                image: imageBuffer,
                caption: caption,
            });
        } else {
            await conn.sendMessage(message.key.remoteJid, {
                text: '*😭 Zenitsu no pudo generar la imagen...*\n\n> ¡Intenta de nuevo más tarde, por favor!',
            });
        }
    } catch (err) {
        console.log('💥 Error al procesar la solicitud:', err.message);
        console.error(err);
        await conn.sendMessage(message.key.remoteJid, {
            text: '*😵 ¡Algo salió mal!*\n\n> Zenitsu se tropezó con el código... Intenta otra vez más tarde.',
        });
    }
}

module.exports = {
    command: 'aisuki',
    handler,
};