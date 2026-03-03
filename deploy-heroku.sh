#!/bin/bash

# JAY-JAY MD - Heroku Deployment Setup Script
# Run this in your project directory to prepare for Heroku deployment

echo "🚀 JAY-JAY MD - Heroku Deployment Setup"
echo "======================================\n"

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI not found. Please install it first:"
    echo "   https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Git repository not found. Initialize with: git init"
    exit 1
fi

echo "✅ Prerequisites check passed\n"

# Login to Heroku
echo "📝 Logging in to Heroku..."
heroku login

# Create app
read -p "Enter app name (or leave blank for auto-generated): " APP_NAME

if [ -z "$APP_NAME" ]; then
    echo "Creating app with default name..."
    heroku create
else
    echo "Creating app: $APP_NAME"
    heroku create $APP_NAME
fi

echo "\n📋 Setting environment variables..."
echo "You'll need to provide:"
echo "  - SESSION_ID (can be left empty for interactive setup)"
echo "  - OWNER_NUMBER (WhatsApp number, e.g., 263771166781)"

read -p "Enter OWNER_NUMBER: " OWNER_NUMBER
read -p "Enter SESSION_ID (or leave blank): " SESSION_ID

heroku config:set OWNER_NUMBER=$OWNER_NUMBER
[ ! -z "$SESSION_ID" ] && heroku config:set SESSION_ID=$SESSION_ID

# Set other useful configs
heroku config:set BOT_NAME="JAY-JAY MD"
heroku config:set PREFIX="."
heroku config:set MODE="public"

echo "\n📦 Building and deploying..."
git push heroku main

echo "\n✅ Deployment complete!"
echo "\n📊 View logs with: heroku logs --tail"
echo "🔧 Manage config with: heroku config"
echo "⏸️  Scale dynos with: heroku ps:scale web=1"
echo "\nApp URL: $(heroku apps:info -j | grep -o '"web_url":"[^"]*' | cut -d'"' -f4)"
