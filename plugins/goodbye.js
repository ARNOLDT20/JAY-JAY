const config = require('../config');

/**
 * Simple goodbye handler. Sends a goodbye message when a user leaves a group.
 * @param {WASocket} conn
 * @param {string} groupId
 * @param {string[]} participants
 * @param {object} groupMetadata
 */
async function handleGoodbye(conn, groupId, participants, groupMetadata) {
  try {
    if (config.GOODBYE !== 'true') return;
    const subject = groupMetadata?.subject || 'this group';
    for (const user of participants) {
      const mention = [user];
      const name = user.split('@')[0];
      const text = `👋 Goodbye @${name}! We'll miss you in *${subject}*.`;
      await conn.sendMessage(groupId, { text, mentions: mention });
    }
  } catch (e) {
    console.error('goodbye handler error', e);
  }
}

module.exports = { handleGoodbye };