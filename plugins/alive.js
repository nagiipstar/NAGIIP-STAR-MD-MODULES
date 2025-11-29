const settings = require("../settings");
async function aliveCommand(sock, chatId, message) {
    try {
        const message1 = `*🤖 𝗡𝗔𝗚𝗜𝗜𝗣 𝗠𝗗 𝗕𝗢𝗧 𝗶𝘀 𝗔𝗰𝘁𝗶𝘃𝗲*\n\n` +
                       `*𝗩𝗲𝗿𝘀𝗶𝗼𝗻:* ${settings.version}\n` +
                       `*𝗦𝘁𝗮𝘁𝘂𝘀:* Online\n` +
                       `*𝗠𝗼𝗱𝗲:* Public\n\n` +
                       `*🍁 𝗙𝗲𝗮𝘂𝘁𝘂𝗿𝗲𝘀:*\n` +
                       `• 𝗚𝗿𝗼𝘂𝗹 𝗠𝗮𝗻𝗮𝗴𝗲𝗺𝗲𝗻𝘁\n` +
                       `• 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱 𝗠𝗲𝗻𝘂\n` +
                       `• 𝗢𝘄𝗻𝗲𝗿 𝗠𝗲𝗻𝘂\n` +
                       `• 𝗜𝗠𝗚 𝗠𝗲𝗻𝘂!\n\n` +
                       `𝗧𝘆𝗽𝗲 *.menu* 𝗳𝗼𝗿 𝗳𝘂𝗹𝗹l 𝗰𝗼𝗺𝗺𝗮𝗻𝗱 𝗹𝗶𝘀𝘁`;

        await sock.sendMessage(chatId, {
            text: message1,
            }, { quoted: message });
    } catch (error) {
        console.error('Error in alive command:', error);
        await sock.sendMessage(chatId, { text: 'Bot is alive and running!' }, { quoted: message });
    }
}

module.exports = aliveCommand;