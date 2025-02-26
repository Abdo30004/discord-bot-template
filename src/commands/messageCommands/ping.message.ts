import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

import { MessageCommandBuilder } from '../../base/messageCommandBuilder';
import { CommandTypes } from '../../types/enums';
import { createCommand } from '../../utils/create';

export const command = createCommand({
  type: CommandTypes.MessageCommand,
  data: new MessageCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
  execute: async (_client, message) => {
    await message.delete();
    const button = new ButtonBuilder().setCustomId('test_button').setLabel('Test Button').setStyle(ButtonStyle.Primary);
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

    await message.reply({ content: 'Pong!', components: [row] });

    return true;
  }
});
