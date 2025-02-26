import { Events } from 'discord.js';

import { createEvent } from '../../utils/create';

export const event = createEvent({
  name: Events.Warn,
  clientIsReady: false,
  run: async (client, message) => {
    client.logger.logWarningMessage(message);
    return true;
  }
});
