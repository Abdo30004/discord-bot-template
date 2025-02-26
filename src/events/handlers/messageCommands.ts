import { Events } from 'discord.js';

import { Event } from '../../types/event';

export const event: Event<Events.MessageCreate> = {
  name: Events.MessageCreate,
  run: async (client, message) => {
    if (message.partial) await message.fetch().catch(() => null);
    if (message.author.bot) return false;

    if (!message.content.startsWith(client.config.prefix)) return false;

    const [commandName, ...args] = message.content.trim().slice(client.config.prefix.length).split(/ +/);

    const command = client.commands.messageCommands.get(commandName);

    if (!command) return false;

    if (command.devOnly && !client.config.devsIds.includes(message.author.id)) return false;

    client.logger.logCommandUsed(command, message.author);

    try {
      await command.execute(client, message, args);
    } catch (error) {
      client.logger.logError(error as Error);
      return false;
    }

    return true;
  }
};
