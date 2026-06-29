'use strict';

const { ActivityType, REST, Routes } = require('discord.js');

module.exports = (client) => {
  client.on('clientReady', async () => {
    const shardList = client.cluster?.info?.SHARD_LIST ?? [0];
    const shardId   = shardList[0] ?? 0;

    client.user.setPresence({
      status: 'online',
      activities: [{
        name: `NivenX | /help | shard ${shardId}`,
        type: ActivityType.Playing,
      }],
    });

    const slashCommands = [];
    for (const [, cmd] of client.commands) {
      if (cmd.slashCommand?.toJSON) slashCommands.push(cmd.slashCommand.toJSON());
      else if (cmd.data?.toJSON)    slashCommands.push(cmd.data.toJSON());
    }

    if (slashCommands.length > 0) {
      try {
        const config   = client.config;
        const clientId = process.env.DISCORD_CLIENT_ID || config.clientId || client.user.id;
        const rest     = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN || config.token);
        const guildId  = process.env.GUILD_ID;

        if (guildId) {
          await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: slashCommands });
          console.log(`[NivenX] Registered ${slashCommands.length} guild slash commands`);
        } else {
          await rest.put(Routes.applicationCommands(clientId), { body: slashCommands });
          console.log(`[NivenX] Registered ${slashCommands.length} global slash commands`);
        }
      } catch (err) {
        console.warn(`[NivenX] Slash command registration failed: ${err.message}`);
      }
    }

    console.log(`[Shard ${shardId}] Ready · ${client.guilds.cache.size} guilds`);
  });
};
