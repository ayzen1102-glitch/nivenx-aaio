const {
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags,
    PermissionFlagsBits,
    SlashCommandBuilder,
} = require("discord.js");

module.exports = {
    name: "role",
    aliases: ["giverole", "addrole"],
    description: "Assign a role to a user",
    category: "moderation",
    cooldown: 3,
    slashCommand: new SlashCommandBuilder()
        .setName("role")
        .setDescription("Manage user roles")
        .addSubcommand(sub =>
            sub.setName("add")
                .setDescription("Add a role to a user")
                .addUserOption(opt =>
                    opt.setName("user").setDescription("The user to add the role to").setRequired(true))
                .addRoleOption(opt =>
                    opt.setName("role").setDescription("The role to add").setRequired(true)))
        .addSubcommand(sub =>
            sub.setName("remove")
                .setDescription("Remove a role from a user")
                .addUserOption(opt =>
                    opt.setName("user").setDescription("The user to remove the role from").setRequired(true))
                .addRoleOption(opt =>
                    opt.setName("role").setDescription("The role to remove").setRequired(true))),

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

        try {
            await user.roles.add(role, `${message.author.tag} assigned role ${role.name} to ${user.user.tag}`);
        } catch (err) {
            console.error("Error assigning role:", err);
        }
    },

    runSlash: async (client, interaction) => {
        const owners = client.config.owner;
        const hasPermission = interaction.member.permissions.has(PermissionFlagsBits.Administrator) || owners.includes(interaction.user.id);

        const reply = (content, color = 0x26272F, ephemeral = false) => interaction.reply({
            components: [
                new ContainerBuilder()
                    .setAccentColor(color)
                    .addTextDisplayComponents(new TextDisplayBuilder().setContent(content)),
            ],
            flags: ephemeral ? MessageFlags.IsComponentsV2 | 64 : MessageFlags.IsComponentsV2,
        });


        const subcommand = interaction.options.getSubcommand();
        const user = interaction.options.getMember("user");
        const role = interaction.options.getRole("role");


        if (
            interaction.member.roles.highest.position <= user.roles.highest.position &&
            interaction.user.id !== interaction.guild.ownerId &&
            !owners.includes(interaction.user.id)
        ) {
        }

        if (role.position >= interaction.guild.members.me.roles.highest.position) {
        }

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
        }

        try {
            if (subcommand === "add") {
                await user.roles.add(role, `${interaction.user.tag} assigned role ${role.name} to ${user.user.tag}`);
            } else if (subcommand === "remove") {
                await user.roles.remove(role, `${interaction.user.tag} removed role ${role.name} from ${user.user.tag}`);
            }
        } catch (err) {
            console.error("Error managing role:", err);
        }
    },
};
