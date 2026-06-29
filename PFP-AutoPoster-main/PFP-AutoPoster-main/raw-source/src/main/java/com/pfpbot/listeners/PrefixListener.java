package com.pfpbot.listeners;

import com.pfpbot.commands.CommandManager;
import com.pfpbot.commands.ICommand;
import com.pfpbot.config.Config;
import net.dv8tion.jda.api.events.message.MessageReceivedEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class PrefixListener extends ListenerAdapter {

    private static final Logger log = LoggerFactory.getLogger(PrefixListener.class);
    private final CommandManager manager;

    public PrefixListener(CommandManager manager) {
        this.manager = manager;
    }

    @Override
    public void onMessageReceived(MessageReceivedEvent event) {
        if (event.getAuthor().isBot()) return;

        String raw = event.getMessage().getContentRaw().trim();
        String prefix = Config.getPrefix();

        if (!raw.startsWith(prefix)) return;

        String withoutPrefix = raw.substring(prefix.length()).trim();
        if (withoutPrefix.isEmpty()) return;

        String[] parts = withoutPrefix.split("\\s+");
        String commandName = parts[0].toLowerCase();
        String[] args = new String[parts.length - 1];
        System.arraycopy(parts, 1, args, 0, args.length);

        ICommand cmd = manager.get(commandName);
        if (cmd == null) return;

        try {
            cmd.onPrefix(event, args);
        } catch (Exception e) {
            log.error("Error handling prefix command {}", commandName, e);
            event.getChannel().sendMessage("An internal error occurred.").queue();
        }
    }
}
