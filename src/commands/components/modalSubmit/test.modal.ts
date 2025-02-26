import { CommandTypes } from '../../../types/enums';
import { createCommand } from '../../../utils/create';

export const command = createCommand({
  type: CommandTypes.ModalSubmitCommand,
  data: {
    name: 'test modal',
    customId: 'test_modal'
  },
  execute: async (client, interaction) => {
    console.log(interaction.fields);
    return true;
  }
});
