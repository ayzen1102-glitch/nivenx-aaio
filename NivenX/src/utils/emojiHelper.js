'use strict';

/**
 * NivenX — Emoji Helper Utility
 * Provides get/set helpers on top of the combined emojis config.
 * Mirrors the Feedback-Bot emoji handler pattern (CJS edition).
 */

const emojis = require('../lib/emojis');

/**
 * Get an emoji string from the combined config.
 * Searches all categories for the key.
 * @param {string} name  e.g. 'tick', 'play', 'star'
 * @param {string} fallback
 */
function getEmoji(name, fallback = '') {
  return emojis.find(name, fallback);
}

/**
 * Get an emoji from a specific category.
 * @param {string} category  e.g. 'music', 'moderation', 'feedback'
 * @param {string} name
 * @param {string} fallback
 */
function getCategoryEmoji(category, name, fallback = '') {
  return emojis.get(category, name, fallback);
}

/**
 * Get the entire emojis object (all categories).
 */
function getAllEmojis() {
  return emojis;
}

/**
 * List all available emoji category names.
 */
function listCategories() {
  return emojis.list();
}

module.exports = { getEmoji, getCategoryEmoji, getAllEmojis, listCategories };
