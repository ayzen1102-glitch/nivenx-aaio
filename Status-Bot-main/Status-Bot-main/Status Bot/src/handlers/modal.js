const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require('discord.js');

function showModal(interaction) {
    const modal = new ModalBuilder()
        .setCustomId('mc_status_modal')
        .setTitle('Minecraft Server Status');

    const ipInput = new TextInputBuilder()
        .setCustomId('server_ip')
        .setLabel('Server IP Address')
        .setPlaceholder('e.g. hypixel.net or play.example.com:25565')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMaxLength(253);

    modal.addComponents(new ActionRowBuilder().addComponents(ipInput));

    return interaction.showModal(modal);
}

module.exports = { showModal };
