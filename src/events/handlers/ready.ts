import colors from 'ansi-colors';
import { Events } from 'discord.js';
import figlet from 'figlet';

import { createEvent } from '../../utils/create';

export const event = createEvent({
  name: Events.ClientReady,

  run: async client => {
    const text = figlet.textSync(`${client.user.displayName}`, {
      font: 'Standard',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      whitespaceBreak: true
    });

    console.log(colors.yellow.bold(text), '\n');

    return true;
  }
});
