package com.pfpbot.commands.impl;

import com.pfpbot.commands.ICommand;
import com.pfpbot.config.Config;
import net.dv8tion.jda.api.components.container.Container;
import net.dv8tion.jda.api.components.separator.Separator;
import net.dv8tion.jda.api.components.textdisplay.TextDisplay;
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import net.dv8tion.jda.api.events.message.MessageReceivedEvent;
import net.dv8tion.jda.api.interactions.commands.build.Commands;
import net.dv8tion.jda.api.interactions.commands.build.SlashCommandData;

public class PingCommand implements ICommand {

    @Override
    public String getName() { return "ping"; }

    @Override
    public String getDescription() { return "Check the bot's latency."; }

    @Override
    public SlashCommandData getSlashData() {
        return Commands.slash(getName(), getDescription());
    }

    private Container buildContainer(long gatewayPing, long restPing) {
        return Container.of(
                TextDisplay.of(
                        "Gateway : `" + gatewayPing + "ms`\n" +
                        "REST    : `" + restPing + "ms`"
                ),
                Separator.createDivider(Separator.Spacing.SMALL),
                TextDisplay.of("-# Prefix: `" + Config.getPrefix() + "` — All commands work as slash or prefix.")
        ).withAccentColor(0xFFFFFF);
    }

    @Override
    public void onSlash(SlashCommandInteractionEvent event) {
        long gatewayPing = event.getJDA().getGatewayPing();
        event.getJDA().getRestPing().queue(restPing ->
            event.reply("")
                    .useComponentsV2()
                    .setComponents(buildContainer(gatewayPing, restPing))
                    .setEphemeral(true)
                    .queue()
        );
    }

    @Override
    public void onPrefix(MessageReceivedEvent event, String[] args) {
        long gatewayPing = event.getJDA().getGatewayPing();
        event.getJDA().getRestPing().queue(restPing ->
            event.getChannel().sendMessage("")
                    .useComponentsV2()
                    .setComponents(buildContainer(gatewayPing, restPing))
                    .queue()
        );
    }
}
