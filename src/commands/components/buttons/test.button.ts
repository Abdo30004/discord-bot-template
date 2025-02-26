import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

import { CommandTypes } from '../../../types/enums';
import { createCommand } from '../../../utils/create';

export const command = createCommand({
  type: CommandTypes.ButtonCommand,
  data: {
    name: 'test button',
    customId: 'test_button'
  },
  execute: async (client, interaction) => {
    const inputs = [
      new TextInputBuilder()
        .setStyle(TextInputStyle.Short)
        .setLabel('Test Input 1')
        .setCustomId('test_input')
        .setPlaceholder('Test Input')
        .setRequired(true),
      new TextInputBuilder()
        .setLabel('Test Input 2')
        .setStyle(TextInputStyle.Short)
        .setCustomId('test_input2')
        .setPlaceholder('Test Input 2')
        .setRequired(true)
    ].map(input => new ActionRowBuilder<TextInputBuilder>().addComponents(input));

    const modal = new ModalBuilder().setTitle('Test Modal').setCustomId('test_modal').addComponents(inputs);

    await interaction.showModal(modal);
    return true;
  }
});
