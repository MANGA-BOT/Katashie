import express from 'express';
import path from 'path';
import fs from 'fs';

import startSession from './utils/connector.js';
import handleIncomingMessage from './events/messageHandler.js';

const app = express();

const PORT = process.env.PORT || 2002;

//━━━━━━━━━━ MIDDLEWARES ━━━━━━━━━━//

app.use(express.json());

app.use((req, res, next) => {

    res.setHeader(
        'Access-Control-Allow-Origin',
        '*'
    );

    res.setHeader(
        'Access-Control-Allow-Headers',
        '*'
    );

    res.setHeader(
        'Access-Control-Allow-Methods',
        '*'
    );

    next();

});

//━━━━━━━━━━ SERVE HTML ━━━━━━━━━━//

app.use(
    express.static(process.cwd())
);

app.get('/', (req, res) => {

    res.sendFile(
        path.join(
            process.cwd(),
            'web-pairing.html'
        )
    );

});

//━━━━━━━━━━ API PAIRING ━━━━━━━━━━//

app.post('/pair', async (req, res) => {

    try {

        const { number } = req.body;

        if (!number) {

            return res.json({

                success: false,
                error: 'Numéro manquant'

            });

        }

        // CLEAN NUMBER
        const cleanNumber =
            number.replace(/\D/g, '');

        console.log(
            `PAIR REQUEST : ${cleanNumber}`
        );

        // CHECK SESSION
        const sessionPath =
            `./sessions/${cleanNumber}`;

        if (
            fs.existsSync(sessionPath)
        ) {

            return res.json({

                success: false,

                error:
                    'Session déjà connectée'

            });

        }

        // START SESSION
        await startSession(

            cleanNumber,

            handleIncomingMessage,

            true,

            async (code, error) => {

                // ERROR
                if (
                    error ||
                    !code
                ) {

                    console.log(
                        'PAIR ERROR :',
                        error
                    );

                    return res.json({

                        success: false,

                        error:
                            error ||
                            'Impossible de générer le code'

                    });

                }

                // SUCCESS
                console.log(
                    `PAIR CODE ${cleanNumber} : ${code}`
                );

                return res.json({

                    success: true,

                    code,
                    number: cleanNumber

                });

            }

        );

    } catch (e) {

        console.log(e);

        return res.json({

            success: false,
            error: e.message

        });

    }

});

//━━━━━━━━━━ START SERVER ━━━━━━━━━━//

app.listen(PORT, () => {

    console.log(
        `WEB API STARTED ON PORT ${PORT}`
    );

    console.log(
        `http://80.241.213.208:${PORT}`
    );

});