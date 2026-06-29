package com.pfpbot.commands.impl;

import com.pfpbot.commands.CommandManager;
import com.pfpbot.commands.ICommand;
import com.pfpbot.config.Config;
import net.dv8tion.jda.api.components.container.Container;
import net.dv8tion.jda.api.components.separator.Separator;
import net.dv8tion.jda.api.components.textdisplay.TextDisplay;
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import net.dv8tion.jda.api.events.message.MessageReceivedEvent;
import net.dv8tion.jda.api.interactions.commands.build.Commands;
import net.dv8tion.jda.api.interactions.commands.build.SlashCommandData;

import java.util.Map;

public class HelpCommand implements ICommand {

    private static final Map<String, String> SHORT_DESC = Map.of(
            "ping",    "check bot latency",
            "help",    "list all bot commands",
            "setup",   "configure autoposter channels",
            "enable",  "resume the autoposter",
            "disable", "pause the autoposter",
            "reset",   "clear all server settings"
    );

    private final CommandManager manager;

    public HelpCommand(CommandManager manager) {
        this.manager = manager;
    }

    @Override
    public String getName() { return "help"; }

    @Override
    public String getDescription() { return "Show all available commands."; }

    @Override
    public SlashCommandData getSlashData() {
        return Commands.slash(getName(), getDescription());
    }

    private Container buildContainer() {
        StringBuilder sb = new StringBuilder();
        for (ICommand cmd : manager.getAll()) {
            String desc = SHORT_DESC.getOrDefault(cmd.getName(), cmd.getDescription());
            sb.append("**").append(cmd.getName()).append("** :: ").append(desc).append("\n");
        }
        return Container.of(
                TextDisplay.of(sb.toString().trim()),
                Separator.createDivider(Separator.Spacing.SMALL),
                TextDisplay.of("-# Prefix: `" + Config.getPrefix() + "` — All commands work as slash or prefix.")
        ).withAccentColor(0xFFFFFF);
    }

    @Override
    public void onSlash(SlashCommandInteractionEvent event) {
        event.reply("")
                .useComponentsV2()
                .setComponents(buildContainer())
                .setEphemeral(true)
                .queue();
    }

    @Override
    public void onPrefix(MessageReceivedEvent event, String[] args) {
        event.getChannel().sendMessage("")
                .useComponentsV2()
                .setComponents(buildContainer())
                .queue();
    }
}
