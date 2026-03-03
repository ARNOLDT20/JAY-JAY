const { cmd, commands } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');
const config = require('../config');

cmd({
    pattern: "NYXtatus",
    alias: ["status", "live"],
    desc: "Check uptime and system status",
    category: "main",
    react: "🔮",
    filename: __filename
},
    async (conn, mek, m, { from, sender, reply }) => {
        try {
            await conn.sendMessage(from, { react: { text: '🔮', key: mek.key } });

            const totalCmds = commands.length;
            const uptime = () => {
                let sec = process.uptime();
                let h = Math.floor(sec / 3600);
                let m = Math.floor((sec % 3600) / 60);
                let s = Math.floor(sec % 60);
                return `${h}h ${m}m ${s}s`;
            };

            const responseTime = Date.now() - mek.messageTimestamp * 1000;

            // 🌟 BEAUTIFUL STATUS CARD
            const captionText = `
╔═══════════════╗
   🔮  NYX ᴍᴅ  🔮
╚═══════════════╝
╭───────────────────⟡
│ ⏱️ ʙᴏᴛ ᴜᴘᴛɪᴍᴇ : ${uptime()}
│ 👥 ᴀᴄᴛɪᴠᴇ ᴄʜᴀᴛs : ${Object.keys(conn.chats).length}
│ 👤 ʏᴏᴜʀ ɴᴜᴍʙᴇʀ : ${sender.split('@')[0]}
│ 🧩 ᴛᴏᴛᴀʟ ᴄᴍᴅs : ${totalCmds}
│ 💾 ᴍᴇᴍᴏʀʏ : ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB
│ 🚀 ᴠᴇʀsɪᴏɴ : ${config.version || '1.0.0'}
╰───────────────────⟡

╭═══════════════⟡
│ 🟢 sᴛᴀᴛᴜs : ᴏɴʟɪɴᴇ
│ ⚡ ʀᴇsᴘᴏɴsᴇ : ${responseTime} ms
│ 🧠 sʏsᴛᴇᴍ : sᴛᴀʙʟᴇ
╰═══════════════⟡

✨ *ɴʏx ᴍᴅ ɪs ᴀʟɪᴠᴇ & ʀᴇᴀᴅʏ!* ✨
`;

            const aliveMessage = {
                image: { url: "https://files.catbox.moe/pwublt.png" },
                caption: captionText,
                buttons: [
                    {
                        buttonId: `${config.PREFIX}menu_action`,
                        buttonText: { displayText: '📂 ᴍᴇɴᴜ ᴏᴘᴛɪᴏɴs' },
                        type: 4,
                        nativeFlowInfo: {
                            name: 'single_select',
                            paramsJson: JSON.stringify({
                                title: '✨ ᴄʜᴏᴏsᴇ ᴀɴ ᴀᴄᴛɪᴏɴ',
                                sections: [
                                    {
                                        title: `👑 NYX MD MAIN`,
                                        highlight_label: 'Quick Access',
                                        rows: [
                                            { title: '📋 ғᴜʟʟ ᴍᴇɴᴜ', description: 'ᴠɪᴇᴡ ᴀʟʟ ᴄᴏᴍᴍᴀɴᴅs', id: `${config.PREFIX}menu` },
                                            { title: '💓 ᴀʟɪᴠᴇ ᴄʜᴇᴄᴋ', description: 'ʀᴇғʀᴇsʜ sᴛᴀᴛᴜs', id: `${config.PREFIX}alive` },
                                            { title: '⚡ ᴘɪɴɢ ᴛᴇsᴛ', description: 'ᴄʜᴇᴄᴋ sᴘᴇᴇᴅ', id: `${config.PREFIX}ping` }
                                        ]
                                    },
                                    {
                                        title: "🔥 ᴘᴏᴘᴜʟᴀʀ ᴄᴍᴅs",
                                        highlight_label: 'Trending',
                                        rows: [
                                            { title: '🤖 ᴀɪ ᴄʜᴀᴛ', description: 'Chat with AI', id: `${config.PREFIX}ai Hello!` },
                                            { title: '🎵 ᴍᴜsɪᴄ sᴇᴀʀᴄʜ', description: 'Download music', id: `${config.PREFIX}song` },
                                            { title: '📰 ʟᴀᴛᴇsᴛ ɴᴇᴡs', description: 'Get news updates', id: `${config.PREFIX}news` }
                                        ]
                                    }
                                ]
                            })
                        }
                    },
                    { buttonId: `${config.PREFIX}bot_info`, buttonText: { displayText: 'ℹ️ ʙᴏᴛ ɪɴғᴏ' }, type: 1 },
                    { buttonId: `${config.PREFIX}bot_stats`, buttonText: { displayText: '📊 ʙᴏᴛ sᴛᴀᴛs' }, type: 1 }
                ],
                headerType: 1,
                viewOnce: true
            };

            await conn.sendMessage(from, aliveMessage, { quoted: mek });

        } catch (error) {
            console.error('Alive command error:', error);

            const uptime = () => {
                let sec = process.uptime();
                let h = Math.floor(sec / 3600);
                let m = Math.floor((sec % 3600) / 60);
                let s = Math.floor(sec % 60);
                return `${h}h ${m}m ${s}s`;
            };

            await conn.sendMessage(from, {
                image: { url: "https://files.catbox.moe/pwublt.png" },
                caption: `
╔═══════════════╗
   ⚠️  NYX ᴍᴅ  ⚠️
╚═══════════════╝
│ ⏱️ ᴜᴘᴛɪᴍᴇ : ${uptime()}
│ 🟢 sᴛᴀᴛᴜs : ᴏɴʟɪɴᴇ
│ 👤 ɴᴜᴍʙᴇʀ : ${sender.split('@')[0]}
╰───────────────────⟡

Type *${config.PREFIX}menu* to explore commands 👑
`
            }, { quoted: mek });
        }
    });
