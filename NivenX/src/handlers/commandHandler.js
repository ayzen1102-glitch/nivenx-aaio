'use strict';

const { readdirSync, statSync, existsSync } = require('fs');
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

async function loadCommands(client) {
  const commandsDir = path.join(__dirname, '..', 'commands');
  const files = walk(commandsDir);
  let count = 0;

  for (const filePath of files) {
    try {
      delete require.cache[require.resolve(filePath)];
      const cmd = require(filePath);
      if (!cmd) continue;

      const name = cmd.name || cmd.data?.name;
      if (!name) continue;

      client.commands.set(name, cmd);
      count++;
    } catch (err) {
      console.warn(`[CommandHandler] Skipped ${path.relative(commandsDir, filePath)}: ${err.message}`);
    }
  }

  return count;
}

module.exports = { loadCommands };
