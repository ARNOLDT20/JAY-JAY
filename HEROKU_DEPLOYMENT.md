# JAY-JAY MD - Heroku Deployment Guide

## Prerequisites

- [Heroku Account](https://www.heroku.com) (free tier available)
- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
- Git installed
- GitHub repository

## Quick Deployment (5 minutes)

### Step 1: Install Heroku CLI
```bash
# macOS
brew tap heroku/brew && brew install heroku

# Ubuntu/Linux
curl https://cli-assets.heroku.com/install.sh | sh

# Windows
# Download from: https://cli-assets.heroku.com/heroku-x64.exe
```

### Step 2: Login to Heroku
```bash
heroku login
# This opens a browser for authentication
```

### Step 3: Create Heroku App
```bash
cd your-jay-jay-project
heroku create your-app-name
```

### Step 4: Set Environment Variables
```bash
# Required
heroku config:set OWNER_NUMBER=263771166781
heroku config:set SESSION_ID=YOUR_SESSION_ID_HERE

# Optional but recommended
heroku config:set BOT_NAME="JAY-JAY MD"
heroku config:set PREFIX="."
heroku config:set MODE="public"
```

### Step 5: Deploy
```bash
git push heroku main
# Or if your main branch is different:
git push heroku master
```

### Step 6: Monitor Logs
```bash
heroku logs --tail
```

## Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| OWNER_NUMBER | ✅ Yes | Your WhatsApp number | 263771166781 |
| SESSION_ID | ❌ Optional | Bot session ID | Can be generated on first run |
| BOT_NAME | ❌ Optional | Display name | JAY-JAY MD |
| PREFIX | ❌ Optional | Command prefix | . |
| MODE | ❌ Optional | Bot mode | public/private/group/inbox |
| AUTO_STATUS_SEEN | ❌ Optional | Auto-mark statuses | true/false |
| AUTO_STATUS_REACT | ❌ Optional | Auto-react to statuses | true/false |
| ALWAYS_ONLINE | ❌ Optional | Show as always online | true/false |

## Getting SESSION_ID

If you need to generate a SESSION_ID:

1. **Option A: Interactive (First Run)**
   - Deploy without SESSION_ID
   - Check logs: `heroku logs --tail`
   - Look for QR code instructions
   - Scan with WhatsApp

2. **Option B: Get from Local**
   - Run locally: `npm start`
   - Scan QR code
   - When connected, copy SESSION_ID from logs
   - Set via: `heroku config:set SESSION_ID=your_session_id`

## Troubleshooting

### App Crashes Immediately
```bash
# Check logs for errors
heroku logs --tail

# Common issues:
# 1. Missing OWNER_NUMBER - set it!
# 2. Invalid SESSION_ID - clear it and regenerate
# 3. Module errors - try:
heroku run npm install
```

### "Cannot find module" Error
```bash
# Reinstall dependencies on Heroku
heroku run npm install --production
```

### Bot Disconnects Frequently
```bash
# Increase available memory
heroku ps:type standard-2x

# Enable keep-alive
heroku config:set KEEPALIVE_URL=https://your-app.herokuapp.com/keep-alive
```

### Application Crashed Error
Check dyno logs:
```bash
heroku logs --tail --dyno web.1
```

## Accessing Bot Data

### View Real-time Logs
```bash
heroku logs --tail
```

### Run Commands on Dyno
```bash
heroku run node index.js --exit
```

### Access File System
```bash
heroku run bash
# Then navigate and view files
```

## Useful Commands

```bash
# View all config variables
heroku config

# Update a config variable
heroku config:set VARIABLE_NAME=value

# Remove a config variable  
heroku config:unset VARIABLE_NAME

# View dyno status
heroku ps

# Restart dyno
heroku restart

# Stop dyno (saves money)
heroku ps:stop web

# Start dyno
heroku ps:start web

# View app info
heroku apps:info

# Delete app
heroku apps:destroy --app app-name
```

## Performance Tips

1. **Use Standard-2x Dyno** for better performance
   ```bash
   heroku ps:type standard-2x
   ```

2. **Enable Auto-restart**
   - Already enabled by default on Heroku

3. **Reduce Logging** in production
   ```bash
   heroku config:set SILENT=true
   ```

4. **Cache Dependencies**
   ```bash
   heroku config:set NPM_CACHE=true
   ```

## Costs

- **Free Dyno**: 1000 free dyno hours/month (apps go to sleep after 30 min inactivity)
- **Standard Dyno**: $50/month (always running)
- **Premium Dyno**: $250+/month (dedicated resources)

For a bot that needs to run 24/7, you'll need at least Standard dyno.

## Custom Domain

```bash
# Add custom domain
heroku domains:add www.example.com

# Update DNS records with your registrar
# pointing to: your-app.herokuapp.com
```

## Advanced: Using Docker

If you prefer Docker deployment:

```bash
# Login to Heroku Container Registry
heroku container:login

# Build and push
heroku container:push web

# Release
heroku container:release web

# View logs
heroku logs --tail
```

## Automatic Deployments from GitHub

1. Go to Heroku Dashboard
2. Select your app
3. Go to "Deploy" tab
4. Select "GitHub"
5. Connect your GitHub account
6. Select repository
7. Enable "Automatic Deploys" on main branch

Now every push to GitHub will auto-deploy!

## Security Best Practices

1. **Keep config variables secret**
   - Never commit .env to Git
   - Use `heroku config` to manage secrets

2. **Rotate SESSION_ID periodically**
   - Clear and re-authenticate every 30 days

3. **Monitor logs for errors**
   - `heroku logs --tail` regularly

4. **Enable 2FA on Heroku**
   - Account settings → Two-Factor Authentication

5. **Use PostgreSQL for data**
   - Instead of storing in files

## Getting Help

- Heroku Docs: https://devcenter.heroku.com
- Bot Issues: Check GitHub issues
- Logs: `heroku logs --tail --source app`

---

**Tips for Success:**
- Start with free tier to test
- Use a Standard dyno for production (24/7 uptime)
- Monitor costs with `heroku apps:info`
- Keep dependencies updated regularly
- Test locally before pushing to Heroku
