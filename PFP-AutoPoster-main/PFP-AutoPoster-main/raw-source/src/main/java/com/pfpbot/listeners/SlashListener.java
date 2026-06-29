package com.pfpbot.listeners;

import com.pfpbot.commands.CommandManager;
import com.pfpbot.commands.ICommand;
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SlashListener extends ListenerAdapter {

    private static final Logger log = LoggerFactory.getLogger(SlashListener.class);
    private final CommandManager manager;

    public SlashListener(CommandManager manager) {
        this.manager = manager;
    }

    @Override
    public void onSlashCommandInteraction(SlashCommandInteractionEvent event) {
        ICommand cmd = manager.get(event.getName());
        if (cmd == null) {
            log.warn("Received unknown slash command: {}", event.getName());
            return;
        }

        try {
            cmd.onSlash(event);
        } catch (Exception e) {
            log.error("Error handling slash command /{}", event.getName(), e);
            if (event.isAcknowledged()) {
                event.getHook().sendMessage("An internal error occurred.").setEphemeral(true).queue();
            } else {
                event.reply("An internal error occurred.").setEphemeral(true).queue();
            }
        }
    }
}
