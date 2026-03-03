#!/usr/bin/env node

/**
 * JAY-JAY MD Bot - Startup Wrapper
 * Handles environment setup and error management
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
if (fs.existsSync('.env')) {
    require('dotenv').config({ path: '.env' });
}

// Check production environment
const isProduction =
    process.env.NODE_ENV === 'production' ||
    process.env.DYNO ||
    process.env.HEROKU_APP_NAME ||
    process.env.CF_PAGES ||
    process.env.RAILWAY_ENVIRONMENT_NAME;

// Validate required config for production
if (isProduction) {
    const requiredVars = ['SESSION_ID', 'OWNER_NUMBER'];
    const missing = requiredVars.filter(v => !process.env[v]);

    if (missing.length > 0) {
        console.error(`❌ Missing required environment variables for production: ${missing.join(', ')}`);
        console.error('Please set these variables in your deployment platform.');
        process.exit(1);
    }
}

// Prevent readline prompts on non-TTY environments
if (!process.stdin.isTTY && isProduction) {
    // Force skip interactive session setup on Heroku
    process.env.SESSION_READY = 'true';
}

// Safe module loader with retry logic
function safeRequire(moduleName, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            return require(moduleName);
        } catch (error) {
            if (i === retries - 1) {
                console.error(`❌ Failed to load module: ${moduleName}`);
                console.error(`Error: ${error.message}`);
                if (moduleName === '@whiskeysockets/baileys') {
                    console.error('Try running: npm install @whiskeysockets/baileys');
                }
                throw error;
            }
            console.warn(`⚠️  Retry ${i + 1}/${retries} for module: ${moduleName}`);
        }
    }
}

// Pre-flight checks
console.log('🚀 Starting JAY-JAY MD Bot...\n');

// Verify critical directories exist
const directories = ['./sessions', './plugins', './lib', './data'];
for (const dir of directories) {
    if (!fs.existsSync(dir)) {
        console.log(`📁 Creating directory: ${dir}`);
        fs.mkdirSync(dir, { recursive: true });
    }
}

// Verify config.js exists
if (!fs.existsSync('./config.js')) {
    console.error('❌ config.js not found!');
    console.error('Please ensure all project files are present.');
    process.exit(1);
}

// Now start the main bot
console.log('📦 Loading bot modules...');

try {
    // Test critical module loads
    safeRequire('dotenv');
    safeRequire('express');
    safeRequire('axios');
    safeRequire('@whiskeysockets/baileys');

    console.log('✅ All critical modules loaded\n');

    // Start the main index.js
    require('./index.js');
} catch (error) {
    console.error('\n❌ Fatal Error During Startup:');
    console.error(error.message);
    console.error('\nStack trace:');
    console.error(error.stack);

    console.error('\n⚠️  Troubleshooting Tips:');
    console.error('1. Run: npm install --no-optional');
    console.error('2. Delete node_modules and package-lock.json, then reinstall');
    console.error('3. Ensure Node.js v20+ is installed');
    console.error('4. Check that SESSION_ID and OWNER_NUMBER are set');

    process.exit(1);
}
