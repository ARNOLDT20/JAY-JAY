const config = require('../config');
const { cmd } = require('../command');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const ytdl = require('ytdl-core');
const { ytsearch } = require('@dark-yasiya/yt-dl.js');

class SongDownloader {
    constructor() {
        this.tempDir = path.join(__dirname, '..', 'temp');
        this.ensureTempDir();
    }

    ensureTempDir() {
        if (!fs.existsSync(this.tempDir)) {
            fs.mkdirSync(this.tempDir, { recursive: true });
        }
    }

    cleanTempFiles() {
        try {
            const files = fs.readdirSync(this.tempDir);
            files.forEach(file => {
                if (file.endsWith('.mp3') || file.endsWith('.m4a')) {
                    const filePath = path.join(this.tempDir, file);
                    const stats = fs.statSync(filePath);
                    const age = Date.now() - stats.mtime.getTime();
                    // Delete files older than 1 hour
                    if (age > 3600000) {
                        fs.unlinkSync(filePath);
                    }
                }
            });
        } catch (e) {
            console.error('Error cleaning temp files:', e);
        }
    }

    async searchYouTube(query) {
        try {
            const search = await ytsearch(query);
            return search?.results?.[0];
        } catch (e) {
            console.error('YouTube search error:', e);
            return null;
        }
    }

    async downloadFromYouTube(url, quality = '128') {
        const apis = [
            {
                name: 'Cobalt API',
                url: 'https://api.cobalt.tools/api/json',
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: { url: url, aFormat: 'mp3', aQuality: quality },
                parseUrl: (data) => data?.url
            },
            {
                name: 'Vihanga API',
                url: `https://api.vihangayt.com/download?url=${encodeURIComponent(url)}&type=audio`,
                method: 'GET',
                headers: { 'User-Agent': 'Mozilla/5.0' },
                parseUrl: (data) => data?.url || data?.data?.url
            },
            {
                name: 'David API',
                url: `https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(url)}`,
                method: 'GET',
                parseUrl: (data) => data?.result?.downloadUrl || data?.url
            },
            {
                name: 'Malvin API',
                url: `https://apis-malvin.vercel.app/download/dlmp3?url=${encodeURIComponent(url)}`,
                method: 'GET',
                parseUrl: (data) => data?.result?.downloadUrl || data?.url
            }
        ];

        for (const api of apis) {
            try {
                console.log(`Trying ${api.name}...`);

                let response;
                if (api.method === 'POST') {
                    response = await axios.post(api.url, api.body, {
                        headers: api.headers,
                        timeout: 30000
                    });
                } else {
                    response = await axios.get(api.url, {
                        headers: api.headers,
                        timeout: 30000
                    });
                }

                const downloadUrl = api.parseUrl(response.data);
                if (downloadUrl) {
                    console.log(`Success with ${api.name}: ${downloadUrl}`);
                    return { url: downloadUrl, api: api.name };
                }
            } catch (e) {
                console.log(`${api.name} failed:`, e.message);
                continue;
            }
        }

        return null;
    }

    async downloadAudio(url, filename) {
        try {
            const response = await axios({
                url: url,
                method: 'GET',
                responseType: 'stream',
                timeout: 60000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });

            const filePath = path.join(this.tempDir, filename);
            const writer = fs.createWriteStream(filePath);

            response.data.pipe(writer);

            return new Promise((resolve, reject) => {
                writer.on('finish', () => resolve(filePath));
                writer.on('error', reject);
            });
        } catch (e) {
            console.error('Download error:', e);
            throw e;
        }
    }

    formatDuration(seconds) {
        if (!seconds || isNaN(seconds)) return 'Unknown';
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    formatViews(views) {
        if (!views || isNaN(views)) return 'Unknown';
        if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
        if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
        return views.toString();
    }
}

const downloader = new SongDownloader();

// Clean temp files on startup
downloader.cleanTempFiles();

cmd({
    pattern: "song",
    alias: ["music", "downloadsong", "mp3"],
    react: "🎵",
    desc: "Download songs from YouTube, Spotify, SoundCloud and more",
    category: "download",
    use: '.song <song name or URL>',
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        let input = q || (m.quoted && m.quoted.text?.trim());
        if (!input) {
            return reply("❌ *Please provide a song name or URL!*\n\n📝 *Examples:*\n.song Believer\n.song https://youtu.be/dQw4w9WgXcQ\n.song spotify:track:4iV5W9uYEdYUVa79Axb7Rh");
        }

        await reply("🔍 *Searching for your song...*");

        let videoInfo = null;
        let isDirectUrl = false;

        // Check if it's a direct YouTube URL
        if (input.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)) {
            isDirectUrl = true;
            try {
                const videoId = input.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)[1];
                const searchResult = await ytsearch(`https://youtu.be/${videoId}`);
                videoInfo = searchResult?.results?.[0];
            } catch (e) {
                return reply("❌ *Invalid YouTube URL!*");
            }
        } else {
            // Search for the song
            videoInfo = await downloader.searchYouTube(input);
        }

        if (!videoInfo || !videoInfo.url) {
            return reply("❌ *No results found! Try different keywords.*");
        }

        const title = videoInfo.title.replace(/[^\w\s.-]/gi, "").slice(0, 50);
        const duration = downloader.formatDuration(videoInfo.seconds);
        const views = downloader.formatViews(videoInfo.views);
        const author = videoInfo.author?.name || "Unknown Artist";
        const thumbnail = videoInfo.thumbnail;

