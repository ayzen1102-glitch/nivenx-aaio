const Discord = require('discord.js');

const EmbedGenerator = require('../../Functions/embedGenerator');
const { translateText } = require('../../Functions/translate');
const emojis = require('../../lib/emojis');

const CATEGORY_INFO = {
    administrator: {
        emoji: emojis.administrator || '⚙️',
        description: 'Server configuration & management',
        color: 0xed4245,
    },
    backup: {
        emoji: emojis.backup || '💾',
        description: 'Server backup & restore',
        color: 0x57f287,
    },
    developer: {
        emoji: '🛠️',
        description: 'Bot development tools',
        color: 0xfee75c,
    },
    information: {
        emoji: emojis.information || 'ℹ️',
        description: 'Bot, server & user info',
        color: 0x5865f2,
    },
    moderator: {
        emoji: emojis.moderator || '🛡️',
        description: 'Moderation & safety tools',
        color: 0xeb459e,
    },
    public: {
        emoji: emojis.public || '🌐',
        description: 'User-facing features',
        color: 0x57f287,
    },
    utility: {
        emoji: emojis.utility || '🔧',
        description: 'Helpful utilities',
        color: 0x5865f2,
    },
    antinuke: {
        emoji: '🛡️',
        description: 'Antinuke protection',
        color: 0xed4245,
    },
    giveaway: {
        emoji: '🎉',
        description: 'Giveaway management',
        color: 0xfee75c,
    },
    economy: {
        emoji: '💰',
        description: 'Economy & currency',
        color: 0x57f287,
    },
    fun: {
        emoji: '🎮',
        description: 'Fun & entertainment',
        color: 0xeb459e,
    },
    music: {
        emoji: '🎵',
        description: 'Music playback',
        color: 0x5865f2,
    },
    moderation: {
        emoji: '🔨',
        description: 'Moderation tools',
        color: 0xeb459e,
    },
    tickets: {
        emoji: '🎫',
        description: 'Support tickets',
        color: 0x5865f2,
    },
    minecraft: {
        emoji: '⛏️',
        description: 'Minecraft integration',
        color: 0x57f287,
    },
};

/**
 * @param {Discord.Collection} commands
 * @param {Discord.Client} client
 * @param {Discord.User} user
 */
function buildHelpEmbeds(commands, client, user) {
    const embeds = [];
    const commandsByCategory = new Map();

    for (const [name, cmd] of commands) {
        if (cmd.enabled === false || cmd.developer) continue;
        const category = (cmd.category || 'utility').toLowerCase();
        if (!commandsByCategory.has(category)) {
            commandsByCategory.set(category, []);
        }
        commandsByCategory.get(category).push({ name, cmd });
    }

    const overviewEmbed = new Discord.EmbedBuilder()
        .setColor(0x5865f2)
        .setAuthor({
            name: `${client.user.username} Command Center`,
            iconURL: client.user.displayAvatarURL(),
        })
        .setTitle(`🤖 **NivenX Help Menu**`)
        .setDescription(`>>> **Welcome to NivenX!** 🤖\nYour all-in-one Discord bot.`)
        .addFields(
            {
                name: `📊 **Bot Statistics**`,
                value: `**🔢 Total Commands:** \`${commands.size}\`\n**📁 Categories:** \`${commandsByCategory.size}\`\n**🌐 Servers:** \`${client.guilds.cache.size}\`\n**👥 Users:** \`${client.users.cache.size}\``,
                inline: true,
            },
            {
                name: `🔗 **Quick Links**`,
                value: `**🔗** [Support Server](${process.env.SUPPORT_SERVER || 'https://discord.gg/support'})\n**🤖** [Bot Invite](https://discord.com/oauth2/authorize?client_id=${client.user.id})\n**📚** [Documentation](${process.env.DOCUMENTATION || 'https://github.com'})`,
                inline: true,
            }
        )
        .addFields({
            name: `📁 **Command Categories**`,
            value: Array.from(commandsByCategory.entries())
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([category, cmds]) => {
                    const info = CATEGORY_INFO[category] || { emoji: '📋', description: 'Commands' };
                    return `${info.emoji} **${category.charAt(0).toUpperCase() + category.slice(1)}** • \`${cmds.length}\` commands`;
                })
                .join('\n') || 'No categories found.',
            inline: false,
        })
        .setFooter({
            text: `Page 1/${commandsByCategory.size + 1} • Requested by ${user.username} • NivenX`,
            iconURL: user.displayAvatarURL(),
        })
        .setTimestamp()
        .setThumbnail(client.user.displayAvatarURL({ size: 256 }));

    embeds.push(overviewEmbed);

    const sortedCategories = Array.from(commandsByCategory.entries()).sort(([a], [b]) => a.localeCompare(b));

    for (const [category, cmds] of sortedCategories) {
        const info = CATEGORY_INFO[category] || { emoji: '📋', description: 'Commands', color: 0x95a5a6 };
        const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

        const lines = cmds
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(({ name, cmd }) => {
                const desc = cmd.data?.description || cmd.description || 'No description available';
                return `**\`/${name}\`**\n└─ ${desc}`;
            });

        const categoryEmbed = new Discord.EmbedBuilder()
            .setColor(info.color || 0x5865f2)
            .setThumbnail(client.user.displayAvatarURL({ size: 128 }))
            .setAuthor({
                name: `${client.user.username} Command Center`,
                iconURL: client.user.displayAvatarURL(),
            })
            .setTitle(`${info.emoji} **${categoryName} Commands**`)
            .setDescription(
                `>>> **${info.description}**\n\n${lines.join('\n\n') || 'No commands.'}`
            )
            .setFooter({
                text: `Page ${embeds.length + 1}/${commandsByCategory.size + 1} • Requested by ${user.username} • NivenX`,
                iconURL: user.displayAvatarURL(),
            })
            .setTimestamp()
            .setThumbnail(client.user.displayAvatarURL({ size: 128 }));

        embeds.push(categoryEmbed);
    }

    return embeds;
}

