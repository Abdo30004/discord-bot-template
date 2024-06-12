import { Event } from '../../@types/event';
import { CommandTypes } from '../../@types/enums';
import { Logger } from '../../utils/logger';
import { ContextMenuCommand, SlashCommand } from '../../@types/command';

const event: Event<'interactionCreate'> = {
  name: 'interactionCreate',
  run: async (client, interaction) => {
    let CommandType: CommandTypes | null = null;
    if (interaction.isChatInputCommand()) CommandType = CommandTypes.SlashCommand;
    else if (interaction.isUserContextMenuCommand()) CommandType = CommandTypes.UserContextMenuCommand;
    else if (interaction.isMessageContextMenuCommand()) CommandType = CommandTypes.MessageContextMenuCommand;
    else return false;

    if (!CommandType) return false;

    const commandsCollection = client.commands.get(CommandType);

    if (!commandsCollection) return false;

    const command = commandsCollection.get(interaction.commandName) as SlashCommand | ContextMenuCommand;

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
      if (command.type === CommandTypes.SlashCommand && interaction.isChatInputCommand())
        await command.execute(client, interaction);
      else if (command.type === CommandTypes.MessageContextMenuCommand && interaction.isMessageContextMenuCommand())
        await command.execute(client, interaction);
      else if (command.type === CommandTypes.UserContextMenuCommand && interaction.isUserContextMenuCommand())
        await command.execute(client, interaction);
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

export default event;
