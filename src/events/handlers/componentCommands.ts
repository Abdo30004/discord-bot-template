import { Events } from 'discord.js';

import { createEvent } from '../../utils/create';
import { Logger } from '../../utils/logger';

export const event = createEvent({
  name: Events.InteractionCreate,
  run: async (client, interaction) => {
    let commandsCollection = null;

    if (interaction.isButton()) commandsCollection = client.commands.buttonCommands;
    else if (interaction.isModalSubmit()) commandsCollection = client.commands.modalSubmit;
    else if (interaction.isStringSelectMenu()) commandsCollection = client.commands.stringSelectMenuCommands;
    else if (interaction.isUserSelectMenu()) commandsCollection = client.commands.userSelectMenuCommands;
    else if (interaction.isRoleSelectMenu()) commandsCollection = client.commands.roleSelectMenuCommands;
    else if (interaction.isMentionableSelectMenu()) commandsCollection = client.commands.mentionableSelectMenuCommands;
    else if (interaction.isChannelSelectMenu()) commandsCollection = client.commands.channelSelectMenuCommands;
    else return false;

    if (!commandsCollection) return false;

    const command = commandsCollection.get(interaction.customId);

    if (!command) return false;

    if (command.devOnly && !client.config.devsIds.includes(interaction.user.id)) {
      await interaction.reply({
        content: "You don't have permission to use this command.",
        ephemeral: true
      });
      return false;
    }

    if (command.defer) await interaction.deferReply({ ephemeral: command.ephemeral });

    try {
      await command.execute(client, interaction as any); /* eslint-disable-line @typescript-eslint/no-explicit-any*/
    } catch (error) {
      Logger.logError(error as Error);

      const errorMessage = 'An error occurred while executing this command.';

      if (command.defer) {
        await interaction.editReply({ content: errorMessage }).catch(() => null);
      } else {
        await interaction.reply({ content: errorMessage, ephemeral: true }).catch(() => null);
      }

      return false;
    }

    return true;
  }
});