module.exports = {
    buildHelpEmbeds,
    enabled: true,
    data: new Discord.SlashCommandBuilder()
        .setName('help')
        .setDescription('View all NivenX commands and categories')
        .setDMPermission(false)
        .addStringOption((option) =>
            option
                .setName('category')
                .setDescription('Jump to a specific category')
                .setRequired(false)
        ),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     */
    async execute(interaction, client) {
        const embeds = buildHelpEmbeds(client.commands, client, interaction.user);
        if (embeds.length === 0) {
            return interaction.reply({ content: '❌ No commands available.', ephemeral: true });
        }

        const categoryChoice = interaction.options.getString('category')?.toLowerCase();
        let page = 0;
        if (categoryChoice) {
            const categories = Array.from(
                new Set(
                    [...client.commands.values()]
                        .filter((c) => c.enabled !== false && !c.developer)
                        .map((c) => (c.category || 'utility').toLowerCase())
                )
            ).sort();
            const idx = categories.indexOf(categoryChoice);
            if (idx >= 0) page = idx + 1;
        }

        page = Math.min(page, embeds.length - 1);

        if (embeds.length === 1) {
            return interaction.reply({ embeds: [embeds[0]], ephemeral: true });
        }

        const makeRow = (p) => new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder().setCustomId('help_prev').setEmoji('◀️').setLabel('Previous').setStyle(Discord.ButtonStyle.Primary).setDisabled(p === 0),
            new Discord.ButtonBuilder().setCustomId('help_home').setEmoji('🏠').setLabel('Home').setStyle(Discord.ButtonStyle.Success).setDisabled(p === 0),
            new Discord.ButtonBuilder().setCustomId('help_next').setEmoji('▶️').setLabel('Next').setStyle(Discord.ButtonStyle.Primary).setDisabled(p === embeds.length - 1)
        );

        const response = await interaction.reply({
            embeds: [embeds[page]],
            components: [makeRow(page)],
            ephemeral: true,
            withResponse: true,
        });

        const sent = response?.resource?.message || response;
        if (!sent) return;

        const collector = sent.createMessageComponentCollector({
            filter: (i) => ['help_prev', 'help_home', 'help_next'].includes(i.customId) && i.user.id === interaction.user.id,
            time: 120_000,
        });

        collector.on('collect', async (i) => {
            if (i.customId === 'help_prev') page = Math.max(0, page - 1);
            else if (i.customId === 'help_next') page = Math.min(embeds.length - 1, page + 1);
            else if (i.customId === 'help_home') page = 0;

            await i.update({ embeds: [embeds[page]], components: [makeRow(page)] }).catch(() => {});
        });

        collector.on('end', async () => {
            const disabledRow = new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder().setCustomId('help_prev').setEmoji('◀️').setLabel('Previous').setStyle(Discord.ButtonStyle.Secondary).setDisabled(true),
                new Discord.ButtonBuilder().setCustomId('help_home').setEmoji('🏠').setLabel('Home').setStyle(Discord.ButtonStyle.Secondary).setDisabled(true),
                new Discord.ButtonBuilder().setCustomId('help_next').setEmoji('▶️').setLabel('Next').setStyle(Discord.ButtonStyle.Secondary).setDisabled(true)
            );
            await interaction.editReply({ components: [disabledRow] }).catch(() => {});
        });
    },
};
