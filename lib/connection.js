/**
 * JAY-JAY MD Connection Module
 * This file provides a reference for WhatsApp connection configuration
 * The main connection logic is handled in index.js
 */

const config = require('../config');
const { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, Browsers } = require(config.BAILEYS);
const pino = require('pino');
const path = require('path');

/**
 * Creates a WhatsApp connection socket
 * @param {Object} authState - Authentication state from useMultiFileAuthState
 * @returns {Promise<Object>} WhatsApp socket connection
 */
async function createWAConnection(authState) {
    try {
        const { version } = await fetchLatestBaileysVersion();

        const sock = makeWASocket({
            version,
            auth: authState.state,
            printQRInTerminal: true,
            browser: Browsers.ubuntu('Chrome'),
            syncFullHistory: true,
            logger: pino({ level: 'warn' }),
            getMessage: async (key) => {
                return {
                    conversation: 'JAY-JAY MD Bot'
                };
            }
        });

        // Handle credentials update
        sock.ev.on('creds.update', authState.saveCreds);

        return sock;
    } catch (error) {
        console.error('Error creating WhatsApp connection:', error.message);
        throw error;
    }
}

/**
 * Initialize authentication state
 * @returns {Promise<Object>} Authentication state
 */
async function initializeAuth() {
    try {
        const sessionsPath = path.join(__dirname, '../sessions');
        const { state, saveCreds } = await useMultiFileAuthState(sessionsPath);
        return { state, saveCreds };
    } catch (error) {
        console.error('Error initializing authentication:', error.message);
        throw error;
    }
}

module.exports = {
    createWAConnection,
    initializeAuth
};
