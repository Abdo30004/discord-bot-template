import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

import { MessageCommandBuilder } from '../../base/messageCommandBuilder';
import { CommandTypes } from '../../types/enums';
import { createCommand } from '../../utils/create';

export const command = createCommand({
  type: CommandTypes.MessageCommand,
  data: new MessageCommandBuilder().setName('submit').setDescription('submit a form'),
  execute: async (_client, message) => {
    const button = new ButtonBuilder()
      .setCustomId(`submit-button-${message.author.id}`)
      .setLabel('Submit')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

    await message.reply({
      content: 'Please click the button to submit the form.',
      components: [row]
    });

    return true;
  }
});
