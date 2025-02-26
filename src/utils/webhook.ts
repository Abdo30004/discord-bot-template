import { WebhookClient } from 'discord.js';

import { WEBHOOK_URL } from './env';

export const webhook = WEBHOOK_URL
  ? new WebhookClient({
      url: WEBHOOK_URL
    })
  : null;
