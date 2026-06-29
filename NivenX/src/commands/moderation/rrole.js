const {
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags,
    PermissionFlagsBits,
} = require("discord.js");

module.exports = {
    name: "rrole",
    aliases: ["removerole"],
    description: "Remove a role from a user",
    category: "moderation",
    cooldown: 3,
    run: async (client, message, args, prefix) => {
        const owners = client.config.owner;
        const hasPermission = message.member.permissions.has(PermissionFlagsBits.Administrator) || owners.includes(message.author.id);

        const reply = (content, color = 0x26272F) => message.channel.send({
            components: [
                new ContainerBuilder()
                    .setAccentColor(color)
                    .addTextDisplayComponents(new TextDisplayBuilder().setContent(content)),
            ],
            flags: MessageFlags.IsComponentsV2,
        });

        if (!hasPermission) {
        }

        if (args.length < 2) {
        }

        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);


        if (
            message.member.roles.highest.position <= user.roles.highest.position &&
            message.author.id !== message.guild.ownerId &&
            !owners.includes(message.author.id)
        ) {
        }

        if (role.position >= message.guild.members.me.roles.highest.position) {
        }

        if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
        }

        const reason = `${message.author.tag} removed role ${role.name} from ${user.user.tag}`;

        try {
            await user.roles.remove(role, reason);
        } catch (err) {
            console.error("Error removing role:", err);
        }
    },
};
