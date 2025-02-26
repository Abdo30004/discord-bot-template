import './utils/prototype';

import process from 'node:process';

import { ActivityType, AllowedMentionsTypes, GatewayIntentBits, Partials, PresenceUpdateStatus } from 'discord.js';

import { Client } from './base/client';
import { ENV } from './utils/env';
import { Logger } from './utils/logger';

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Message, Partials.Channel, Partials.GuildMember],
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
  token: ENV.BOT_TOKEN,
  commandsDirName: 'commands',
  eventsDirName: 'events',
  registerCommands: true,
  debug: true
});

process.on('unhandledRejection', (error: Error) => {
  Logger.logError(error);
});

process.on('uncaughtException', (error: Error) => {
  Logger.logError(error);
});

process.on('SIGINT', async () => {
  Logger.logWarningMessage('\nShutting down...');
  process.exit(0);
});
