package com.pfpbot.commands.impl;

import com.pfpbot.autoposter.AutoPoster;
import com.pfpbot.commands.ICommand;
import com.pfpbot.config.Config;
import com.pfpbot.database.Database;
import net.dv8tion.jda.api.Permission;
import net.dv8tion.jda.api.components.container.Container;
import net.dv8tion.jda.api.components.separator.Separator;
import net.dv8tion.jda.api.components.textdisplay.TextDisplay;
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import net.dv8tion.jda.api.events.message.MessageReceivedEvent;
import net.dv8tion.jda.api.interactions.commands.DefaultMemberPermissions;
import net.dv8tion.jda.api.interactions.commands.build.Commands;
import net.dv8tion.jda.api.interactions.commands.build.SlashCommandData;

import java.util.List;

public class DisableCommand implements ICommand {

    @Override
    public String getName() { return "disable"; }

    @Override
    public String getDescription() { return "Pause the autoposter for this server."; }

    @Override
    public SlashCommandData getSlashData() {
        return Commands.slash(getName(), getDescription())
                .setDefaultPermissions(DefaultMemberPermissions.enabledFor(Permission.MANAGE_SERVER));
    }

    private Container buildContainer(String text) {
        return Container.of(
                TextDisplay.of(text),
                Separator.createDivider(Separator.Spacing.SMALL),
                TextDisplay.of("-# Prefix: `" + Config.getPrefix() + "` — All commands work as slash or prefix.")
        ).withAccentColor(0xFFFFFF);
    }

    @Override
    public void onSlash(SlashCommandInteractionEvent event) {
        if (!event.isFromGuild()) {
            event.reply("This command can only be used in a server.").setEphemeral(true).queue();
            return;
        }

        String guildId = event.getGuild().getId();
        List<Database.GuildSettings> entries = Database.get().getGuild(guildId);

        if (entries.isEmpty()) {
            event.reply("").useComponentsV2().setComponents(
                    buildContainer("This server has not been set up yet. Use `/setup` first.")
            ).setEphemeral(true).queue();
            return;
        }

        boolean allDisabled = entries.stream().noneMatch(Database.GuildSettings::enabled);
        if (allDisabled) {
            event.reply("").useComponentsV2().setComponents(
                    buildContainer("The autoposter is already disabled.")
            ).setEphemeral(true).queue();
            return;
        }

        Database.get().setEnabledAll(guildId, false);
        AutoPoster.get().cancelAll(guildId);

        event.reply("").useComponentsV2().setComponents(
                buildContainer("Autoposter disabled. Use `/enable` to resume posting.")
        ).setEphemeral(true).queue();
    }

    @Override
    public void onPrefix(MessageReceivedEvent event, String[] args) {
        if (!event.isFromGuild()) return;

        String guildId = event.getGuild().getId();
        List<Database.GuildSettings> entries = Database.get().getGuild(guildId);

        if (entries.isEmpty()) {
            event.getChannel().sendMessage("").useComponentsV2().setComponents(
                    buildContainer("This server has not been set up yet. Use `!setup` first.")
            ).queue();
            return;
        }

        boolean allDisabled = entries.stream().noneMatch(Database.GuildSettings::enabled);
        if (allDisabled) {
            event.getChannel().sendMessage("").useComponentsV2().setComponents(
                    buildContainer("The autoposter is already disabled.")
            ).queue();
            return;
        }

        Database.get().setEnabledAll(guildId, false);
        AutoPoster.get().cancelAll(guildId);
        event.getChannel().sendMessage("").useComponentsV2().setComponents(
                buildContainer("Autoposter disabled. Use `!enable` to resume.")
        ).queue();
    }
}
