// utils/connect.js

import startSession from './connector.js'
import handleIncomingMessage from '../events/messageHandler.js'
import { formatHTML } from './style.js'
import fs from 'fs'
import path from 'path'

async function connect(bot, msg, match) {

    const chatId = msg.chat.id

    const text = match?.[1]?.trim()

    if (!text) {

        await bot.sendMessage(chatId, formatHTML(`
┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
┋  ┋      𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴
┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
┋
┋  ❌ NUMÉRO MANQUANT
┋
┋  📌 Usage :
┋  /connect 237xxxxxx
┋
┗▣

power by KATASHIE
        `), {
            parse_mode: 'HTML'
        })

        return
    }

    let targetNumber =
        text.replace(/[^0-9]/g, '').trim()

    if (text.includes('+')) {

        await bot.sendMessage(chatId, formatHTML(`
┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
┋  ┋      𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴
┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
┋
┋  ❌ RETIRE LE +
┋
┋  📌 Exemple :
┋  237671281938
┋
┗▣

power by KATASHIE
        `), {
            parse_mode: 'HTML'
        })

        return
    }

    if (!targetNumber || targetNumber.length < 7) {

        await bot.sendMessage(chatId, formatHTML(`
┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
┋  ┋      𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴
┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
┋
┋  ❌ NUMÉRO INVALIDE
┋
┗▣

power by KATASHIE
        `), {
            parse_mode: 'HTML'
        })

        return
    }

    const sessionDir =
        path.join(
            process.cwd(),
            'sessions',
            targetNumber
        )

    if (fs.existsSync(sessionDir)) {

        await bot.sendMessage(chatId, formatHTML(`
┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
┋  ┋      𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴
┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
┋
┋  ⚠️ SESSION EXISTANTE
┋
┋  📲 ${targetNumber}
┋
┋  🔄 Utilise :
┋  /disconnect ${targetNumber}
┋
┗▣

power by KATASHIE
        `), {
            parse_mode: 'HTML'
        })

        return
    }

    await bot.sendMessage(chatId, formatHTML(`
┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
┋  ┋      𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴
┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
┋
┋  🔐 DEMANDE
┋  D'APPAIRAGE
┋
┋  📲 ${targetNumber}
┋
┋  ⚡ LE CODE
┋  ARRIVE...
┋
┗▣

power by KATASHIE
    `), {
        parse_mode: 'HTML'
    })

    let codeSent = false

    try {

        await startSession(

            targetNumber,

            handleIncomingMessage,

            true,

            async (code, error = false) => {

                if (error) {

                    await bot.sendMessage(chatId, formatHTML(`
┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
┋  ┋      𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴
┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
┋
┋  ❌ APPAIRAGE
┋  ÉCHOUÉ
┋
┗▣

power by KATASHIE
                    `), {
                        parse_mode: 'HTML'
                    })

                    return
                }

                if (!codeSent && code) {

                    codeSent = true

                    await bot.sendMessage(

                        chatId,

                        `
┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
┋  ┋      *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
┋
┋  🔑 CODE :
┋
┋  \`${code}\`
┋
┋  📲 ENTRE CE
┋  CODE SUR
┋  WHATSAPP
┋
┗▣

power by *KATASHIE*
                        `,

                        {
                            parse_mode: 'Markdown',

                            reply_markup: {

                                inline_keyboard: [

                                    [
                                        {
                                            text: "📋 Copier le code",
                                            callback_data: `copy_code_${code}`
                                        }
                                    ]
                                ]
                            }
                        }
                    )
                }
            }
        )

    } catch (error) {

        console.error(
            `Erreur connexion ${targetNumber}:`,
            error
        )

        await bot.sendMessage(chatId, formatHTML(`
┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
┋  ┋      𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴
┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
┋
┋  ❌ ERREUR
┋
┋  ${error.message}
┋
┗▣

power by KATASHIE
        `), {
            parse_mode: 'HTML'
        })
    }
}

export default connect