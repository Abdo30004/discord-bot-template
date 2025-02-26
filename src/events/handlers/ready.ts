import chalk from 'chalk';
import { Events } from 'discord.js';
import figlet from 'figlet';

import { Event } from '../../types/event';
const event: Event<Events.ClientReady> = {
  name: Events.ClientReady,
  run: async client => {
    const text = figlet.textSync(`${client.user.displayName}`, {
      font: 'Standard',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      whitespaceBreak: true
    });
    console.log(chalk.yellow.bold(text), '\n');

    return true;
  }
};

export default event;
