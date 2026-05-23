// commands/ping.js
import fs from 'fs';
import path from 'path';
import { sendStyled } from '../events/messageHandler.js';

export async function pingCommand(message, client) {
    const msgTimestamp = message.messageTimestamp * 1000;
    const latency = Date.now() - msgTimestamp;
    
    const text = `⚡ *Speed* : ${latency} ms`;
    await sendStyled(message.key.remoteJid, text, client);
}
