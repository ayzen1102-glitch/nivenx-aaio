'use strict';

module.exports = (client) => {
  client.on('messageCreate', async (message) => {
    if (message.author?.bot) return;
    if (!message.guild) return;

    const config = client.config;
    const prefix = process.env.PREFIX || config.prefix || '!';

    // Mention response
    if (
      message.mentions.has(client.user) &&
      !message.reference &&
      message.content.trim() === `<@${client.user.id}>`
    ) {
      return message.reply({
        content: `👋 Hi! I'm **NivenX**, your all-in-one Discord bot.\nUse \`/help\` or \`${prefix}help\` to see all commands.`,
      }).catch(() => {});
    }

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/\s+/);
    const commandName = args.shift()?.toLowerCase();
    if (!commandName) return;

    // Find by name or aliases
    let command = client.commands.get(commandName);
    if (!command) {
      command = [...client.commands.values()].find(
        (c) => Array.isArray(c.aliases) && c.aliases.includes(commandName)
      );
    }
    if (!command) return;

    // Support run / execute for prefix commands
    // run(message, args, client) is the standard
    // execute(message, args, client) is used by Falcron/giveaway pattern
    const runner = command.run || command.execute;
    if (typeof runner !== 'function') return;

    try {
      await runner.call(command, message, args, client);
    } catch (err) {
      console.error(`[NivenX] Prefix !${commandName} error:`, err.message);
      message.reply('❌ An error occurred.').catch(() => {});
    }
  });
};
