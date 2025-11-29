const moment = require('moment-timezone');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');


async function githubCommand(sock, chatId, message) {
  try {
    const res = await fetch('https://api.github.com/repos/nagiipstar/NAGIIP-STAR-MD', {
      headers: {
        'User-Agent': 'NAGIIP-STAR-MD-Bot',
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    if (!res.ok) throw new Error('Error fetching repository data');
    const json = await res.json();

    let txt = `*乂  𝗡𝗮𝗴𝗶𝗶𝗽 𝗦𝘁𝗮𝗿 𝗠𝗗  乂*\n\n`;
    txt += `✩  *𝗡𝗮𝗺𝗲* : ${json.name || 'NAGIIP-STAR-MD'}\n`;
    txt += `✩  *𝗢𝘄𝗻𝗲𝗿* : ${json.owner?.login || 'nagiipstar'}\n`;
    txt += `✩  *𝗪𝗮𝘁𝗰𝗵𝗲𝗿𝘀* : ${json.watchers_count || 0}\n`;
    txt += `✩  *𝗦𝗶𝘇𝗲* : ${((json.size || 0) / 1024).toFixed(2)} MB\n`;
    txt += `✩  *𝗟𝗮𝘀𝘁 𝗨𝗽𝗱𝗮𝘁𝗲𝗱* : ${json.updated_at ? moment(json.updated_at).format('DD/MM/YY - HH:mm:ss') : 'N/A'}\n`;
    txt += `✩  *𝗨𝗥𝗟* : ${json.html_url || 'https://github.com/nagiipstar/NAGIIP-STAR-MD'}\n`;
    txt += `✩  *𝗙𝗼𝗿𝗸𝘀* : ${json.forks_count || 0}\n`;
    txt += `✩  *𝗦𝘁𝗮𝗿𝘀* : ${json.stargazers_count || 0}\n`;
    txt += `✩  *𝗟𝗮𝗻𝗴𝘂𝗮𝗴𝗲* : ${json.language || 'JavaScript'}\n\n`;
    txt += `💥 *𝗡𝗔𝗚𝗜𝗜𝗣 𝗦𝗧𝗔𝗥 𝗠𝗗*`;

    const imgPath = path.join(__dirname, '../media/nagiip_md.jpg');
    
    if (fs.existsSync(imgPath)) {
      const imgBuffer = fs.readFileSync(imgPath);
      await sock.sendMessage(chatId, { image: imgBuffer, caption: txt }, { quoted: message });
    } else {
      await sock.sendMessage(chatId, { text: txt }, { quoted: message });
    }
  } catch (error) {
    console.error('GitHub command error:', error);
    await sock.sendMessage(chatId, { text: '❌ Error fetching repository information.' }, { quoted: message });
  }
}

module.exports = githubCommand; 