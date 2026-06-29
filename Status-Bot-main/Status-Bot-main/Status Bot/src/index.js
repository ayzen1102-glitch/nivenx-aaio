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
const { registerCommands } = require('./deploy');
const { handleInteraction } = require('./handlers/interaction');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('clientReady', async () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
    await registerCommands(client);
});

client.on('error', console.error);
client.on('warn', console.warn);

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

client.on('interactionCreate', handleInteraction);

client.login(token);
