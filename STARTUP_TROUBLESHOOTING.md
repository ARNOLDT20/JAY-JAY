# JAY-JAY MD - Startup Troubleshooting Guide

## Heroku Crash: "Cannot find module" (2026-03-03 Error)

If you're seeing your bot crash on Heroku with module loading errors, here's how to fix it:

### ✅ What We Fixed

1. **Created `start.js` wrapper** - Pre-checks before loading main bot
2. **Updated `Procfile`** - Now uses `start.js` for better error handling
3. **Improved `Dockerfile`** - Better dependencies and health checks
4. **Added `.npmrc`** - Ensures proper npm configuration
5. **Updated `heroku.yml`** - Simplified Heroku configuration
6. **Created `runtime.txt`** - Specifies Node.js v20 for stability

### 🔧 How to Deploy the Fix

#### Option 1: Fresh Deploy (Recommended)
```bash
# Make sure all changes are committed
git add .
git commit -m "Fix bot startup and Heroku deployment"

# Push to Heroku
git push heroku main

# If you have an existing app, rebuild it
heroku destroy --app your-app-name --confirm
heroku create your-app-name

# Set config and deploy
heroku config:set OWNER_NUMBER=YOUR_NUMBER
git push heroku main
```

#### Option 2: Update Existing Deployment
```bash
# Just push the updated code
git push heroku main

# Rebuild if needed
heroku apps:rebuild

# Check logs
heroku logs --tail
```

## Common Issues & Solutions

### Issue: "ERROR: Cannot find module 'baileys'"

**Cause**: Baileys package not installed properly

**Solution**:
```bash
# Clean reinstall on Heroku
heroku run npm install --production

# Or rebuild the app
heroku apps:rebuild

# Or fully restart
heroku restart
```

### Issue: "❌ Missing required environment variables for production"

**Cause**: `SESSION_ID` or `OWNER_NUMBER` not set

**Solution**:
```bash
# Set required variables
heroku config:set OWNER_NUMBER=263771166781
heroku config:set SESSION_ID=your_session_id

# View what's set
heroku config

# Restart after setting
heroku restart
```

### Issue: "⚠️ Illegal arguments at Object.<anonymous>"

**Cause**: Obfuscated code has module loading issues

**Solution**:
1. First, try: `heroku run npm install --no-optional`
2. If that fails, completely rebuild:
   ```bash
   # Heroku rebuild from scratch
   heroku apps:rebuild
   ```

### Issue: "Invalid HTTP status 503" or dyno won't stay running

**Cause**: Bot crashes repeatedly after startup

**Solution**:
```bash
# Check detailed logs
heroku logs --tail --source app

# If it's a module issue:
heroku run npm install

# If it's config:
heroku config:set SESSION_ID=your_valid_session

# Force restart
heroku ps:restart
```

### Issue: "EACCES: permission denied"

**Cause**: File permission issues in filesystem

**Solution**:
```bash
# Heroku automatically handles permissions, but try:
heroku apps:rebuild

# If that doesn't work:
heroku destroy --confirm
heroku create new-app-name
# And redeploy from scratch
```

## Verification Checklist

After deploying, verify everything works:

✅ Check logs appear: `heroku logs --tail`
✅ See "✅ All critical modules loaded"
✅ See bot attempting to connect
✅ Check dyno is running: `heroku ps`
✅ App doesn't show "crashed" status

## What `start.js` Does

The new startup wrapper:
1. ✅ Loads `.env` variables
2. ✅ Detects production environment
3. ✅ Validates required config (OWNER_NUMBER)
4. ✅ Creates necessary directories
5. ✅ Pre-loads critical modules
6. ✅ Shows clear error messages if something's wrong
7. ✅ Skips interactive prompts on Heroku
8. ✅ Starts the main bot

## How to Monitor After Deployment

```bash
# Real-time logs
heroku logs --tail

# Last 100 lines
heroku logs -n 100

# Filter by source
heroku logs --source app
heroku logs --source heroku
heroku logs --source router

# Save logs to file
heroku logs > bot-logs.txt

# Get dyno status
heroku ps

# Get detailed app info
heroku apps:info
```

## Performance Monitoring

```bash
# View resource usage
heroku logs | grep -i "memory\|cpu"

# Upgrade dyno if needed
heroku ps:type standard-2x

# Scale dynos (for high traffic)
heroku ps:scale web=2
```

## Advanced Debugging

If you still have issues, get more details:

```bash
# Release logs
heroku releases

# View specific release
heroku releases:info v{number}

# Check buildpack logs
heroku logs --dyno=build

# Get everything
heroku logs --tail --dyno=web.1 --dyno=build
```

## Asking for Help

If you post an issue, include:

1. Full error from `heroku logs --tail` (last 20 lines)
2. Your Heroku config (without SESSION_ID): `heroku config`
3. Node version: `heroku run node --version`
4. npm version: `heroku run npm --version`

## Quick Fix Script

Try this if you're in a hurry:

```bash
#!/bin/bash

echo "🔧 Quick Bot Fix..."

# 1. Clean install
echo "Reinstalling dependencies..."
heroku run npm install --no-optional

# 2. Verify config
echo "Checking configuration..."
heroku config

# 3. Restart
echo "Restarting bot..."
heroku restart

# 4. Check logs
echo "Checking logs..."
heroku logs --tail -n 50
```

## Prevention Tips

1. **Always test locally first**
   ```bash
   npm install
   npm start
   ```

2. **Commit clean code**
   ```bash
   git status  # Check for uncommitted changes
   git add .
   git commit -m "message"
   ```

3. **Use staging app for testing**
   ```bash
   heroku create your-app-staging
   git push heroku-staging main
   ```

4. **Automate with GitHub**
   - Enable Heroku auto-deploys from main branch
   - Set up review apps for pull requests

5. **Monitor regularly**
   ```bash
   # Add to cron job or alias
   alias bot-logs='heroku logs --tail'
   ```

## When All Else Fails

Nuclear option (complete restart):

```bash
# 1. Backup any important data/sessions
heroku run bash
# Inside:
# tar -czf backup.tar.gz sessions/
# exit

# 2. Delete everything
heroku destroy --app your-app-name --confirm

# 3. Fresh start
heroku create your-app-name
heroku config:set OWNER_NUMBER=YOUR_NUMBER
git push heroku main

# 4. Check if it works
heroku logs --tail
```

---

**Remember**: The bot needs:
- ✅ OWNER_NUMBER set (required)
- ✅ Working internet connection
- ✅ WhatsApp account not logged into other devices
- ✅ Dyno type with enough memory (at least Standard-1x)

See [HEROKU_DEPLOYMENT.md](HEROKU_DEPLOYMENT.md) for full deployment guide.
