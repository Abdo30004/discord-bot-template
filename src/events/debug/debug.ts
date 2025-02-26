import chalk from 'chalk';
import { Events } from 'discord.js';
import figlet from 'figlet';

import { createEvent } from '../../utils/create';

export const event = createEvent({
  name: Events.Debug,
  clientReady: false,
  run: async (client, message) => {
    console.log(message);
    return true;
  }
});
