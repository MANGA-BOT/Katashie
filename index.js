//━━━━━━━━━━ WHATSAPP ━━━━━━━━━━//

import connectToWhatsApp from './auth/authHandler.js';
import handleIncomingMessage from './events/messageHandler.js';

//━━━━━━━━━━ TELEGRAM ━━━━━━━━━━//

import { startBot } from './events/bot.js';

//━━━━━━━━━━ WEB API ━━━━━━━━━━//

import './web-api.js';

//━━━━━━━━━━ START ━━━━━━━━━━//

(async () => {

    // bot principal
    const whatsappPromise =
        connectToWhatsApp(
            handleIncomingMessage
        ).catch(err => {

            console.log(
                'WHATSAPP ERROR :',
                err
            );

        });

    // bot telegram
    const telegramPromise =
        startBot().catch(err => {

            console.log(
                'TELEGRAM ERROR :',
                err
            );

        });

    // attendre tout
    await Promise.allSettled([

        whatsappPromise,
        telegramPromise

    ]);

})();