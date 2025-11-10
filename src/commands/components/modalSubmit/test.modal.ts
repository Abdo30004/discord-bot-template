import { ComponentCommandBuilder } from '../../../base/componentCommandBuilder';
import { CommandTypes } from '../../../types/enums';
import { createCommand } from '../../../utils/create';

export const command = createCommand({
  type: CommandTypes.ModalSubmitCommand,
  data: new ComponentCommandBuilder().setName('test').setCustomId('test_modal'),
  defer: true,
  ephemeral: true,
  execute: async (client, interaction) => {
    await interaction.editReply({ content: 'Test Modal Submitted!' });
    return true;
  }
});
