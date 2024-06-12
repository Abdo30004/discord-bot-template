import { Client } from './base/client';
import { ActivityType, AllowedMentionsTypes, GatewayIntentBits, Partials, PresenceUpdateStatus } from 'discord.js';
import { config as envConfig } from 'dotenv';
import process from 'process';

envConfig();

import './api/app';
import './utils/prototype';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Message],

  allowedMentions: {
    parse: [AllowedMentionsTypes.Role, AllowedMentionsTypes.User],
    repliedUser: true
  },
  failIfNotExists: false,

  presence: {
    activities: [
      {
        name: 'discord bot template',
        type: ActivityType.Watching
      }
    ],
    status: PresenceUpdateStatus.DoNotDisturb
  }
});

client.init({
  token: process.env.TOKEN,
  commandsDirName: 'commands',
  eventsDirName: 'events',
  debug: true
});

export { client };
