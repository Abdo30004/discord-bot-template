import { Event } from '../../@types/event';

import figlet from 'figlet';
import chalk from 'chalk';
const event: Event<'ready'> = {
  name: 'ready',
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
