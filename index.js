const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, Browsers } = require('@whiskeysockets/baileys');
const config = require('./config');
const pino = require('pino');
const fs = require('fs');
const path = require('path');
const express = require('express');

const logger = pino({ level: 'fatal' });

class JAYJAYBot {
  constructor() {
    this.sock = null;
  }

  async start() {
    console.log('🚀 Starting JAY-JAY MD Bot...');
    
    try {
      const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, 'sessions'));
      const { version } = await fetchLatestBaileysVersion();
      
      this.sock = makeWASocket({
        auth: state,
        version,
        logger,
        printQRInTerminal: true,
        browser: Browsers.ubuntu('Chrome'),
      });

      this.sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'open') {
          console.log('✅ Bot connected successfully!');
          this.onConnected();
        } else if (connection === 'close') {
          const reason = lastDisconnect?.error?.output?.statusCode;
          if (reason === DisconnectReason.loggedOut) {
            console.log('❌ Logged out, restart required');
            process.exit(1);
          } else {
            this.start();
          }
        }
      });

      this.sock.ev.on('messages.upsert', async (m) => {
        if (m.type !== 'notify') return;
        
        for (const msg of m.messages) {
          if (!msg.message) continue;
          
          const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
          const sender = msg.key.fromMe ? this.sock.user.id : msg.key.participant;
          const chatId = msg.key.remoteJid;
          
          if (text.startsWith(config.PREFIX)) {
            this.handleCommand(chatId, text, sender);
          }
        }
      });

      this.sock.ev.on('creds.update', saveCreds);
    } catch (error) {
      console.error('❌ Connection error:', error.message);
      setTimeout(() => this.start(), 5000);
    }
  }

  onConnected() {
    const startup = `╭──────────────────╮
│ 🤖 JAY-JAY MD BOT 🤖 │
│ Successfully Connected
│ Prefix: ${config.PREFIX}
╰──────────────────╯`;
    console.log(startup);
  }

  async handleCommand(chatId, text, sender) {
    const args = text.slice(config.PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    try {
      if (command === 'ping') {
        await this.sock.sendMessage(chatId, { text: 'Pong! 🏓' });
      } else if (command === 'alive') {
        const uptime = process.uptime();
        const msg = `✅ Bot is alive!\nUptime: ${Math.floor(uptime)} seconds`;
        await this.sock.sendMessage(chatId, { text: msg });
      } else if (command === 'help') {
        const help = `Available commands:\n\n${config.PREFIX}ping - Check bot response\n${config.PREFIX}alive - Check bot status\n${config.PREFIX}help - Show this message`;
        await this.sock.sendMessage(chatId, { text: help });
      }
    } catch (error) {
      console.error('Command error:', error.message);
    }
  }
}

const bot = new JAYJAYBot();
bot.start();

// Express server for keep-alive
const app = express();
const port = process.env.PORT || 2050;

app.get('/', (req, res) => {
  res.status(200).json({ status: 'Bot is running' });
});

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});

process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  process.exit(0);
});
