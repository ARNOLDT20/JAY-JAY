const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: 'tiny',
    alias: ['short', 'shorturl'],
    react: '🫧',
    desc: 'Makes URL tiny.',
    category: 'convert',
    use: '<url>',
    filename: __filename,
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return reply('*🏷️ Please provide a link.*\n\nExample: .tiny https://example.com');
        let link = q.toString();
        if (!/^https?:\/\//i.test(link)) link = `http://${link}`;
        const encoded = encodeURIComponent(link);
        const response = await axios.get(`https://tinyurl.com/api-create.php?url=${encoded}`);
        const shortenedUrl = response.data;
        if (!shortenedUrl || typeof shortenedUrl !== 'string') return reply('Failed to shorten the provided URL. Try again later.');

        const buttons = [
            { buttonId: 'id1', buttonText: { displayText: '📋 Copy URL' }, type: 1 },
            { buttonId: 'id2', buttonText: { displayText: '🔗 Visit' }, type: 1 }
        ];

        const message = {
            text: `*🛡️ YOUR SHORTENED URL*\n\n🔗 Original: ${link}\n\n✂️ Shortened: ${shortenedUrl}`,
            footer: '✨ NYX-XD URL Shortener',
            buttons,
            headerType: 1
        };

        await conn.sendMessage(from, message, { quoted: mek });
    } catch (e) {
        console.error('Error shortening URL:', e);
        return reply('An error occurred while shortening the URL. Please try again.');
    }
});
