package com.pfpbot.listeners;

import com.pfpbot.autoposter.AutoPoster;
import com.pfpbot.commands.impl.SetupCommand;
import com.pfpbot.config.Config;
import com.pfpbot.database.Database;
import com.pfpbot.util.SetupSessionManager;
import com.pfpbot.util.SetupSessionManager.Session;
import net.dv8tion.jda.api.components.actionrow.ActionRow;
import net.dv8tion.jda.api.components.container.Container;
import net.dv8tion.jda.api.components.label.Label;
import net.dv8tion.jda.api.components.separator.Separator;
import net.dv8tion.jda.api.components.textdisplay.TextDisplay;
import net.dv8tion.jda.api.components.textinput.TextInput;
import net.dv8tion.jda.api.components.textinput.TextInputStyle;
import net.dv8tion.jda.api.entities.channel.middleman.GuildChannel;
import net.dv8tion.jda.api.events.interaction.ModalInteractionEvent;
import net.dv8tion.jda.api.events.interaction.component.ButtonInteractionEvent;
import net.dv8tion.jda.api.events.interaction.component.EntitySelectInteractionEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;
import net.dv8tion.jda.api.interactions.modals.ModalMapping;
import net.dv8tion.jda.api.modals.Modal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

public class ComponentListener extends ListenerAdapter {

    private static final Logger log = LoggerFactory.getLogger(ComponentListener.class);

    private static String footer() {
        return "-# Prefix: `" + Config.getPrefix() + "` — All commands work as slash or prefix.";
    }


    @Override
    public void onEntitySelectInteraction(EntitySelectInteractionEvent event) {
        String id = event.getComponentId();

        if (!id.startsWith("setup:channel:")) return;
        if (!event.isFromGuild()) return;

        String category = id.substring("setup:channel:".length());
        String guildId  = event.getGuild().getId();
        String userId   = event.getUser().getId();

        Session session = SetupSessionManager.getOrCreate(guildId, userId);

        List<GuildChannel> channels = event.getMentions().getChannels();
        String channelId = channels.isEmpty() ? null : channels.get(0).getId();

        switch (category) {
            case "female" -> session.setFemaleChannelId(channelId);
            case "male"   -> session.setMaleChannelId(channelId);
            case "anime"  -> session.setAnimeChannelId(channelId);
            default -> { event.reply("Unknown category.").setEphemeral(true).queue(); return; }
        }

        event.editComponents()
                .useComponentsV2()
                .setComponents(SetupCommand.buildContainer(event.getJDA(), guildId, userId, session))
                .queue();
    }


    @Override
    public void onButtonInteraction(ButtonInteractionEvent event) {
        String id = event.getComponentId();

        if (id.startsWith("setup:save:"))    { handleSave(event, id);          return; }
        if (id.startsWith("setup:cancel:"))  { handleCancel(event);             return; }
        if (id.startsWith("setup:config:"))  { handleConfig(event, id);         return; }
        if (id.startsWith("reset:confirm:")) { handleResetConfirm(event, id);   return; }
        if (id.equals("reset:cancel"))       { handleResetCancel(event);         return; }

        log.warn("Unhandled button: {}", id);
    }

    private void handleSave(ButtonInteractionEvent event, String id) {
        String[] parts = id.split(":", 4);
        if (parts.length < 4) { event.reply("Invalid interaction.").setEphemeral(true).queue(); return; }
        String guildId = parts[2];
        String userId  = parts[3];

        if (event.getGuild() == null || !event.getGuild().getId().equals(guildId)) {
            event.reply("Invalid interaction.").setEphemeral(true).queue(); return;
        }

        Session session = SetupSessionManager.get(guildId, userId);
        if (session == null) {
            event.reply("Session expired. Run `/setup` again.").setEphemeral(true).queue(); return;
        }

        if (!session.hasAnyChannel()) {
            event.editComponents()
                    .useComponentsV2()
                    .setComponents(
                            Container.of(
                                    TextDisplay.of("Select at least one channel before saving."),
                                    Separator.createDivider(Separator.Spacing.SMALL),
                                    TextDisplay.of(footer())
                            ).withAccentColor(0xFFFFFF)
                    )
                    .queue();
            return;
        }

        int intervalSec = session.getIntervalSeconds();
        saveCategory(guildId, session.getFemaleChannelId(), "female", intervalSec);
        saveCategory(guildId, session.getMaleChannelId(),   "male",   intervalSec);
        saveCategory(guildId, session.getAnimeChannelId(),  "anime",  intervalSec);

        AutoPoster.get().scheduleForGuild(guildId, event.getJDA());
        SetupSessionManager.remove(guildId, userId);

        StringBuilder sb = new StringBuilder("Autoposter saved.\n");
        if (session.getFemaleChannelId() != null) sb.append("Female : <#").append(session.getFemaleChannelId()).append(">\n");
        if (session.getMaleChannelId()   != null) sb.append("Male   : <#").append(session.getMaleChannelId()).append(">\n");
        if (session.getAnimeChannelId()  != null) sb.append("Anime  : <#").append(session.getAnimeChannelId()).append(">\n");
        sb.append("Interval : every `").append(SetupCommand.formatDuration(intervalSec)).append("`");

        event.editComponents()
                .useComponentsV2()
                .setComponents(
                        Container.of(
                                TextDisplay.of(sb.toString().trim()),
                                Separator.createDivider(Separator.Spacing.SMALL),
                                TextDisplay.of(footer())
                        ).withAccentColor(0xFFFFFF)
                )
                .queue();
    }

