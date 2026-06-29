'use strict';

/**
 * Legacy standalone entry point for the Minecraft Status bot.
 * This file is NOT used when NivenX loads commands — the command handler
 * only registers files that export { name, data } or { name }.
 * This file is kept for reference only.
 */

if (require.main === module) {
    const { Client, GatewayIntentBits } = require('discord.js');
    let token;
    try {
        const config = require('../config.json');
        token = process.env.DISCORD_TOKEN || config.token;
    } catch {
        token = process.env.DISCORD_TOKEN;
    }

    if (!token || token === 'YOUR_BOT_TOKEN_HERE') {
        console.error('❌ Error: DISCORD_TOKEN is missing! Provide it in config.json or process.env.DISCORD_TOKEN.');
        process.exit(1);
    }

    const client = new Client({ intents: [GatewayIntentBits.Guilds] });

    client.once('clientReady', async () => {
        console.log(`✅ Logged in as ${client.user.tag}`);
    });

    client.on('error', console.error);
    client.login(token);
}
