'use strict';

const { ClusterManager } = require('discord-hybrid-sharding');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const manager = new ClusterManager(path.join(__dirname, 'index.js'), {
  totalShards: 'auto',
  shardsPerClusters: 4,
  mode: 'process',
  token: process.env.DISCORD_TOKEN,
});

manager.on('clusterCreate', cluster => {
  console.log(`[NivenX] Cluster #${cluster.id} launched`);
});

manager.spawn({ timeout: -1 });
