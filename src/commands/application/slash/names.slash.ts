import { InteractionContextType, SlashCommandBuilder } from 'discord.js';

import { CommandTypes } from '../../../types/enums';
import { createCommand } from '../../../utils/create';

export const command = createCommand({
  type: CommandTypes.SlashCommand,
  data: new SlashCommandBuilder()
    .setName('names')
    .setDescription('choose names with auto complete')
    .addStringOption(option =>
      option.setName('name').setDescription('The name').setRequired(true).setAutocomplete(true)
    )
    .setContexts(InteractionContextType.Guild),

  autoComplete: async (client, interaction) => {
    const currentName = interaction.options.getString('name', true).toLowerCase();
    console.log(currentName);
    const names = ['Ahmed', 'Mohamed', 'Sara', 'Amine'].filter(name => name.toLowerCase().includes(currentName));

    const choices = names.map(name => ({
      name,
      value: name
    }));

    await interaction.respond(choices);

    return true;
  },
  execute: async (_client, interaction) => {
    const name = interaction.options.getString('name', true);
    await interaction.reply(`Hello! ${name}`);
    return true;
  }
});
