package com.pfpbot.commands.impl;

import com.pfpbot.autoposter.AutoPoster;
import com.pfpbot.commands.ICommand;
import com.pfpbot.config.Config;
import com.pfpbot.database.Database;
import net.dv8tion.jda.api.Permission;
import net.dv8tion.jda.api.components.actionrow.ActionRow;
import net.dv8tion.jda.api.components.buttons.Button;
import net.dv8tion.jda.api.components.container.Container;
import net.dv8tion.jda.api.components.separator.Separator;
import net.dv8tion.jda.api.components.textdisplay.TextDisplay;
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import net.dv8tion.jda.api.events.message.MessageReceivedEvent;
import net.dv8tion.jda.api.interactions.commands.DefaultMemberPermissions;
import net.dv8tion.jda.api.interactions.commands.build.Commands;
import net.dv8tion.jda.api.interactions.commands.build.SlashCommandData;

public class ResetCommand implements ICommand {

    @Override
    public String getName() { return "reset"; }

    @Override
    public String getDescription() { return "Reset and remove all autoposter settings for this server."; }

    @Override
    public SlashCommandData getSlashData() {
        return Commands.slash(getName(), getDescription())
                .setDefaultPermissions(DefaultMemberPermissions.enabledFor(Permission.MANAGE_SERVER));
    }

    private String footer() {
        return "-# Prefix: `" + Config.getPrefix() + "` — All commands work as slash or prefix.";
    }

    @Override
    public void onSlash(SlashCommandInteractionEvent event) {
        if (!event.isFromGuild()) {
            event.reply("This command can only be used in a server.").setEphemeral(true).queue();
            return;
        }

        String guildId = event.getGuild().getId();

        if (Database.get().getGuild(guildId).isEmpty()) {
            event.reply("").useComponentsV2().setComponents(
                    Container.of(
                            TextDisplay.of("No configuration found for this server."),
                            Separator.createDivider(Separator.Spacing.SMALL),
                            TextDisplay.of(footer())
                    ).withAccentColor(0xFFFFFF)
            ).setEphemeral(true).queue();
            return;
        }

        event.reply("")
                .useComponentsV2()
                .setComponents(
                        Container.of(
                                TextDisplay.of("Are you sure you want to reset the autoposter? This will remove all settings for this server and cannot be undone."),
                                ActionRow.of(
                                        Button.danger("reset:confirm:" + guildId, "Yes, reset"),
                                        Button.secondary("reset:cancel", "Cancel")
                                ),
                                Separator.createDivider(Separator.Spacing.SMALL),
                                TextDisplay.of(footer())
                        ).withAccentColor(0xFFFFFF)
                )
                .setEphemeral(true)
                .queue();
    }

    @Override
    public void onPrefix(MessageReceivedEvent event, String[] args) {
        if (!event.isFromGuild()) return;

        String guildId = event.getGuild().getId();

        if (Database.get().getGuild(guildId).isEmpty()) {
            event.getChannel().sendMessage("").useComponentsV2().setComponents(
                    Container.of(
                            TextDisplay.of("No configuration found for this server."),
                            Separator.createDivider(Separator.Spacing.SMALL),
                            TextDisplay.of(footer())
                    ).withAccentColor(0xFFFFFF)
            ).queue();
            return;
        }

        AutoPoster.get().cancelAll(guildId);
        Database.get().resetGuild(guildId);
        event.getChannel().sendMessage("").useComponentsV2().setComponents(
                Container.of(
                        TextDisplay.of("Autoposter reset. All settings cleared. Use `!setup` to configure again."),
                        Separator.createDivider(Separator.Spacing.SMALL),
                        TextDisplay.of(footer())
                ).withAccentColor(0xFFFFFF)
        ).queue();
    }
}
