'use strict';

const { readdirSync, existsSync } = require('fs');
const path = require('path');

function walk(dir) {
  if (!existsSync(dir)) return [];
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walk(full));
    } else if (entry.name.endsWith('.js')) {
      results.push(full);
    }
  }
  return results;
}

async function loadEvents(client) {
  const eventsDir = path.join(__dirname, '..', 'events');
  const files = walk(eventsDir);
  let count = 0;

  for (const filePath of files) {
    try {
      delete require.cache[require.resolve(filePath)];
      const event = require(filePath);

      if (typeof event === 'function') {
        event(client);
        count++;
        continue;
      }

      if (event && event.name && typeof event.execute === 'function') {
        if (event.once) {
          client.once(event.name, (...args) => event.execute(...args, client));
        } else {
          client.on(event.name, (...args) => event.execute(...args, client));
        }
        count++;
      }
    } catch (err) {
      console.warn(`[EventHandler] Skipped ${path.basename(filePath)}: ${err.message}`);
    }
  }

  return count;
}

module.exports = { loadEvents };
