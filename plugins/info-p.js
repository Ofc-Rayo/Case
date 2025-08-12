const os = require('os');
const si = require('systeminformation');
const { performance } = require('perf_hooks');

async function handler(conn, { message }) {
    try {
        async function getSystemInfo() {
            const disk = await si.fsSize();
            const memInfo = await si.mem();
            const load = await si.currentLoad();
            const cpus = os.cpus();

            let timestamp = performance.now();
            let latency = performance.now() - timestamp;

            return {
                latencia: `${latency.toFixed(4)} ms`,
                plataforma: os.platform(),
                núcleosCPU: cpus.length,
                modeloCPU: cpus[0].model,
                arquitectura: os.arch(),
                versiónSistema: os.release(),
                procesosActivos: os.loadavg()[0].toFixed(2),
                cpuUsada: `${load.currentLoad.toFixed(2)}%`,
                ramUsada: `${(memInfo.used / (1024 ** 3)).toFixed(2)} GB`,
                ramTotal: `${(memInfo.total / (1024 ** 3)).toFixed(2)} GB`,
                ramLibre: `${(memInfo.free / (1024 ** 3)).toFixed(2)} GB`,
                ramPorcentaje: `${((memInfo.used / memInfo.total) * 100).toFixed(2)}%`,
                discoTotal: `${(disk[0].size / (1024 ** 3)).toFixed(2)} GB`,
                discoLibre: `${(disk[0].available / (1024 ** 3)).toFixed(2)} GB`,
                uptime: `${Math.floor(os.uptime() / 86400)}d ${Math.floor((os.uptime() % 86400) / 3600)}h ${Math.floor((os.uptime() % 3600) / 60)}m`,
                cargaPromedio: os.loadavg().map((avg, i) => `${i + 1}min: ${avg.toFixed(2)}`).join(', '),
                hora: new Date().toLocaleString(),
                ruta: process.cwd(),
                node: process.version,
            };
        }

        const data = await getSystemInfo();

        const cuadro = `
╭─「 ⚙️ 𝙄𝙉𝙁𝙊 𝙎𝙄𝙎𝙏𝙀𝙈𝘼 」─╮
│ 🕒 Hora: ${data.hora}
│ 🌐 Latencia: ${data.latencia}
│ 💻 Plataforma: ${data.plataforma}
│ 🖥️ CPU: ${data.modeloCPU}
│ ⚡ Núcleos: ${data.núcleosCPU}
│ 🏗️ Arquitectura: ${data.arquitectura}
│ 🧠 CPU usada: ${data.cpuUsada}
│ 📊 Procesos: ${data.procesosActivos}
│ 💾 RAM: ${data.ramUsada} / ${data.ramTotal} (${data.ramPorcentaje})
│ 🧹 RAM libre: ${data.ramLibre}
│ 💿 Disco: ${data.discoLibre} / ${data.discoTotal}
│ ⏳ Uptime: ${data.uptime}
│ 📈 Carga: ${data.cargaPromedio}
│ 📂 Ruta: ${data.ruta}
│ 🔧 Node.js: ${data.node}
╰────────────────────╯
`.trim();

        await conn.sendMessage(message.key.remoteJid, {
            text: cuadro
        }, {
            quoted: message,
            ephemeralExpiration: 24 * 60 * 100,
            disappearingMessagesInChat: 24 * 60
        });

    } catch (err) {
        console.error("Error al obtener la información del sistema:", err.message);
        await conn.sendMessage(message.key.remoteJid, {
            text: '*❌ Error al obtener la información del sistema.* Intenta más tarde.',
        });
    }
}

module.exports = {
    command: 'p',
    handler,
};
