import { Events } from 'discord.js';

import { Event } from '../../types/event';
import { Logger } from '../../utils/logger';

export const event: Event<Events.InteractionCreate> = {
  name: Events.InteractionCreate,
  run: async (client, interaction) => {
    let commandsCollection = null;

    if (interaction.isChatInputCommand()) commandsCollection = client.commands.slashCommands;
    else if (interaction.isContextMenuCommand()) commandsCollection = client.commands.contextMenuCommands;
    else return false;

    if (!commandsCollection) return false;

    const command = commandsCollection.get(interaction.commandName);

    if (!command) return false;

    if (command.devOnly && !client.config.devsIds.includes(interaction.user.id)) {
      await interaction.reply({
        content: "You don't have permission to use this command.",
        ephemeral: true
      });

      return false;
    }

    if (command.defer) await interaction.deferReply({ ephemeral: command.ephemeral });

    Logger.logCommandUsed(command, interaction.user);

    try {
      await command.execute(client, interaction as any); /* eslint-disable-line @typescript-eslint/no-explicit-any*/
    } catch (error) {
      Logger.logError(error as Error);

      const errorMessage = 'An error occurred while executing this command.';

      if (command.defer)
        await interaction
          .editReply({
            content: errorMessage
          })
          .catch(() => null);
      else await interaction.reply({ content: errorMessage, ephemeral: true }).catch(() => null);

      return false;
    }

    return true;
  }
};
