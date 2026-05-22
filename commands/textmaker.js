// commands/textmaker.js

import mumaker from 'mumaker';

//━━━━━━━━━━ EFFECTS ━━━━━━━━━━//

const EFFECTS = {

    metallic: "https://en.ephoto360.com/impressive-decorative-3d-metal-text-effect-798.html",

    ice: "https://en.ephoto360.com/ice-text-effect-online-101.html",

    snow: "https://en.ephoto360.com/create-a-snow-3d-text-effect-free-online-621.html",

    impressive: "https://en.ephoto360.com/create-3d-colorful-paint-text-effect-online-801.html",

    matrix: "https://en.ephoto360.com/matrix-text-effect-154.html",

    light: "https://en.ephoto360.com/light-text-effect-futuristic-technology-style-648.html",

    neon: "https://en.ephoto360.com/create-colorful-neon-light-text-effects-online-797.html",

    devil: "https://en.ephoto360.com/neon-devil-wings-text-effect-online-683.html",

    purple: "https://en.ephoto360.com/purple-text-effect-online-100.html",

    thunder: "https://en.ephoto360.com/thunder-text-effect-online-97.html",

    leaves: "https://en.ephoto360.com/green-brush-text-effect-typography-maker-online-153.html",

    "1917": "https://en.ephoto360.com/1917-style-text-effect-523.html",

    arena: "https://en.ephoto360.com/create-cover-arena-of-valor-by-mastering-360.html",

    hacker: "https://en.ephoto360.com/create-anonymous-hacker-avatars-cyan-neon-677.html",

    sand: "https://en.ephoto360.com/write-names-and-messages-on-the-sand-online-582.html",

    glitch: "https://en.ephoto360.com/create-digital-glitch-text-effects-online-767.html",

    fire: "https://en.ephoto360.com/flame-lettering-effect-372.html",

    dragonball: "https://en.ephoto360.com/create-dragon-ball-style-text-effects-online-809.html",

    foggyglass: "https://en.ephoto360.com/handwritten-text-on-foggy-glass-online-680.html",

    foggyglassv2: "https://en.ephoto360.com/handwritten-text-on-foggy-glass-online-680.html",

    naruto: "https://en.ephoto360.com/naruto-shippuden-logo-style-text-effect-online-808.html",

    typo: "https://en.ephoto360.com/create-online-typography-art-effects-with-multiple-layers-811.html",

    frost: "https://en.ephoto360.com/create-a-frozen-christmas-text-effect-online-792.html",

    pixelglitch: "https://en.ephoto360.com/create-pixel-glitch-text-effect-online-769.html",

    neonglitch: "https://en.ephoto360.com/create-impressive-neon-glitch-text-effects-online-768.html",

    america: "https://en.ephoto360.com/free-online-american-flag-3d-text-effect-generator-725.html",

    erase: "https://en.ephoto360.com/create-eraser-deleting-text-effect-online-717.html",

    blackpink: "https://en.ephoto360.com/create-a-blackpink-neon-logo-text-effect-online-710.html",

    starwars: "https://en.ephoto360.com/create-star-wars-logo-online-982.html",

    bearlogo: "https://en.ephoto360.com/free-bear-logo-maker-online-673.html",

    graffiti: "https://en.ephoto360.com/create-a-cartoon-style-graffiti-text-effect-online-668.html",

    graffitiv2: "https://en.ephoto360.com/cute-girl-painting-graffiti-text-effect-667.html",

    futuristic: "https://en.ephoto360.com/light-text-effect-futuristic-technology-style-648.html",

    clouds: "https://en.ephoto360.com/write-text-effect-clouds-in-the-sky-online-619.html",

    pornhub: "https://en.ephoto360.com/create-pornhub-style-logos-online-free-549.html",

    marvel: "https://en.ephoto360.com/create-thor-logo-style-text-effects-online-for-free-796.html",

    captainamerica: "https://en.ephoto360.com/create-a-cinematic-captain-america-text-effect-online-715.html"
};

//━━━━━━━━━━ MAIN FUNCTION ━━━━━━━━━━//

