import { Command } from '../../@types/command';
import { CommandTypes } from '../../@types/enums';
import { MessageCommandBuilder } from '../../base/messageCommandBuilder';

const command: Command = {
  type: CommandTypes.MessageCommand,
  data: new MessageCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
  execute: async (_client, message) => {
    await message.delete();
    await message.reply('Pong!');
    return true;
  }
};

export default command;
