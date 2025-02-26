import { InteractionContextType, SlashCommandBuilder } from 'discord.js';

import { CommandTypes } from '../../types/enums';
import { createCommand } from '../../utils/create';

export const command = createCommand({
  type: CommandTypes.SlashCommand,
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!')
    .addStringOption(option => option.setName('input').setDescription('The input to echo back').setRequired(false))
    .setContexts(InteractionContextType.Guild),

  execute: async (_client, interaction) => {
    const str = interaction.options.getString('input');
    await interaction.reply(`Pong! ${str}`);
    return true;
  }
});
