# JAY-JAY MD Bot - Connection Setup Guide

## Prerequisites
- Node.js v20 or higher
- npm or yarn
- WhatsApp account
- A text editor

## Initial Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy the example env file and customize it:
```bash
cp .env.example .env
```

Edit `.env` with your settings:
```
OWNER_NUMBER=<your_whatsapp_number>
OWNER_NAME=<your_name>
BOT_NAME=JAY-JAY MD
PREFIX=.
```

**Important**: 
- Use the WhatsApp number WITHOUT country code prefix
- Example: Use `263771166781` instead of `+263771166781`
- Leave `SESSION_ID` empty on first run

### 3. Start the Bot
```bash
npm start
```

### 4. Scan QR Code
On first run, the bot will display a QR code in the terminal:
1. Open WhatsApp on your phone
2. Go to Settings → Linked Devices → Link a Device
3. Scan the QR code displayed in the terminal
4. Wait for the connection message to appear

### 5. Configure Owner Number
Once connected, the bot will save your session automatically.

## Troubleshooting Connection Issues

### Issue: "SESSION_ID is required for production deployment"
**Solution**: Set a proper OWNER_NUMBER in .env file before running in production

### Issue: QR Code Not Scanning
- Ensure WhatsApp is updated to the latest version
- Try clicking "Link a Device" again
- Make sure terminal window is still visible during scan
- Don't close the terminal while scanning

### Issue: "Bad MAC" or "Session Corrupted" Error
**Solution**: 
1. Delete the sessions folder contents
2. Delete SESSION_ID from .env (leave it empty)
3. Restart the bot and rescan the QR code

### Issue: "Connection Refused"
**Solution**:
- Check your internet connection
- Ensure no other WhatsApp connection is active
- Restart the bot
- Clear browser cache if using web WhatsApp

### Issue: Bot Disconnects Frequently
**Solution**:
- Check internet stability
- Reduce the number of plugins if performance is low
- Enable KEEPALIVE_URL if deploying on cloud
- Update Node.js to latest LTS version

## Configuration Key Settings

| Setting | Purpose | Default |
|---------|---------|---------|
| PREFIX | Command prefix | . |
| MODE | public/private/inbox/group | public |
| AUTO_TYPING | Show typing indicator | true |
| AUTO_STATUS_SEEN | Auto-mark statuses as seen | true |
| ANTI_LINK | Delete links in groups | true |
| WELCOME | Send welcome messages | true |

## Advanced Configuration

### Production Deployment (Heroku/Railway)
1. Set environment variables in platform dashboard
2. Include: OWNER_NUMBER, BOT_NAME, SESSION_ID
3. Deploy using git or web interface

### Keep-Alive for Cloud Deployment
Set KEEPALIVE_URL to keep bot active:
```
KEEPALIVE_URL=https://your-app-url/keep-alive
```

### Performance Optimization
- Disable unused plugins in the plugins directory
- Set AUTO_TYPING=false for faster responses
- Use SILENT=true to reduce console output

## Essential WhatsApp Numbers Format

For all WhatsApp numbers in config:
- Format: Country code + number (without + or spaces)
- Example (Zimbabwe): `263771166781`
- Example (US): `12015550123`
- Example (India): `919876543210`

## Support & Debugging

1. Check logs for error messages
2. Ensure all dependencies are installed: `npm install`
3. Verify Node version: `node --version` (should be >= 20)
4. Clear cache: `rm -rf sessions/*` (on Linux/Mac) or `rmdir /s sessions` (Windows)
5. Reinstall node_modules if issues persist: `npm cache clean --force && npm install`

## Common Commands After Connection

```
.alive - Check if bot is online
.ping - Get bot response time
.help - View all commands
.admin - Admin commands
.owner - Owner commands
```

Prefix (.) can be changed in config.

---

For more help, check the README.md or visit the GitHub repository.
