package com.pfpbot;

import com.pfpbot.autoposter.AutoPoster;
import com.pfpbot.commands.CommandManager;
import com.pfpbot.config.Config;
import com.pfpbot.database.Database;
import com.pfpbot.listeners.ComponentListener;
import com.pfpbot.listeners.PrefixListener;
import com.pfpbot.listeners.SlashListener;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.JDABuilder;
import net.dv8tion.jda.api.requests.GatewayIntent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Bot {

    private static final Logger log = LoggerFactory.getLogger(Bot.class);

    public static void main(String[] args) throws InterruptedException {
        log.info("Starting PFP Autoposter Bot...");

        Database.get();

        CommandManager commandManager = new CommandManager();

        JDA jda = JDABuilder.createDefault(Config.getToken())
                .enableIntents(
                        GatewayIntent.GUILD_MESSAGES,
                        GatewayIntent.MESSAGE_CONTENT
                )
                .addEventListeners(
                        new SlashListener(commandManager),
                        new PrefixListener(commandManager),
                        new ComponentListener()
                )
                .build()
                .awaitReady();

        log.info("Logged in as {}#{}", jda.getSelfUser().getName(), jda.getSelfUser().getDiscriminator());

        commandManager.registerSlashCommands(jda);

        AutoPoster.get().scheduleAll(jda);

        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            log.info("Shutting down...");
            AutoPoster.get().shutdown();
            jda.shutdown();
        }));

        log.info("Bot is ready.");
    }
}
