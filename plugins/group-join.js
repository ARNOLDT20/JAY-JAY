const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../lib/functions')

cmd({
    pattern: "join",
    react: "📬",
    alias: ["joinme", "f_join"],
    desc: "To Join a Group from Invite link",
    category: "group",
    use: '.join < Group Link >',
    filename: __filename
}, async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isCreator, isDev, isAdmins, reply }) => {
    try {
        const msr = {
            own_cmd: "❌ Only group admins or owner can use this command."
        };

        // Only allow admins or creator
        if (!isAdmins && !isCreator) return reply(msr.own_cmd);

        // If there's no input, check if the message is a reply with a link
        if (!q && !quoted) return reply("*Please write the Group Link*️ 🖇️");

        let groupLink;

        // If the message is a reply to a group invite link
        if (quoted && quoted.type === 'conversation' && isUrl(quoted.text)) {
            groupLink = quoted.text.split('https://chat.whatsapp.com/')[1];
        } else if (q && isUrl(q)) {
            // If the user provided the link in the command
            groupLink = q.split('https://chat.whatsapp.com/')[1];
        }

        if (!groupLink) return reply("❌ *Invalid Group Link* 🖇️");

        try {
            // Accept the group invite
            await conn.groupAcceptInvite(groupLink);
            await conn.sendMessage(from, { text: `✔️ *Successfully Joined*` }, { quoted: mek });
        } catch (joinError) {
            const errorMsg = joinError.message || joinError.toString();

            if (errorMsg.includes('bad-request')) {
                return reply("⚠️ *Bot is already a member of this group or the link is invalid!*");
            } else if (errorMsg.includes('not-found')) {
                return reply("❌ *Group not found! The link may be expired.*");
            } else if (errorMsg.includes('forbidden') || errorMsg.includes('forbidden-request')) {
                return reply("🚫 *bot is banned from this group or doesn't have permission to join.*");
            } else {
                return reply(`❌ *Failed to join group:*\n${errorMsg}`);
            }
        }

    } catch (e) {
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        console.log(e);
        reply(`❌ *Error Occurred!!*\n\n${e}`);
    }
});
