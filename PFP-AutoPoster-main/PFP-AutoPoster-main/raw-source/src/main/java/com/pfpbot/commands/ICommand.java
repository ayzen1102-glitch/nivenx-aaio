package com.pfpbot.commands;

import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import net.dv8tion.jda.api.events.message.MessageReceivedEvent;
import net.dv8tion.jda.api.interactions.commands.build.SlashCommandData;

public interface ICommand {

    String getName();

    String getDescription();

    SlashCommandData getSlashData();

    void onSlash(SlashCommandInteractionEvent event);

    void onPrefix(MessageReceivedEvent event, String[] args);
}
