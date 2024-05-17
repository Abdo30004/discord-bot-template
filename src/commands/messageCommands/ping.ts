import {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../@types/command";
import { CommandTypes } from "../../@types/enums";
import { MessageCommandBuilder } from "../../base/messageCommandBuilder";

let command: Command = {
  type: CommandTypes.MessageCommand,
  data: new MessageCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  execute: async (_client, message) => {
    await message.reply("Pong!");
    return true;
  },
};

export default command;
