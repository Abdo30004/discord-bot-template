import {
  AnySelectMenuInteraction,
  ButtonInteraction,
  ChatInputCommandInteraction,
  Collection,
  ContextMenuCommandBuilder,
  ContextMenuCommandInteraction,
  Message,
  ModalSubmitInteraction
} from 'discord.js';

import { Client } from '../base/client';
import { MessageCommandBuilder } from '../base/messageCommandBuilder';
import { CommandTypes } from './enums';

type BooleanPromise = Promise<boolean>;

interface BaseCommand {
  type: CommandTypes;
  devOnly?: boolean;
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

interface InteractionCommand extends BaseCommand {
  defer?: boolean;
  ephemeral?: boolean;
}
interface SlashCommand extends InteractionCommand {
  type: CommandTypes.SlashCommand;
  data: SharedSlashCommand;
  execute: (client: Client, interaction: ChatInputCommandInteraction) => BooleanPromise;
}

interface ContextMenuCommand extends InteractionCommand {
  type: CommandTypes.MessageContextMenuCommand | CommandTypes.UserContextMenuCommand;
  data: ContextMenuCommandBuilder;
  execute: (client: Client, interaction: ContextMenuCommandInteraction) => BooleanPromise;
}

type componentCommandData = {
  name: string;
  customId: string;
};

interface ButtonCommand extends InteractionCommand {
  type: CommandTypes.ButtonCommand;
  data: componentCommandData;
  execute: (client: Client, interaction: ButtonInteraction) => BooleanPromise;
}

interface SelectMenuCommand extends InteractionCommand {
  type: CommandTypes.SelectMenuCommand;
  data: componentCommandData;
  execute: (client: Client, interaction: AnySelectMenuInteraction) => BooleanPromise;
}

interface ModalSubmitCommand extends InteractionCommand {
  type: CommandTypes.ModalSubmitCommand;
  data: componentCommandData;
  execute: (client: Client, interaction: ModalSubmitInteraction) => BooleanPromise;
}

declare type Command =
  | MessageCommand
  | SlashCommand
  | ContextMenuCommand
  | ButtonCommand
  | SelectMenuCommand
  | ModalSubmitCommand;

declare type ApplicationCommand = SlashCommand | ContextMenuCommand;

declare interface ClientCommands {
  messageCommands: Collection<string, MessageCommand>;
  slashCommands: Collection<string, SlashCommand>;
  contextMenuCommands: Collection<string, ContextMenuCommand>;
  buttonCommands: Collection<string, ButtonCommand>;
  selectMenuCommands: Collection<string, SelectMenuCommand>;
  modalSubmit: Collection<string, ModalSubmitCommand>;

  applicationCommands: Collection<string, ApplicationCommand>;
}
