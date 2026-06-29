const { showModal } = require('./modal');
const { sendStatus } = require('./status');

async function handleInteraction(interaction) {
    try {
        if (interaction.isChatInputCommand() && interaction.commandName === 'status') {
            return await showModal(interaction);
        }

        if (interaction.isModalSubmit() && interaction.customId === 'mc_status_modal') {
            return await sendStatus(interaction);
        }
    } catch (error) {
        console.error('Error handling interaction:', error);
    }
}

module.exports = { handleInteraction };
