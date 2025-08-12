const axios = require('axios');

module.exports = {
    command: 'clima',
    handler: async (conn, { message, args }) => {
        const from = message.key.remoteJid;
        const city = args.join(' ').trim() || 'Estados';
        const apiURL = `https://api.dorratz.com/v2/clima-s?city=${encodeURIComponent(city)}`;

        try {
            const response = await axios.get(apiURL);
            const data = response.data;

            if (data && data.weather) {
                const reply = `*🌩️ ZenitsuBOT - Clima en ${data.location}*\n\n` +
                    `🌍 *País:* ${data.country}\n` +
                    `🌦️ *Estado del cielo:* ${data.weather}\n` +
                    `🌡️ *Temperatura actual:* ${data.temperature}\n` +
                    `🔻 *Mínima esperada:* ${data.minimumTemperature}\n` +
                    `🔺 *Máxima esperada:* ${data.maximumTemperature}\n` +
                    `💧 *Humedad:* ${data.humidity}\n` +
                    `🌬️ *Viento:* ${data.wind}\n\n` +
                    `*😰 Zenitsu revisó el clima... ¡y sobrevivió para contarlo!*`;

                await conn.sendMessage(from, { text: reply });
            } else {
                await conn.sendMessage(from, {
                    text: '*😢 Zenitsu no pudo encontrar el clima...*\n\n> Tal vez el cielo está demasiado nublado para ver los datos.',
                });
            }
        } catch (err) {
            await conn.sendMessage(from, {
                text: '*❌ ¡Algo salió mal!*\n\n> Zenitsu se tropezó buscando el clima... ¿seguro que escribiste bien la ciudad?',
            });
            console.error('Error al obtener el clima:', err.message);
        }
    }
};
