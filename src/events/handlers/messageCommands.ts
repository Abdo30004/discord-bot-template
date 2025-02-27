import { Events } from 'discord.js';

import { createEvent } from '../../utils/create';

export const event = createEvent({
  name: Events.MessageCreate,
  run: async (client, message) => {
    if (message.partial) await message.fetch().catch(() => null);
    if (message.author.bot) return false;

    const prefixRegex = RegExp(`^(<@!?${client.user.id}> ?|${client.config.prefix})`);

    if (!prefixRegex.test(message.content)) return false;

    const pureContent = message.content.trim().replace(prefixRegex, '');

    const [commandName] = pureContent.split(/(?: |\n)+/);

    const args = pureContent.slice(commandName.length).trim().split(/ +/);

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
});
