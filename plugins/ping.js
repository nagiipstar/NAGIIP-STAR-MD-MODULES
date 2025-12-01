const os = require('os');
const settings = require('../settings.js');

function formatTime(seconds) {
    const days = Math.floor(seconds / (24 * 60 * 60));
    seconds = seconds % (24 * 60 * 60);
    const hours = Math.floor(seconds / (60 * 60));
    seconds = seconds % (60 * 60);
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);

    let time = '';
    if (days > 0) time += `${days}d `;
    if (hours > 0) time += `${hours}h `;
    if (minutes > 0) time += `${minutes}m `;
    if (seconds > 0 || time === '') time += `${seconds}s`;

    return time.trim();
}

function getSpeedEmoji(ping) {
    if (ping < 100) return '🟢';
    if (ping < 300) return '🟡';
    return '🔴';
}

function getSpeedStatus(ping) {
    if (ping < 100) return '𝗙𝗮𝘀𝘁';
    if (ping < 300) return '𝗠𝗲𝗱𝗶𝘂𝗺';
    return '𝗦𝗹𝗼𝘄';
}

async function pingCommand(sock, chatId, message) {
    try {
        const start = Date.now();
        await sock.sendMessage(chatId, { text: '🏓 𝗣𝗶𝗻𝗴𝗶𝗻𝗴...' }, { quoted: message });
        const end = Date.now();
        const ping = Math.round((end - start) / 2);

        const uptimeInSeconds = process.uptime();
        const uptimeFormatted = formatTime(uptimeInSeconds);
        const speedEmoji = getSpeedEmoji(ping);
        const speedStatus = getSpeedStatus(ping);
        
        const cpuUsage = os.loadavg()[0].toFixed(2);
        const totalMem = (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2);
        const freeMem = (os.freemem() / (1024 * 1024 * 1024)).toFixed(2);
        const usedMem = (totalMem - freeMem).toFixed(2);
        const memPercent = ((usedMem / totalMem) * 100).toFixed(1);

        const botInfo = `
╭─────────────────────╮
│  🚀 𝐏𝐎𝐍𝐆! 𝐒𝐏𝐄𝐄𝐃 𝐓𝐄𝐒𝐓
├─────────────────────┤
│ ${speedEmoji} 𝗦𝗽𝗲𝗲𝗱: ${ping}𝗺𝘀 (${speedStatus})
│ ⏱️ 𝗨𝗽𝘁𝗶𝗺𝗲: ${uptimeFormatted}
│ 📦 𝗩𝗲𝗿𝘀𝗶𝗼𝗻: 𝘃${settings.version}
├─────────────────────┤
│  💻 𝐒𝐘𝐒𝐓𝐄𝐌 𝐒𝐓𝐀𝐓𝐒
├─────────────────────┤
│ 🖥️ 𝗖𝗣𝗨: ${cpuUsage}%
│ 💾 𝗥𝗔𝗠: ${usedMem}/${totalMem}𝗚𝗕
│ 📊 𝗠𝗲𝗺𝗼𝗿𝘆: ${memPercent}%
╰─────────────────────╯

  🤖 𝗡𝗔𝗚𝗜𝗜𝗣 𝗦𝗧𝗔𝗥 𝗠𝗗`;

        await sock.sendMessage(chatId, { text: botInfo.trim() }, { quoted: message });

    } catch (error) {
        console.error('Error in ping command:', error);
        await sock.sendMessage(chatId, { text: '❌ Failed to get bot status.' });
    }
}

module.exports = pingCommand;