        // Send song info
        await conn.sendMessage(from, {
            image: { url: thumbnail },
            caption: `╭───〔 🎵 SONG DOWNLOADER 〕───
│ 📝 *Title:* ${videoInfo.title}
│ 🎤 *Artist:* ${author}
│ ⏱️ *Duration:* ${duration}
│ 👁️ *Views:* ${views}
│ 🔗 *Source:* YouTube
╰────────────────────
🎧 *Downloading audio...*
⏳ *Please wait, this may take a moment*`.trim()
        }, { quoted: mek });

        // Download the audio
        const downloadResult = await downloader.downloadFromYouTube(videoInfo.url);
        if (!downloadResult) {
            return reply("❌ *Failed to download audio from all sources. Please try again later.*");
        }

        const filename = `${Date.now()}_${title.replace(/[^a-zA-Z0-9]/g, '_')}.mp3`;
        const filePath = await downloader.downloadAudio(downloadResult.url, filename);

        // Get file size
        const stats = fs.statSync(filePath);
        const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

        // Send the audio file
        await conn.sendMessage(from, {
            audio: { url: filePath },
            mimetype: 'audio/mpeg',
            fileName: `${title}.mp3`,
            caption: `╭───〔 ✅ DOWNLOAD COMPLETE 〕───
│ 📝 *Title:* ${videoInfo.title}
│ 🎤 *Artist:* ${author}
│ 📊 *Size:* ${fileSizeMB} MB
│ 🎵 *Quality:* 128kbps MP3
│ ⚡ *Source:* ${downloadResult.api}
╰────────────────────
🎉 *Enjoy your music!*`.trim()
        }, { quoted: mek });

        // Clean up the file after sending
        setTimeout(() => {
            try {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            } catch (e) {
                console.error('Error deleting temp file:', e);
            }
        }, 30000); // Delete after 30 seconds

    } catch (e) {
        console.error('Song download error:', e);
        reply(`❌ *Download failed:* ${e.message}`);
    }
});

// Song search command
cmd({
    pattern: "songsearch",
    alias: ["searchsong", "findsong"],
    react: "🔍",
    desc: "Search for songs on YouTube",
    category: "download",
    use: '.songsearch <song name>',
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        let query = q || (m.quoted && m.quoted.text?.trim());
        if (!query) {
            return reply("❌ *Please provide a song name to search!*");
        }

        await reply("🔍 *Searching for songs...*");

        const search = await ytsearch(query);
        if (!search?.results || search.results.length === 0) {
            return reply("❌ *No songs found!*");
        }

        let resultsText = "╭───〔 🎵 SONG SEARCH RESULTS 〕───\n";
        const results = search.results.slice(0, 10); // Show top 10 results

        results.forEach((song, index) => {
            const title = song.title.length > 40 ? song.title.substring(0, 37) + "..." : song.title;
            const duration = downloader.formatDuration(song.seconds);
            const views = downloader.formatViews(song.views);
            const author = song.author?.name || "Unknown";

            resultsText += `│ ${index + 1}. *${title}*\n`;
            resultsText += `│    🎤 ${author} • ⏱️ ${duration} • 👁️ ${views}\n│\n`;
        });

        resultsText += `╰────────────────────\n\n💡 *Use:* .song <number> or .song <song name>\n📝 *Example:* .song 1`;

        await conn.sendMessage(from, {
            text: resultsText
        }, { quoted: mek });

    } catch (e) {
        console.error('Song search error:', e);
        reply(`❌ *Search failed:* ${e.message}`);
    }
});

// Song info command
cmd({
    pattern: "songinfo",
    alias: ["musicinfo", "trackinfo"],
    react: "ℹ️",
    desc: "Get detailed information about a song",
    category: "download",
    use: '.songinfo <song name or URL>',
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        let input = q || (m.quoted && m.quoted.text?.trim());
        if (!input) {
            return reply("❌ *Please provide a song name or URL!*");
        }

        await reply("🔍 *Getting song information...*");

        let videoInfo = null;

        // Check if it's a YouTube URL
        if (input.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)) {
            const videoId = input.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)[1];
            const searchResult = await ytsearch(`https://youtu.be/${videoId}`);
            videoInfo = searchResult?.results?.[0];
        } else {
            videoInfo = await downloader.searchYouTube(input);
        }

        if (!videoInfo) {
            return reply("❌ *Song not found!*");
        }

        const duration = downloader.formatDuration(videoInfo.seconds);
        const views = downloader.formatViews(videoInfo.views);
        const uploadDate = videoInfo.uploadedAt || "Unknown";
        const description = videoInfo.description ? videoInfo.description.substring(0, 200) + "..." : "No description available";

        const infoText = `╭───〔 🎵 SONG INFORMATION 〕───
│ 📝 *Title:* ${videoInfo.title}
│ 🎤 *Artist:* ${videoInfo.author?.name || "Unknown"}
│ ⏱️ *Duration:* ${duration}
│ 👁️ *Views:* ${views}
│ 📅 *Uploaded:* ${uploadDate}
│ 🔗 *URL:* ${videoInfo.url}
├─〔 📋 Description 〕───
│ ${description}
├─〔 🎯 Actions 〕───
│ • .song ${videoInfo.title.substring(0, 30)}... (Download)
│ • .songsearch ${videoInfo.author?.name || "artist"} (More songs)
╰────────────────────`.trim();

        await conn.sendMessage(from, {
            image: { url: videoInfo.thumbnail },
            caption: infoText
        }, { quoted: mek });

    } catch (e) {
        console.error('Song info error:', e);
        reply(`❌ *Failed to get song info:* ${e.message}`);
    }
});