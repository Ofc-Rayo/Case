module.exports = {
    name: 'setprefix',
    description: 'Cambia el prefijo del bot',
    usage: 'setprefix <nuevo_prefijo>',
    async execute(client, message, args) {
        // Verifica que el usuario ingresó un nuevo prefijo
        if (!args[0]) {
            return client.sendMessage(message.chat, {
                text: `🔧 Usa el comando así: *${global.prefix[0]}setprefix <nuevo_prefijo>*`
            });
        }

        const nuevoPrefijo = args[0];

        // Validación opcional del prefijo (por ejemplo: no más de 3 caracteres)
        if (nuevoPrefijo.length > 3) {
            return client.sendMessage(message.chat, {
                text: `❌ El prefijo no puede tener más de 3 caracteres.`
            });
        }

        // Cambia el prefijo global
        global.prefix[0] = nuevoPrefijo;

        return client.sendMessage(message.chat, {
            text: `✅ Prefijo cambiado a: *${global.prefix[0]}*`
        });
    }
};