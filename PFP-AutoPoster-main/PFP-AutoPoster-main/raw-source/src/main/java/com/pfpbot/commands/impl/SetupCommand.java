package com.pfpbot.commands.impl;

import com.pfpbot.commands.ICommand;
import com.pfpbot.database.Database;
import com.pfpbot.util.SetupSessionManager;
import com.pfpbot.util.SetupSessionManager.Session;
import net.dv8tion.jda.api.Permission;
import net.dv8tion.jda.api.components.actionrow.ActionRow;
import net.dv8tion.jda.api.components.buttons.Button;
import net.dv8tion.jda.api.components.container.Container;
import net.dv8tion.jda.api.components.selections.EntitySelectMenu;
import net.dv8tion.jda.api.components.separator.Separator;
import net.dv8tion.jda.api.components.textdisplay.TextDisplay;
import net.dv8tion.jda.api.entities.channel.ChannelType;
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import net.dv8tion.jda.api.events.message.MessageReceivedEvent;
import net.dv8tion.jda.api.interactions.commands.DefaultMemberPermissions;
import net.dv8tion.jda.api.interactions.commands.build.Commands;
import net.dv8tion.jda.api.interactions.commands.build.SlashCommandData;

import java.util.List;

public class SetupCommand implements ICommand {

    @Override
    public String getName() { return "setup"; }

    @Override
    public String getDescription() { return "Set up the autoposter for this server."; }

    @Override
    public SlashCommandData getSlashData() {
        return Commands.slash(getName(), getDescription())
                .setDefaultPermissions(DefaultMemberPermissions.enabledFor(Permission.MANAGE_SERVER));
    }

    @Override
    public void onSlash(SlashCommandInteractionEvent event) {
        if (!event.isFromGuild()) {
            event.reply("This command can only be used in a server.").setEphemeral(true).queue();
            return;
        }

        String guildId = event.getGuild().getId();
        String userId  = event.getUser().getId();

        Session session = SetupSessionManager.getOrCreate(guildId, userId);

        // Pre-populate session from existing DB entries
        List<Database.GuildSettings> existing = Database.get().getGuild(guildId);
        for (Database.GuildSettings s : existing) {
            session.setIntervalSeconds(s.intervalSec());
            switch (s.category()) {
                case "female" -> session.setFemaleChannelId(s.channelId());
                case "male"   -> session.setMaleChannelId(s.channelId());
                case "anime"  -> session.setAnimeChannelId(s.channelId());
            }
        }

        event.reply("")
                .useComponentsV2()
                .setComponents(buildContainer(event.getJDA(), guildId, userId, session))
                .setEphemeral(true)
                .queue();
    }

    @Override
    public void onPrefix(MessageReceivedEvent event, String[] args) {
        if (!event.isFromGuild()) return;

        String guildId = event.getGuild().getId();
        String userId  = event.getAuthor().getId();

        Session session = SetupSessionManager.getOrCreate(guildId, userId);

        List<Database.GuildSettings> existing = Database.get().getGuild(guildId);
        for (Database.GuildSettings s : existing) {
            session.setIntervalSeconds(s.intervalSec());
            switch (s.category()) {
                case "female" -> session.setFemaleChannelId(s.channelId());
                case "male"   -> session.setMaleChannelId(s.channelId());
                case "anime"  -> session.setAnimeChannelId(s.channelId());
            }
        }

        event.getChannel().sendMessage("")
                .useComponentsV2()
                .setComponents(buildContainer(event.getJDA(), guildId, userId, session))
                .queue();
    }

    public static Container buildContainer(net.dv8tion.jda.api.JDA jda, String guildId, String userId, Session session) {
        String femaleDisplay = resolveChannelMention(jda, session.getFemaleChannelId());
        String maleDisplay   = resolveChannelMention(jda, session.getMaleChannelId());
        String animeDisplay  = resolveChannelMention(jda, session.getAnimeChannelId());
        String durationDisplay = formatDuration(session.getIntervalSeconds());

        return Container.of(
                TextDisplay.of("**Autopost Setup**"),
                TextDisplay.of(
                        "Assign a channel to each image category. The bot will post a new image every **" +
                        durationDisplay + "**. Leave a category empty to skip it.\n" +
                        "-# Changes only take effect after clicking Save."
                ),
                Separator.createDivider(Separator.Spacing.LARGE),
                TextDisplay.of(
                        "**Female:** " + femaleDisplay + "\n" +
                        "**Male:** "   + maleDisplay   + "\n" +
                        "**Anime:** "  + animeDisplay
                ),
                Separator.createDivider(Separator.Spacing.LARGE),
                ActionRow.of(
                        EntitySelectMenu.create("setup:channel:female", EntitySelectMenu.SelectTarget.CHANNEL)
                                .setChannelTypes(ChannelType.TEXT)
                                .setPlaceholder("Select channel for Female PFPs")
                                .setMinValues(0)
                                .setMaxValues(1)
                                .build()
                ),
                ActionRow.of(
                        EntitySelectMenu.create("setup:channel:male", EntitySelectMenu.SelectTarget.CHANNEL)
                                .setChannelTypes(ChannelType.TEXT)
                                .setPlaceholder("Select channel for Male PFPs")
                                .setMinValues(0)
                                .setMaxValues(1)
                                .build()
                ),
                ActionRow.of(
                        EntitySelectMenu.create("setup:channel:anime", EntitySelectMenu.SelectTarget.CHANNEL)
                                .setChannelTypes(ChannelType.TEXT)
                                .setPlaceholder("Select channel for Anime PFPs")
                                .setMinValues(0)
                                .setMaxValues(1)
                                .build()
                ),
                Separator.createDivider(Separator.Spacing.LARGE),
                ActionRow.of(
                        Button.primary("setup:save:" + guildId + ":" + userId, "Save"),
                        Button.secondary("setup:cancel:" + userId, "Cancel"),
                        Button.secondary("setup:config:" + guildId + ":" + userId, "Config")
                )
        ).withAccentColor(0xFFFFFF);
    }

    private static String resolveChannelMention(net.dv8tion.jda.api.JDA jda, String channelId) {
        if (channelId == null) return "Not set";
        var channel = jda.getTextChannelById(channelId);
        return channel != null ? channel.getAsMention() : "Not set";
    }

    public static String formatDuration(int seconds) {
        if (seconds < 60) return seconds + "s";
        int minutes = seconds / 60;
        int rem     = seconds % 60;
        if (rem == 0) return minutes + "m";
        return minutes + "m " + rem + "s";
    }
}
