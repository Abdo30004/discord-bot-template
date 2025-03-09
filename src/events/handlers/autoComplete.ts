import { Events } from 'discord.js';

import { createEvent } from '../../utils/create';
import { Logger } from '../../utils/logger';

export const event = createEvent({
  name: Events.InteractionCreate,
  run: async (client, interaction) => {
    if (!interaction.isAutocomplete()) return false;

    const commandsCollection = client.commands.slashCommands;

    const command = commandsCollection.get(interaction.commandName);

    if (!command) return false;

    if (command.devOnly && !client.config.devsIds.includes(interaction.user.id)) {
      return false;
    }
    if (!command.autoComplete) return false;

    try {
      await command.autoComplete(client, interaction);
    } catch (error) {
      Logger.logError(error as Error);
      return false;
    }

    return true;
  }
});