async function generateLogo(effect, message, client, args) {

    const remoteJid = message.key.remoteJid;

    const text = args.join(' ');

    //━━━━━━━━━━ REACTION ━━━━━━━━━━//

    await client.sendMessage(remoteJid, {

        react: {
            text: '🎨',
            key: message.key
        }

    });

    //━━━━━━━━━━ DOUBLE TEXT COMMANDS ━━━━━━━━━━//

    if (['pornhub', 'marvel', 'captainamerica'].includes(effect)) {

        const [text1, text2] = text.split('|').map(t => t.trim());

        if (!text1 || !text2) {

            return await client.sendMessage(remoteJid, {

                text:
`┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
┋  ┋       *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
┋
┋  ❌ INVALID FORMAT
┋
┋  📌 EXAMPLE :
┋  .${effect} text1|text2
┗▣

𝚙𝚘𝚠𝚎𝚛 𝚋𝚢 *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*`

            });

        }

        try {

            const result = await mumaker.ephoto(EFFECTS[effect], [text1, text2]);

            await client.sendMessage(remoteJid, {

                image: { url: result.image },

                caption:
`┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
┋  ┋       *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
┋
┋  ✅ LOGO GENERATED
┋
┋  🎨 STYLE :
┋  ${effect.toUpperCase()}
┗▣

𝚙𝚘𝚠𝚎𝚛 𝚋𝚢 *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*`,

                contextInfo: {

                    forwardingScore: 999,

                    isForwarded: true,

                    forwardedNewsletterMessageInfo: {

                        newsletterJid: "120363409977869938@newsletter",

                        newsletterName: "𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴",

                        serverMessageId: 143
                    }
                }

            });

        } catch (e) {

            console.error(e);

            await client.sendMessage(remoteJid, {

                text:
`┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
┋  ❌ ERROR
┋
┋  FAILED TO
┋  GENERATE LOGO
┗▣

𝚙𝚘𝚠𝚎𝚛 𝚋𝚢 *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*`

            });

        }

        return;
    }

    //━━━━━━━━━━ SINGLE TEXT COMMANDS ━━━━━━━━━━//

    if (!text) {

        return await client.sendMessage(remoteJid, {

            text:
`┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
┋  ┋       *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
┋
┋  ❌ TEXT REQUIRED
┋
┋  📌 EXAMPLE :
┋  .${effect} KATASHIE
┗▣

𝚙𝚘𝚠𝚎𝚛 𝚋𝚢 *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*`

        });

    }

    try {

        const result = await mumaker.ephoto(EFFECTS[effect], text);

        await client.sendMessage(remoteJid, {

            image: { url: result.image },

            caption:
`┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
┋  ┏〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┓
┋  ┋       *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*
┋  ┗〩┅┅┅┅┅┅┅┅┅┅┅┅┅┅〩┛
┋
┋  ✅ LOGO GENERATED
┋
┋  🎨 STYLE :
┋  ${effect.toUpperCase()}
┗▣

𝚙𝚘𝚠𝚎𝚛 𝚋𝚢 *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*`,

            contextInfo: {

                forwardingScore: 999,

                isForwarded: true,

                forwardedNewsletterMessageInfo: {

                    newsletterJid: "120363409977869938@newsletter",

                    newsletterName: "𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴",

                    serverMessageId: 143
                }
            }

        });

    } catch (e) {

        console.error(e);

        await client.sendMessage(remoteJid, {

            text:
`┏┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅
┋  ❌ ERROR
┋
┋  FAILED TO
┋  GENERATE LOGO
┗▣

𝚙𝚘𝚠𝚎𝚛 𝚋𝚢 *𝙺𝙰𝚃𝙰𝚂𝙷𝙸𝙴*`

        });

    }
}

//━━━━━━━━━━ EXPORTS ━━━━━━━━━━//

//━━━━━━━━━━ EXPORTS ━━━━━━━━━━//

const textmaker = {

    metallic: async (message, client, args) => generateLogo("metallic", message, client, args),

    ice: async (message, client, args) => generateLogo("ice", message, client, args),

    snow: async (message, client, args) => generateLogo("snow", message, client, args),

    impressive: async (message, client, args) => generateLogo("impressive", message, client, args),

    matrix: async (message, client, args) => generateLogo("matrix", message, client, args),

    light: async (message, client, args) => generateLogo("light", message, client, args),

    neon: async (message, client, args) => generateLogo("neon", message, client, args),

    devil: async (message, client, args) => generateLogo("devil", message, client, args),

    purple: async (message, client, args) => generateLogo("purple", message, client, args),

    thunder: async (message, client, args) => generateLogo("thunder", message, client, args),

    leaves: async (message, client, args) => generateLogo("leaves", message, client, args),

    "1917": async (message, client, args) => generateLogo("1917", message, client, args),

    arena: async (message, client, args) => generateLogo("arena", message, client, args),

    hacker: async (message, client, args) => generateLogo("hacker", message, client, args),

    sand: async (message, client, args) => generateLogo("sand", message, client, args),

    glitch: async (message, client, args) => generateLogo("glitch", message, client, args),

    fire: async (message, client, args) => generateLogo("fire", message, client, args),

    dragonball: async (message, client, args) => generateLogo("dragonball", message, client, args),

    foggyglass: async (message, client, args) => generateLogo("foggyglass", message, client, args),

    foggyglassv2: async (message, client, args) => generateLogo("foggyglassv2", message, client, args),

    naruto: async (message, client, args) => generateLogo("naruto", message, client, args),

    typo: async (message, client, args) => generateLogo("typo", message, client, args),

    frost: async (message, client, args) => generateLogo("frost", message, client, args),

    pixelglitch: async (message, client, args) => generateLogo("pixelglitch", message, client, args),

    neonglitch: async (message, client, args) => generateLogo("neonglitch", message, client, args),

    america: async (message, client, args) => generateLogo("america", message, client, args),

    erase: async (message, client, args) => generateLogo("erase", message, client, args),

    blackpink: async (message, client, args) => generateLogo("blackpink", message, client, args),

    starwars: async (message, client, args) => generateLogo("starwars", message, client, args),

    bearlogo: async (message, client, args) => generateLogo("bearlogo", message, client, args),

    graffiti: async (message, client, args) => generateLogo("graffiti", message, client, args),

    graffitiv2: async (message, client, args) => generateLogo("graffitiv2", message, client, args),

    futuristic: async (message, client, args) => generateLogo("futuristic", message, client, args),

    clouds: async (message, client, args) => generateLogo("clouds", message, client, args),

    pornhub: async (message, client, args) => generateLogo("pornhub", message, client, args),

    marvel: async (message, client, args) => generateLogo("marvel", message, client, args),

    captainamerica: async (message, client, args) => generateLogo("captainamerica", message, client, args)
};

export default textmaker;