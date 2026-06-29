package com.pfpbot.autoposter;

import com.pfpbot.database.Database;
import com.pfpbot.database.Database.GuildSettings;
import com.pfpbot.util.ImageLoader;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.components.container.Container;
import net.dv8tion.jda.api.components.mediagallery.MediaGallery;
import net.dv8tion.jda.api.components.mediagallery.MediaGalleryItem;
import net.dv8tion.jda.api.entities.channel.concrete.TextChannel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.*;

public class AutoPoster {

    private static final Logger log = LoggerFactory.getLogger(AutoPoster.class);
    private static AutoPoster instance;

    // Task key = guildId + ":" + category  (e.g. "123456789:anime")
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(4);
    private final Map<String, ScheduledFuture<?>> tasks = new ConcurrentHashMap<>();
    private final Set<String> posting = ConcurrentHashMap.newKeySet();

    private AutoPoster() {}

    public static AutoPoster get() {
        if (instance == null) instance = new AutoPoster();
        return instance;
    }


    public void scheduleAll(JDA jda) {
        List<GuildSettings> entries = Database.get().getAllEnabled();
        for (GuildSettings s : entries) schedule(s.guildId(), s.category(), jda);
        log.info("Scheduled {} autoposter task(s) on startup.", entries.size());
    }


    public void scheduleForGuild(String guildId, JDA jda) {
        cancelAll(guildId);
        List<GuildSettings> entries = Database.get().getGuild(guildId);
        for (GuildSettings s : entries) {
            if (s.enabled()) schedule(s.guildId(), s.category(), jda);
        }
    }


    public void schedule(String guildId, String category, JDA jda) {
        String key = key(guildId, category);
        cancel(key);

        GuildSettings s = Database.get().getGuildCategory(guildId, category);
        if (s == null || !s.enabled()) return;

        long intervalMs = (long) s.intervalSec() * 1000L;

        ScheduledFuture<?> future = scheduler.scheduleAtFixedRate(
                () -> post(guildId, category, jda),
                intervalMs,
                intervalMs,
                TimeUnit.MILLISECONDS
        );

        tasks.put(key, future);
        log.info("Scheduled autoposter for guild {} / {} every {}s.", guildId, category, s.intervalSec());
    }


    public void cancelCategory(String guildId, String category) {
        cancel(key(guildId, category));
    }


    public void cancelAll(String guildId) {
        tasks.keySet().stream()
                .filter(k -> k.startsWith(guildId + ":"))
                .forEach(this::cancel);
        log.info("Cancelled all tasks for guild {}.", guildId);
    }

    private void cancel(String key) {
        ScheduledFuture<?> f = tasks.remove(key);
        if (f != null) {
            f.cancel(false);
            log.info("Cancelled task {}.", key);
        }
    }


    private void post(String guildId, String category, JDA jda) {
        String key = key(guildId, category);

        // Skip if a post for this guild/category is already in flight
        if (!posting.add(key)) {
            log.debug("Post already in flight for {} — skipping tick.", key);
            return;
        }

        try {
            GuildSettings s = Database.get().getGuildCategory(guildId, category);
            if (s == null || !s.enabled()) {
                cancelCategory(guildId, category);
                return;
            }

            int total = ImageLoader.size(category);
            if (total == 0) {
                log.warn("No images for category '{}' — skipping guild {}.", category, guildId);
                return;
            }

            int index = s.postIndex() % total;
            String url = ImageLoader.get(category, index);

            if (url == null || url.isBlank()) {
                log.warn("Blank URL at index {} for guild {} / {}.", index, guildId, category);
                return;
            }

            TextChannel channel = jda.getTextChannelById(s.channelId());
            if (channel == null) {
                log.warn("Channel {} not found for guild {} / {} — disabling.", s.channelId(), guildId, category);
                Database.get().setEnabledAll(guildId, false);
                cancelAll(guildId);
                return;
            }

            int nextIndex = (index + 1) % total;

            // Advance index BEFORE sending so concurrent ticks never read the same value
            Database.get().setPostIndex(guildId, category, nextIndex);

            channel.sendMessage("")
                    .useComponentsV2()
                    .setComponents(
                            Container.of(
                                    MediaGallery.of(MediaGalleryItem.fromUrl(url))
                            ).withAccentColor(0xFFFFFF)
                    )
                    .queue(
                            msg -> {
                                posting.remove(key);
                                log.info("Posted {} PFP #{} to guild {}.", category, index, guildId);
                            },
                            err -> {
                                posting.remove(key);
                                log.error("Failed to post to guild {} / {}.", guildId, category, err);
                            }
                    );

        } catch (Exception e) {
            posting.remove(key);
            log.error("Unexpected error in autoposter for guild {} / {}.", guildId, category, e);
        }
    }

    public void shutdown() {
        scheduler.shutdownNow();
        log.info("AutoPoster scheduler shut down.");
    }

    private String key(String guildId, String category) {
        return guildId + ":" + category;
    }
}
