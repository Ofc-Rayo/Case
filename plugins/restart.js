const { cmd } = require("../command");
const { sleep } = require("../lib/functions");

module.exports = cmd({
    pattern: "restart",
    filename: __filename
},
async (conn, mek, m, { reply, isCreator }) => {
    try {
        if (!isCreator) {
            return reply("Solo el owner puede usar este comando.");
        }

        const { exec } = require("child_process");
        reply("Reiniciando...");
        await sleep(1500);
        exec("pm2 restart all");
    } catch (e) {
        console.error(e);
        reply(`${e}`);
    }
});