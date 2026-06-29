'use strict';

module.exports = (client) => {
  client.on('interactionCreate', async (interaction) => {

    // ── Autocomplete ─────────────────────────────────────────────────────────
    if (interaction.isAutocomplete()) {
      const command = client.commands.get(interaction.commandName);
      if (command && typeof command.autocomplete === 'function') {
        try { await command.autocomplete(interaction, client); } catch {}
      }
      return;
    }

    // ── Slash commands ────────────────────────────────────────────────────────
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      // Support execute / slashExecute / runSlash
      const execute = command.execute || command.slashExecute || command.runSlash;
      if (typeof execute !== 'function') {
        return interaction.reply({ content: '⚠️ This command has no executor.', ephemeral: true }).catch(() => {});
      }

      try {
        await execute.call(command, interaction, client);
      } catch (err) {
        console.error(`[NivenX] /${interaction.commandName} error:`, err.message);
        const msg = { content: '❌ An error occurred executing this command.', ephemeral: true };
        if (interaction.replied || interaction.deferred) interaction.followUp(msg).catch(() => {});
        else interaction.reply(msg).catch(() => {});
      }
      return;
    }

    // ── Buttons / Select menus / Modals ───────────────────────────────────────
    if (
      interaction.isButton() ||
      interaction.isStringSelectMenu() ||
      interaction.isModalSubmit() ||
      interaction.isAnySelectMenu()
    ) {
      for (const [, command] of client.commands) {
        // Check all component handler method names used across bots
        const handler =
          command.handleComponent ||
          command.handleButton ||
          command.handleSelect ||
          command.handleModal ||
          command.componentsV2 ||
          command.componentHandler;

        if (typeof handler === 'function') {
          try { await handler.call(command, interaction, client); } catch {}
        }
      }
    }
  });
};
