const { cmd, commands } = require('../command');
const config = require('../config');
const fs = require('fs');
const path = require('path');

// Lightweight environment/settings plugin
// Provides small set of settings commands (setprefix, mode, welcome, goodbye)

cmd({
    pattern: 'setprefix',
    alias: ['prefix'],
    react: '🔧',
    desc: "Change the bot's command prefix.",
    category: 'settings',
    filename: __filename,
}, async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply('*📛 Only the owner can use this command!*');
    const newPrefix = args[0];
    if (!newPrefix) return reply('❌ Please provide a new prefix. Example: `.setprefix !`');
    config.PREFIX = newPrefix;
    return reply(`✅ Prefix successfully changed to *${newPrefix}*`);
});

cmd({
    pattern: 'mode',
    alias: ['setmode'],
    desc: 'Set bot mode to private or public.',
    category: 'settings',
    filename: __filename,
}, async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply('❌ Only the bot owner can change the mode.');
    if (!args[0]) return reply(`Usage: .mode <public|private>\nCurrent mode: ${config.MODE}`);
    const wanted = args[0].toLowerCase();
    if (wanted !== 'public' && wanted !== 'private') return reply('❌ Use `public` or `private`');
    config.MODE = wanted;
    return reply(`✅ Bot mode updated to: ${wanted}`);
});

cmd({
    pattern: 'welcome',
    alias: ['welcomeset'],
    desc: 'Enable or disable welcome messages',
    category: 'settings',
    filename: __filename
}, async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply('*📛 Only the owner can use this command!*');
    const status = (args[0] || '').toLowerCase();
    if (status === 'on') { config.WELCOME = 'true'; return reply('✅ Welcome messages enabled.'); }
    if (status === 'off') { config.WELCOME = 'false'; return reply('✅ Welcome messages disabled.'); }
    return reply('Usage: .welcome on|off');
});

cmd({
    pattern: 'goodbye',
    alias: ['goodbyeset'],
    desc: 'Enable or disable goodbye messages',
    category: 'settings',
    filename: __filename
}, async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply('*📛 Only the owner can use this command!*');
    const status = (args[0] || '').toLowerCase();
    if (status === 'on') { config.GOODBYE = 'true'; return reply('✅ Goodbye messages enabled.'); }
    if (status === 'off') { config.GOODBYE = 'false'; return reply('✅ Goodbye messages disabled.'); }
    return reply('Usage: .goodbye on|off');
});

// Additional small helpers can be added here safely.
