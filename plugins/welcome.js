const config = require('../config');

/**
 * Simple welcome handler. Sends a welcome message when a new user joins a group.
 * @param {WASocket} conn
 * @param {string} groupId
 * @param {string[]} participants
 * @param {object} groupMetadata
 */
async function handleWelcome(conn, groupId, participants, groupMetadata) {
  try {
    if (config.WELCOME !== 'true') return;
    const subject = groupMetadata?.subject || 'this group';
    for (const user of participants) {
      const mention = [user];
      const name = user.split('@')[0];
      const text = `👋 Welcome @${name} to *${subject}*!`;
      await conn.sendMessage(groupId, { text, mentions: mention });
    }
  } catch (e) {
    console.error('welcome handler error', e);
  }
}

module.exports = { handleWelcome };