    private void saveCategory(String guildId, String channelId, String category, int intervalSec) {
        if (channelId == null) return;
        Database.get().upsertGuildCategory(guildId, channelId, category, intervalSec);
    }

    private void handleCancel(ButtonInteractionEvent event) {
        if (event.getGuild() != null)
            SetupSessionManager.remove(event.getGuild().getId(), event.getUser().getId());

        event.editComponents()
                .useComponentsV2()
                .setComponents(
                        Container.of(
                                TextDisplay.of("Setup cancelled."),
                                Separator.createDivider(Separator.Spacing.SMALL),
                                TextDisplay.of(footer())
                        ).withAccentColor(0xFFFFFF)
                )
                .queue();
    }

    private void handleConfig(ButtonInteractionEvent event, String id) {
        String[] parts = id.split(":", 4);
        if (parts.length < 4) { event.reply("Invalid interaction.").setEphemeral(true).queue(); return; }
        String guildId = parts[2];
        String userId  = parts[3];

        Session session = SetupSessionManager.getOrCreate(guildId, userId);

        TextInput durationInput = TextInput.create("setup:duration", TextInputStyle.SHORT)
                .setValue(SetupCommand.formatDuration(session.getIntervalSeconds()))
                .setPlaceholder("e.g. 45s, 5m, 2h")
                .setRequired(true)
                .setMinLength(1)
                .setMaxLength(10)
                .build();

        Modal modal = Modal.create("setup:modal:" + guildId + ":" + userId, "Configure Interval")
                .addComponents(Label.of("Interval (e.g. 45s, 5m, 1h)", durationInput))
                .build();

        event.replyModal(modal).queue();
    }


    @Override
    public void onModalInteraction(ModalInteractionEvent event) {
        String id = event.getModalId();
        if (!id.startsWith("setup:modal:")) return;

        String[] parts = id.split(":", 4);
        if (parts.length < 4) return;
        String guildId = parts[2];
        String userId  = parts[3];

        ModalMapping mapping = event.getValue("setup:duration");
        if (mapping == null) return;

        int seconds = parseDuration(mapping.getAsString().trim().toLowerCase());
        if (seconds < 10) {
            event.reply("Interval must be at least 10 seconds.").setEphemeral(true).queue();
            return;
        }

        Session session = SetupSessionManager.getOrCreate(guildId, userId);
        session.setIntervalSeconds(seconds);

        event.editComponents()
                .useComponentsV2()
                .setComponents(SetupCommand.buildContainer(event.getJDA(), guildId, userId, session))
                .queue();
    }

    private int parseDuration(String raw) {
        try {
            if (raw.endsWith("h")) return Integer.parseInt(raw.replace("h", "").trim()) * 3600;
            if (raw.endsWith("m")) return Integer.parseInt(raw.replace("m", "").trim()) * 60;
            if (raw.endsWith("s")) return Integer.parseInt(raw.replace("s", "").trim());
            return Integer.parseInt(raw);
        } catch (NumberFormatException e) {
            return -1;
        }
    }


    private void handleResetConfirm(ButtonInteractionEvent event, String id) {
        String guildId = id.substring("reset:confirm:".length());
        if (event.getGuild() == null || !event.getGuild().getId().equals(guildId)) {
            event.reply("Invalid interaction.").setEphemeral(true).queue(); return;
        }

        AutoPoster.get().cancelAll(guildId);
        Database.get().resetGuild(guildId);

        event.editComponents()
                .useComponentsV2()
                .setComponents(
                        Container.of(
                                TextDisplay.of("Autoposter reset. All settings cleared. Use `/setup` to configure again."),
                                Separator.createDivider(Separator.Spacing.SMALL),
                                TextDisplay.of(footer())
                        ).withAccentColor(0xFFFFFF)
                )
                .queue();

        log.info("Guild {} reset by {}", guildId, event.getUser().getAsTag());
    }

    private void handleResetCancel(ButtonInteractionEvent event) {
        event.editComponents()
                .useComponentsV2()
                .setComponents(
                        Container.of(
                                TextDisplay.of("Reset cancelled."),
                                Separator.createDivider(Separator.Spacing.SMALL),
                                TextDisplay.of(footer())
                        ).withAccentColor(0xFFFFFF)
                )
                .queue();
    }
}
