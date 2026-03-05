const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');
const os = require('os');

cmd({
    pattern: "ping",
    alias: ["speed", "pong", "ping2"],
    desc: "Check bot's response time and system stats.",
    category: "main",
    react: "⚡",
    filename: __filename
},
    async (conn, mek, m, { from, quoted, sender, reply }) => {
        try {
            // Record start time when command is triggered
            const start = Date.now();
            
            // Send initial ping message
            const loading = await conn.sendMessage(from, { text: '*⚡ Pinging...*' });

            // Record time after message is sent
            const end = Date.now();
            const latency = end - start;

            // Get system info
            const up = runtime(process.uptime());
            const mem = process.memoryUsage();
            const usedMB = (mem.heapUsed / 1024 / 1024).toFixed(2);
            const totalMB = (mem.heapTotal / 1024 / 1024).toFixed(2);
            const cpuUsage = ((mem.heapUsed / mem.heapTotal) * 100).toFixed(2);

            const platform = `${os.type()} ${os.arch()}`;
            const cpus = os.cpus()[0].model;
            const cores = os.cpus().length;

            const emoji = ['🚀', '🌟', '💫', '🔥'][Math.floor(Math.random() * 4)];
            
            const responseMsg = `⚡ *PONG!* ${emoji}

╭─ *RESPONSE TIME* ⏱️
│ Latency: ${latency}ms
│ Status: ${latency < 100 ? '✅ Excellent' : latency < 500 ? '👍 Good' : '⚠️ Slow'}
├─ *SYSTEM INFO* 💻
│ Uptime: ${up}
│ Memory: ${usedMB}/${totalMB} MB (${cpuUsage}%)
│ Platform: ${platform}
│ CPU: ${cpus}
│ Cores: ${cores}
├─ *BOT INFO* 🤖
│ Name: ${config.BOT_NAME}
│ Owner: ${config.OWNER_NAME}
╰─ JAY-JAY MD Powered 🔥`;

            // Edit the message with actual ping response
            await conn.sendMessage(from, {
                image: { url: config.MENU_IMAGE_URL },
                caption: responseMsg,
                contextInfo: { mentionedJid: [sender] }
            }, { quoted: loading }).catch(() => {
                // Fallback to text only if image fails
                conn.sendMessage(from, { text: responseMsg }, { quoted: loading }).catch(() => { });
            });

        } catch (e) {
            console.error("Error in ping command:", e);
            reply(`❌ An error occurred: ${e.message}`);
        }
    });
