package com.pfpbot.commands;

import com.pfpbot.commands.impl.*;
import net.dv8tion.jda.api.JDA;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.Map;

public class CommandManager {

    private static final Logger log = LoggerFactory.getLogger(CommandManager.class);

    private final Map<String, ICommand> commands = new LinkedHashMap<>();

    public CommandManager() {
        register(
                new PingCommand(),
                new HelpCommand(this),
                new SetupCommand(),
                new EnableCommand(),
                new DisableCommand(),
                new ResetCommand()
        );
    }

    private void register(ICommand... cmds) {
        for (ICommand cmd : cmds) {
            commands.put(cmd.getName().toLowerCase(), cmd);
            log.info("Registered command: {}", cmd.getName());
        }
    }

    public ICommand get(String name) {
        return commands.get(name.toLowerCase());
    }

    public Collection<ICommand> getAll() {
        return commands.values();
    }

    public void registerSlashCommands(JDA jda) {
        jda.updateCommands()
                .addCommands(commands.values().stream()
                        .map(ICommand::getSlashData)
                        .toList())
                .queue(cmds -> log.info("Registered {} slash commands globally.", cmds.size()),
                        err -> log.error("Failed to register slash commands.", err));
    }
}
