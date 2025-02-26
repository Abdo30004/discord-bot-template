import {
  ChatInputCommandInteraction,
  ContextMenuCommandBuilder,
  ContextMenuCommandInteraction,
  Message} from 'discord.js';

import { Client } from '../base/client';
import { MessageCommandBuilder } from '../base/messageCommandBuilder';
import { CommandTypes } from './enums';

type BooleanPromise = Promise<boolean>;

interface BaseCommand {
  type: CommandTypes;
  devOnly?: boolean;
}

interface ApplicationCommand extends BaseCommand {
  defer?: boolean;
  ephemeral?: boolean;
}
interface SlashCommand extends ApplicationCommand {
  type: CommandTypes.SlashCommand;
  data: SharedSlashCommand;
  execute: (client: Client, interaction: ChatInputCommandInteraction) => BooleanPromise;
}

interface ContextMenuCommand extends ApplicationCommand {
  type: CommandTypes.MessageContextMenuCommand | CommandTypes.UserContextMenuCommand;
  data: ContextMenuCommandBuilder;
  execute: (client: Client, interaction: ContextMenuCommandInteraction) => BooleanPromise;
}

type MessageCommandBuilderData = {
  name: string;
  description: string;
  aliases: string[];
};
interface MessageCommand extends BaseCommand {
  type: CommandTypes.MessageCommand;
  data: MessageCommandBuilder;
  execute: (client: Client, message: Message, args: string[]) => BooleanPromise;
}

declare type Command = SlashCommand | ContextMenuCommand | MessageCommand;
