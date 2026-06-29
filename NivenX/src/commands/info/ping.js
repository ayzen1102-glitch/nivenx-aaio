const { ChatInputCommandInteraction, SlashCommandBuilder, Client, EmbedBuilder } = require('discord.js');

module.exports = {
    enabled: true,
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDMPermission(false)
        .setDescription('Shows bot latency and WebSocket ping.'),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const start = Date.now();
        await interaction.deferReply({ ephemeral: true });
        const elapsed = Date.now() - start;
        const wsLatency = client.ws.ping;

        const embed = new EmbedBuilder()
            .setColor(0x5865f2)
            .setTitle('🏓 Pong!')
            .addFields(
                { name: '⏱️ Roundtrip', value: `\`${elapsed}ms\``, inline: true },
                { name: '💙 WebSocket', value: `\`${wsLatency < 0 ? 'N/A' : wsLatency + 'ms'}\``, inline: true }
            )
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },
};
