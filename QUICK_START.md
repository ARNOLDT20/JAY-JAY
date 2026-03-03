# 🚀 JAY-JAY MD - Quick Start Guide

Get your WhatsApp bot running in 5 minutes!

## ⚡ Quick Setup

### Step 1: Install & Setup (2 minutes)
```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env and add your info
```

### Step 2: Configure .env
Edit `.env` with your WhatsApp number:
```
OWNER_NUMBER=263771166781
OWNER_NAME=Your Name
PREFIX=.
BOT_NAME=JAY-JAY MD
```

**⚠️ Important**: Use WhatsApp number WITHOUT +, spaces, or country code prefix!

### Step 3: Start Bot
```bash
npm start
```

### Step 4: Scan QR Code (1 minute)
1. You'll see a QR code in terminal
2. Open **WhatsApp** → **Settings** → **Linked Devices** → **Link a Device**
3. Scan the QR code
4. Wait for: `✅ SESSION-ID CONNECTED 🙂`

✅ **Done!** Your bot is connected!

---

## 📱 Test Your Bot

Send a message to your WhatsApp account:
- `.alive` - Bot responds with status
- `.ping` - Shows response time
- `.help` - View all commands

---

## ❌ Troubleshooting

| Problem | Fix |
|---------|-----|
| QR Code won't scan | Restart bot, scan again |
| "Bad MAC" error | Delete `sessions/` folder, restart |
| Bot won't connect | Check OWNER_NUMBER is correct (no +) |
| Frequent disconnects | Check internet connection |

For detailed setup, see [CONNECTION_SETUP.md](CONNECTION_SETUP.md)

---

## 🔧 Common Commands

```bash
npm start          # Start the bot
npm stop           # Stop the bot (if using PM2)
npm restart        # Restart the bot (if using PM2)
```

---

## 📋 WhatsApp Number Format Examples

| Country | Example |
|---------|---------|
| Zimbabwe | 263771166781 |
| USA | 12015550123 |
| India | 919876543210 |
| UK | 441911123456 |
| Nigeria | 2348012345676 |

**Format**: Country code + national number (no + or spaces)

---

## 🌐 Cloud Deployment (Optional)

For deploying on Heroku/Railway:
1. Set all `.env` vars in platform settings
2. Push to Git
3. Platform auto-deploys

---

**Need help?** Check [CONNECTION_SETUP.md](CONNECTION_SETUP.md) for detailed troubleshooting!
