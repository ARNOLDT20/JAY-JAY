const config = require('../config');
const moment = require('moment-timezone');
const { cmd, commands } = require('../command');
const { getPrefix } = require('../lib/prefix');
const axios = require("axios");

process.on('unhandledRejection', console.error);

// Stylized uppercase
function toUpperStylized(str) {
  const stylized = {
    A: 'ᴀ', B: 'ʙ', C: 'ᴄ', D: 'ᴅ', E: 'ᴇ', F: 'ғ', G: 'ɢ', H: 'ʜ',
    I: 'ɪ', J: 'ᴊ', K: 'ᴋ', L: 'ʟ', M: 'ᴍ', N: 'ɴ', O: 'ᴏ', P: 'ᴘ',
    Q: 'ǫ', R: 'ʀ', S: 's', T: 'ᴛ', U: 'ᴜ', V: 'ᴠ', W: 'ᴡ', X: 'x',
    Y: 'ʏ', Z: 'ᴢ'
  };
  return str.split('').map(c => stylized[c.toUpperCase()] || c).join('');
}

const normalize = (str) => str.toLowerCase().replace(/\s+menu$/, '').trim();

const emojiByCategory = {
  ai: '🤖', anime: '🍥', audio: '🎧', bible: '📖',
  download: '⬇️', downloader: '📥', fun: '🎮', game: '🕹️',
  group: '👥', img_edit: '🖌️', info: 'ℹ️', logo: '🖼️',
  main: '🏠', media: '🎞️', misc: '📦', music: '🎵',
  owner: '👑', search: '🔎', settings: '⚙️',
  sticker: '🌟', tools: '🛠️', user: '👤',
  utilities: '🧰', wallpapers: '🖼️',
  whatsapp: '📱'
};

cmd({
  pattern: 'menu',
  alias: ['allmenu'],
  desc: 'Show all bot commands',
  category: 'menu',
  react: '👑',
  filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {

  try {

    const prefix = getPrefix();
    const timezone = config.TIMEZONE || 'Africa/Nairobi';
    const time = moment().tz(timezone).format('HH:mm:ss');
    const date = moment().tz(timezone).format('dddd, DD MMMM YYYY');

    const uptime = () => {
      let sec = process.uptime();
      let h = Math.floor(sec / 3600);
      let m = Math.floor((sec % 3600) / 60);
      let s = Math.floor(sec % 60);
      return `${h}h ${m}m ${s}s`;
    };

    let menu = `
╔═══════════════════════════════╗
║        👑  KING JAY MD  👑        ║
║      『  Royal Command Center  』      ║
╚═══════════════════════════════╝

┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 👤 User   : @${sender.split("@")[0]}
┃ ⚡ Runtime : ${uptime()}
┃ 🕒 Time    : ${time}
┃ 📅 Date    : ${date}
┃ 🔑 Prefix  : ${prefix}
┃ 👑 Owner   : ${config.OWNER_NAME}
┃ 📦 Plugins : ${commands.length}
┗━━━━━━━━━━━━━━━━━━━━━━━┛
`;

    // Group commands
    const categories = {};
    for (const command of commands) {
      if (command.category && !command.dontAdd && command.pattern) {
        const cat = normalize(command.category);
        categories[cat] = categories[cat] || [];
        categories[cat].push(command.pattern.split('|')[0]);
      }
    }

    for (const cat of Object.keys(categories).sort()) {
      const emoji = emojiByCategory[cat] || '✨';

      menu += `
╭───────────『 ${emoji} ${toUpperStylized(cat)} 』───────────╮`;

      for (const command of categories[cat].sort()) {
        menu += `\n│  ⌬  ${prefix}${command}`;
      }

      menu += `
╰──────────────────────────────╯
`;
    }

    menu += `
╔═══════════════════════════════╗
║  🌟 ${config.DESCRIPTION || 'Power • Speed • Perfection'} 🌟  ║
║        KING JAY MD  |  v3.0.0        ║
╚═══════════════════════════════╝
`;

    // Limit caption safely
    const MAX_CAPTION = 3900;
    if (menu.length > MAX_CAPTION) {
      menu = menu.slice(0, MAX_CAPTION) + "\n\n⚜️ Menu trimmed due to length...";
    }

    // Download image as buffer (FIX FOR BAILEYS)
    const imageBuffer = await axios
      .get("https://files.catbox.moe/pwublt.png", { responseType: "arraybuffer" })
      .then(res => res.data);

    await conn.sendMessage(
      from,
      {
        image: imageBuffer,
        caption: menu
      },
      { quoted: mek }
    );

  } catch (error) {
    console.log("MENU ERROR:", error);
    reply("❌ Menu failed to send.\n" + error.message);
  }
});