import configManager from '../utils/manageConfigs.js';

import readline from 'readline';

import startSession from '../utils/connector.js'

async function promptUserNumber() {

    return new Promise((resolve) => {

        const rl = readline.createInterface({

            input: process.stdin,

            output: process.stdout,

        });

        rl.question('', (number) => {

            rl.close();

            resolve(number.trim());
        });
    });
}


async function connectToWhatsApp(handleMessage) {

    console.log(`
> ┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
> ┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
> ┋  ┋     *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
> ┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
> ┋  ✅ 𝚋𝚘𝚝 𝚜𝚝𝚊𝚛𝚝𝚒𝚗𝚐...
> ┗▣
`);

    console.log("📲RENTRÉ VOTRE NUMÉRO (with country code, e.g., 237xxxx): ");

    const primary = configManager.config?.users["root"]?.primary;

    if (!primary) {

        const number = await promptUserNumber();

        await startSession(number, handleMessage, true);

    } else {

        const number = primary;

        await startSession(number, handleMessage, false);
    }
  
}


export default connectToWhatsApp;
