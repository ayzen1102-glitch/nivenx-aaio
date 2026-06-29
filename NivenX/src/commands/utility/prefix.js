const { ContainerBuilder, TextDisplayBuilder, MessageFlags, PermissionFlagsBits } = require('discord.js');

const c = (text) => ({ components: [new ContainerBuilder().addTextDisplayComponents(new TextDisplayBuilder().setContent(text))], flags: MessageFlags.IsComponentsV2 });

module.exports = {
    name: 'prefix',
    aliases: ['setprefix', 'set-prefix'],
    description: "View or change the server prefix",
    category: 'util',
    cooldown: 3,
    run: async (client, message, args, prefix) => {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
        }

        if (!args[0]) {
            return message.channel.send(c(`My prefix for this server is: \`${prefix}\``));
        }

        if (args[0].length > 3) {
        }

        if (args[1]) {
        }

        if (args[0] === client.config.prefix) {
            await client.db.delete(`prefix_${message.guild.id}`);
        }

        await client.db.set(`prefix_${message.guild.id}`, args[0]);
    }
};
