import { Client } from './base/client';
import { ActivityType, AllowedMentionsTypes, GatewayIntentBits, Partials, PresenceUpdateStatus } from 'discord.js';
import { config as envConfig } from 'dotenv';
import process from 'process';
import chalk from 'chalk';
envConfig();

import './api/app';
import './utils/prototype';
import { Logger } from './utils/logger';

export const client = new Client({
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
  registerCommands: true,
  debug: true
});





process.on('unhandledRejection', (error:Error) => {
  Logger.logError(error);
});

process.on('uncaughtException', (error:Error) => {
  Logger.logError(error);
});


process.on('SIGINT', async () => {
  console.log(chalk.red.bold('\nShutting down...'));
  process.exit(0);
});

