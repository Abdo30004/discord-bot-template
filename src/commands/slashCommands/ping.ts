import { InteractionContextType, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../@types/command';
import { CommandTypes } from '../../@types/enums';

const command: Command = {
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
};

export default command;
