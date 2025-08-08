module.exports = {
    command: 'welcome',
    handler: async (conn, { message, args }) => {
        const { key, participant, remoteJid } = message.key;
        const from = remoteJid;
        const isGroup = from.endsWith('@g.us');

        if (!isGroup) {
            await conn.sendMessage(from, {
                text: '*😰 ¡Este comando solo funciona en grupos!*\n\n> Zenitsu no sabe cómo dar la bienvenida en privado...',
            });
            return;
        }

        if (args.length === 0 || !['on', 'off'].includes(args[0].toLowerCase())) {
            await conn.sendMessage(from, {
                text: '*📥 Uso correcto:*\n\n> `welcome on` para activar\n> `welcome off` para desactivar\n\nZenitsu necesita instrucciones claras 😳',
            });
            return;
        }

        const status = args[0].toLowerCase();

        try {
            const groupMetadata = await conn.groupMetadata(from);
            const admins = groupMetadata.participants.filter((p) => p.admin).map((p) => p.id);
            const isAdmin = admins.includes(participant) || participant === conn.user.id;

            if (!isAdmin) {
                await conn.sendMessage(from, {
                    text: '*😤 Solo los administradores pueden usar este comando.*\n\n> Zenitsu no quiere meterse en problemas...',
                });
                return;
            }

            const { setWelcomeStatus } = require('../main'); // Ajusta la ruta según tu estructura.

            setWelcomeStatus(from, status);

            const response = `
╭─「 👋 𝙈𝙀𝙉𝙎𝘼𝙅𝙀 𝘿𝙀 𝘽𝙄𝙀𝙉𝙑𝙀𝙉𝙄𝘿𝘼 」─╮
│ Estado: ${status === 'on' ? '✅ Activado' : '❌ Desactivado'}
│ Grupo: ${groupMetadata.subject}
╰────────────────────────────╯
`.trim();

            await conn.sendMessage(from, { text: response });
        } catch (err) {
            await conn.sendMessage(from, {
                text: '*❌ ¡Algo salió mal!*\n\n> Zenitsu se tropezó intentando cambiar el estado de bienvenida...',
            });
            console.error('Error en el comando welcome:', err.message);
        }
    }
};