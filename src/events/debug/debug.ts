import { Events } from 'discord.js';

import { createEvent } from '../../utils/create';

export const event = createEvent({
  name: Events.Debug,
  clientIsReady: false,
  run: async (client, message) => {
    console.log(message);
    return true;
  }
});
