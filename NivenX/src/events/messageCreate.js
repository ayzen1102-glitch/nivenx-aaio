'use strict';

module.exports = (client) => {
  client.on('messageCreate', async (message) => {
    if (message.author?.bot) return;

    const config = client.config;
    const prefix = process.env.PREFIX || config.prefix || '!';

    if (message.mentions.has(client.user) && !message.reference && message.content.trim() === `<@${client.user.id}>`) {
      return message.reply({
        content: `👋 Hi! I'm **NivenX**, an all-in-one Discord bot.\nUse \`/help\` to see all commands, or prefix \`${prefix}\` for legacy commands.`,
      }).catch(() => {});
    }

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/\s+/);
    const commandName = args.shift()?.toLowerCase();
    if (!commandName) return;

    const command = client.commands.get(commandName);
    if (!command) return;

    const run = command.run || command.execute;
    if (typeof run !== 'function') return;

    try {
      await run(message, args, client);
    } catch (err) {
      console.error(`[NivenX] Prefix command ${commandName} error:`, err.message);
      message.reply('❌ An error occurred.').catch(() => {});
    }
  });
};
