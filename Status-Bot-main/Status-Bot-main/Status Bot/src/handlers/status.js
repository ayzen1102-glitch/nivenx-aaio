const {
    ContainerBuilder,
    SectionBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    ThumbnailBuilder,
    AttachmentBuilder,
    SeparatorSpacingSize,
    MessageFlags
} = require('discord.js');
const { fetchServerStatus } = require('../api');

async function sendStatus(interaction) {
    const address = interaction.fields.getTextInputValue('server_ip').trim();
    await interaction.deferReply();

    const updateMessage = async () => {
        try {
            const data = await fetchServerStatus(address);

            if (!data.online) {
                await interaction.editReply({
                    components: [buildOfflineCard(address, data)],
                    files: [],
                    flags: [MessageFlags.IsComponentsV2]
                });
                return;
            }

            const { components, files } = buildStatusCards(address, data);

            await interaction.editReply({
                components,
                files,
                flags: [MessageFlags.IsComponentsV2]
            });
        } catch (error) {
            console.error('Status fetch/edit failed in auto-refresh:', error.message);
        }
    };

    // Initial load
    await updateMessage();

    // Auto-refresh every 5 seconds
    const interval = setInterval(async () => {
        try {
            await updateMessage();
        } catch (error) {
            console.error('Error during auto-refresh edit, stopping interval:', error.message);
            clearInterval(interval);
        }
    }, 5000);
}

// ── Offline Card ────────────────────────────────────────────────────────────

function buildOfflineCard(address, data) {
    const container = new ContainerBuilder()
        .setAccentColor(0x26272F);

    container.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`# LIVE STATUS`)
    );

    container.addSeparatorComponents(
        new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small)
    );

    const info = [
        `-# **Address**: \`${address}\``,
        data.ip ? `-# **IP**: \`${data.ip}\`` : null,
        data.port ? `-# **Port**: \`${data.port}\`` : null
    ].filter(Boolean).join('\n');

    container.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(info)
    );

    return container;
}

// ── Error Card ──────────────────────────────────────────────────────────────

function buildErrorCard(address) {
    const container = new ContainerBuilder()
        .setAccentColor(0x26272F);

    container.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
            `# LIVE STATUS`
        )
    );

    return container;
}

// ── Online Status Cards ─────────────────────────────────────────────────────

function buildStatusCards(address, data) {
    const components = [];
    const files = [];

    // ── Main Info Container ──
    const main = new ContainerBuilder()
        .setAccentColor(0x26272F);

    // Header section (clean, no subtext or thumbnail here)
    const headerText = new TextDisplayBuilder()
        .setContent(`# LIVE STATUS`);
    main.addTextDisplayComponents(headerText);

    main.addSeparatorComponents(
        new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small)
    );

    // ── General section ──
    const general = [
        `-# **Address**: \`${address}\``,
        data.ip ? `-# **IP**: \`${data.ip}\`` : null,
        data.port ? `-# **Port**: \`${data.port}\`` : null,
        data.version ? `-# **Version**: \`${data.version}\`` : null,
        data.protocol?.name ? `-# **Protocol**: \`${data.protocol.name}\`` : null
    ].filter(Boolean).join('\n');

    const generalText = new TextDisplayBuilder().setContent(`### General\n${general}`);

    if (data.icon) {
        let iconUrl = data.icon;

        if (data.icon.startsWith('data:')) {
            const base64 = data.icon.split(',')[1];
            const buffer = Buffer.from(base64, 'base64');
            files.push(new AttachmentBuilder(buffer, { name: 'icon.png' }));
            iconUrl = 'attachment://icon.png';
        }

        const thumbnail = new ThumbnailBuilder({ media: { url: iconUrl } });
        const generalSection = new SectionBuilder()
            .addTextDisplayComponents(generalText)
            .setThumbnailAccessory(thumbnail);
        main.addSectionComponents(generalSection);
    } else {
        main.addTextDisplayComponents(generalText);
    }

    main.addSeparatorComponents(
        new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small)
    );

    // ── MOTD section ──
    const motd = data.motd?.clean?.map(l => l.trim()).filter(Boolean).join('\n') || 'No MOTD';
    main.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`### MOTD\n\`\`\`\n${motd}\n\`\`\``)
    );

    main.addSeparatorComponents(
        new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small)
    );

    // ── Players section ──
    const online = data.players?.online ?? '?';
    const max = data.players?.max ?? '?';
    let playersText = `-# **Online**: \`${online} / ${max}\``;

    if (data.players?.list?.length) {
        const names = data.players.list
            .slice(0, 20)
            .map(p => `\`${p.name}\``)
            .join(', ');
        playersText += `\n-# **Players**: ${names}`;
        if (data.players.list.length > 20) {
            playersText += ` … and ${data.players.list.length - 20} more`;
        }
    }

    main.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`### Players\n${playersText}`)
    );

    // ── Software / Plugins / Mods ──
    const extras = [];

    if (data.software) {
        extras.push(`-# **Software**: \`${data.software}\``);
    }

    if (data.plugins?.length) {
        const pluginNames = data.plugins.slice(0, 15).map(p => `\`${p.name}\``).join(', ');
        extras.push(`-# **Plugins** (${data.plugins.length}): ${pluginNames}`);
    }

    if (data.mods?.length) {
        const modNames = data.mods.slice(0, 15).map(m => `\`${m.name}\``).join(', ');
        extras.push(`-# **Mods** (${data.mods.length}): ${modNames}`);
    }

    if (extras.length) {
        main.addSeparatorComponents(
            new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small)
        );
        main.addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`### Software\n${extras.join('\n')}`)
        );
    }

    // ── EULA ──
    if (data.eula_blocked) {
        main.addSeparatorComponents(
            new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small)
        );
        main.addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`-# ⚠️ **This server is blocked by Mojang for EULA violations.**`)
        );
    }

    components.push(main);

    return { components, files };
}

module.exports = { sendStatus };
