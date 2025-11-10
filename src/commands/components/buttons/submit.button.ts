import { FileUploadBuilder, LabelBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

import { ComponentCommandBuilder } from '../../../base/componentCommandBuilder';
import { CommandTypes } from '../../../types/enums';
import { createCommand } from '../../../utils/create';

export const command = createCommand({
  type: CommandTypes.ButtonCommand,
  data: new ComponentCommandBuilder().setName('submit_button').setCustomId(/submit-button-(\d+)/),
  execute: async (client, interaction) => {
    const inputs = [
      new LabelBuilder()
        .setLabel('Test Input')
        .setDescription('This is a label for input')
        .setTextInputComponent(
          new TextInputBuilder()
            .setStyle(TextInputStyle.Short)
            .setCustomId('test_input')
            .setPlaceholder('Test Input 2')
            .setRequired(true)
        ),

      new LabelBuilder()
        .setLabel('Test Input 2')
        .setDescription('This is a label for input 2')
        .setTextInputComponent(
          new TextInputBuilder()
            .setStyle(TextInputStyle.Short)
            .setCustomId('test_input2')
            .setPlaceholder('Test Input 2')
            .setRequired(true)
        ),
      new LabelBuilder()
        .setLabel('Test Input 3')
        .setDescription('This is a label for input 3')
        .setTextInputComponent(
          new TextInputBuilder()
            .setStyle(TextInputStyle.Short)
            .setCustomId('test_input3')
            .setPlaceholder('Test Input 3')
            .setRequired(true)
        ),

      new LabelBuilder()
        .setLabel('Test Input 4')
        .setDescription('This is a label for input 4')
        .setTextInputComponent(
          new TextInputBuilder()
            .setStyle(TextInputStyle.Short)
            .setCustomId('test_input4')
            .setPlaceholder('Test Input 4')
            .setRequired(true)
        ),

      new LabelBuilder()
        .setLabel('Test Input 2')
        .setDescription('This is a label for input 2')
        .setFileUploadComponent(new FileUploadBuilder().setCustomId('file_upload').setMaxValues(2))
    ];

    const modal = new ModalBuilder().setTitle('Test Modal').setCustomId('test_modal').addLabelComponents(inputs);

    await interaction.showModal(modal);
    return true;
  }
});
