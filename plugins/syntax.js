const fs = require('fs');
const path = require('path');

const handler = async (m, { conn, usedPrefix, command }) => {
    try {
        const pluginsDir = './plugins';
        const files = fs.readdirSync(pluginsDir).filter(file => file.endsWith('.js'));

        let response = `✧ *Revisión de Syntax Errors:*\n\n`;
        let hasErrors = false;

        for (const file of files) {
            try {
                require(path.resolve(pluginsDir, file));
            } catch (error) {
                hasErrors = true;
                const stackLines = error.stack ? error.stack.split('\n') : [];
                const errorLineMatch = stackLines[0]?.match(/:(\d+):\d+/);
                const errorLine = errorLineMatch ? errorLineMatch[1] : 'Desconocido';

                response += `⚠︎ *Error en:* ${file}\n\n> ● Mensaje: ${error.message}\n> ● Número de línea: ${errorLine}\n\n`;
            }
        }

        if (!hasErrors) {
            response += '❀ ¡Todo está en orden! No se detectaron errores de sintaxis';
        }

        await conn.reply(m.chat, response, m);
    } catch (err) {
        await conn.reply(m.chat, `⚠︎ Ocurrió un error: ${err.message}`, m);
    }
};

module.exports = {
    command: ['syntax', 'detectar'],
    handler,
    rowner: true
};