import { Client } from './base/client';
import { GatewayIntentBits, Partials } from 'discord.js';
import { config as envConfig } from 'dotenv';
envConfig();
import './api/app';

import './utils/prototype';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message],
});

client.init({
  token: process.env.TOKEN,
  commandsDirName: 'commands',
  eventsDirName: 'events',
  debug: true,
});
