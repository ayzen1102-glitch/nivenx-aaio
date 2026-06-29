const { REST, Routes, SlashCommandBuilder } = require('discord.js');
let token, clientId;
try {
    const config = require('../config.json');
    token = process.env.DISCORD_TOKEN || config.token;
    clientId = process.env.DISCORD_CLIENT_ID || config.clientId;
} catch {
    token = process.env.DISCORD_TOKEN;
    clientId = process.env.DISCORD_CLIENT_ID;
}

if (!token || !clientId || token === 'YOUR_BOT_TOKEN_HERE' || clientId === 'YOUR_CLIENT_ID_HERE') {
    console.error('❌ Error: Credentials missing! Check config.json or environment variables (DISCORD_TOKEN, DISCORD_CLIENT_ID).');
    process.exit(1);
}

const commands = [
    new SlashCommandBuilder()
        .setName('status')
        .setDescription('Check the status of a Minecraft server')
];

async function registerCommands(client) {
    const rest = new REST({ version: '10' }).setToken(token);

    try {
        await rest.put(Routes.applicationCommands(clientId), {
            body: commands.map(c => c.toJSON())
        });
        console.log('✅ Slash commands registered globally.');
    } catch (error) {
        console.error('Failed to register commands:', error);
    }
}

module.exports = { registerCommands };
