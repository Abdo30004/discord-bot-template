import { ComponentCommandBuilder } from '../../../base/componentCommandBuilder';
import { CommandTypes } from '../../../types/enums';
import { createCommand } from '../../../utils/create';

export const command = createCommand({
  type: CommandTypes.ModalSubmitCommand,
  data: new ComponentCommandBuilder().setName('test').setCustomId('test_modal'),
  execute: async (client, interaction) => {
    console.log(interaction.fields);
    return true;
  }
});
