'use strict';

module.exports = (client) => {
  client.on('interactionCreate', async (interaction) => {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      const execute = command.execute || command.runSlash;
      if (typeof execute !== 'function') return;

      try {
        await execute(interaction, client);
      } catch (err) {
        console.error(`[NivenX] Command /${interaction.commandName} error:`, err.message);
        const msg = { content: '❌ An error occurred executing this command.', ephemeral: true };
        if (interaction.replied || interaction.deferred) interaction.followUp(msg).catch(() => {});
        else interaction.reply(msg).catch(() => {});
      }
      return;
    }

    if (interaction.isButton() || interaction.isStringSelectMenu() || interaction.isModalSubmit()) {
      for (const [, command] of client.commands) {
        const handler = command.handleComponent || command.handleButton || command.handleSelect || command.handleModal;
        if (typeof handler === 'function') {
          try { await handler(interaction, client); } catch {}
        }
      }
    }
  });
};
