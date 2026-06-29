package com.pfpbot.util;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class ImageLoader {

    private static final Logger log = LoggerFactory.getLogger(ImageLoader.class);
    private static final Gson GSON = new Gson();

    public static final List<String> CATEGORIES = List.of("anime", "female", "male");

    private static final Map<String, List<String>> cache = new ConcurrentHashMap<>();

    public static List<String> load(String category) {
        return cache.computeIfAbsent(category.toLowerCase(), ImageLoader::read);
    }

    private static List<String> read(String category) {
        String path = "/assets/" + category + ".json";
        try (InputStream in = ImageLoader.class.getResourceAsStream(path)) {
            if (in == null) {
                log.error("Resource not found: {}", path);
                return Collections.emptyList();
            }
            JsonObject obj = GSON.fromJson(new InputStreamReader(in, StandardCharsets.UTF_8), JsonObject.class);
            JsonArray urls = obj.getAsJsonArray("urls");
            List<String> list = new ArrayList<>(urls.size());
            for (var el : urls) list.add(el.getAsString());
            log.info("Loaded {} URLs for category '{}'", list.size(), category);
            return Collections.unmodifiableList(list);
        } catch (Exception e) {
            log.error("Failed to load category '{}'", category, e);
            return Collections.emptyList();
        }
    }

    public static String get(String category, int index) {
        List<String> list = load(category);
        if (list.isEmpty()) return null;
        return list.get(index % list.size());
    }

    public static int size(String category) {
        return load(category).size();
    }
}
