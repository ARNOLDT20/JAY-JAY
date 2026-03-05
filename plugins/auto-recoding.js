const fs = require('fs');
const path = require('path');
const config = require('../config')
const { cmd, commands } = require('../command')

const AUTO_SETTINGS_FILE = path.join(process.cwd(), 'store', 'auto_settings.json');

const readAutoSettings = () => {
  try {
    if (!fs.existsSync(AUTO_SETTINGS_FILE)) return { typing: {}, recording: {}, global: {} };
    const data = fs.readFileSync(AUTO_SETTINGS_FILE, 'utf8');
    return JSON.parse(data || '{}');
  } catch (e) {
    return { typing: {}, recording: {}, global: {} };
  }
};

const writeAutoSettings = (settings) => {
  try {
    const dir = path.dirname(AUTO_SETTINGS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(AUTO_SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf8');
  } catch (e) {
    console.error('Error writing auto settings:', e);
  }
};

//auto recording
cmd({
  on: "body"
},
  async (conn, mek, m, { from, body, isOwner }) => {
    try {
      const settings = readAutoSettings();
      const jid = from;
      const per = settings.recording && settings.recording[jid];
      const global = settings.global && settings.global.recording;
      const enabled = per ? per === 'true' : (global ? global === 'true' : config.AUTO_RECORDING === 'true');
      if (enabled) {
        try { await conn.sendPresenceUpdate('recording', from); } catch (e) { }
      }
    } catch (e) {
      console.error('auto-recording error:', e);
    }
  });

// Recording toggle command
cmd({
  pattern: "recording",
  desc: "Turn on/off auto-recording",
  react: "🎙️",
  category: "settings"
},
  async (conn, mek, m, { from, quoted, reply, isOwner, prefix, body }) => {
    try {
      if (!isOwner && !m.key.fromMe) return reply("❌ Owner only command!");

      const args = body.split(' ');
      const mode = args[1]?.toLowerCase();
      const target = args[2]?.toLowerCase() || 'personal';

      const settings = readAutoSettings();
      if (!settings.global) settings.global = {};
      if (!settings.recording) settings.recording = {};

      let message = '';

      if (mode === 'on' || mode === 'enable') {
        if (target === 'global') {
          settings.global.recording = 'true';
          message = '✅ *Global auto-recording enabled*';
        } else {
          settings.recording[from] = 'true';
          message = '✅ *Auto-recording enabled for this chat*';
        }
      } else if (mode === 'off' || mode === 'disable') {
        if (target === 'global') {
          settings.global.recording = 'false';
          message = '❌ *Global auto-recording disabled*';
        } else {
          settings.recording[from] = 'false';
          message = '❌ *Auto-recording disabled for this chat*';
        }
      } else {
        const personalStatus = settings.recording[from] || 'default';
        const globalStatus = settings.global.recording || 'default';
        message = `*Recording Status:*\n\n📍 *This Chat:* ${personalStatus}\n🌐 *Global:* ${globalStatus}\n\n_Usage: ${prefix}recording <on/off> [global]_`;
      }

      writeAutoSettings(settings);
      return reply(message);
    } catch (e) {
      console.error('recording command error:', e);
      return reply('❌ Error: ' + e.message);
    }
  });
