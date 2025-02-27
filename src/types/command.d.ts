import type {
  ButtonInteraction,
  ChannelSelectMenuInteraction,
  ChatInputCommandInteraction,
  Collection,
  ContextMenuCommandBuilder,
  ContextMenuCommandInteraction,
  MentionableSelectMenuInteraction,
  Message,
  ModalSubmitInteraction,
  RoleSelectMenuInteraction,
  StringSelectMenuInteraction,
  UserSelectMenuInteraction
} from 'discord.js';

import type { Client } from '../base/client';
import type { ComponentCommandBuilder } from '../base/componentCommandBuilder';
import type { MessageCommandBuilder } from '../base/messageCommandBuilder';
import type { CommandTypes } from './enums';

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

/* Application Commands */
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

/* Component Commands */

type ComponentCommandBuilderData = {
  name: string;
  customId: RegExp;
};
type t=RegExpExecArray | RegExpMatchArray
interface ButtonCommand extends InteractionCommand {
  type: CommandTypes.ButtonCommand;
  data: ComponentCommandBuilder;
  execute: (client: Client, interaction: ButtonInteraction, commandIdData: RegExpExecArray) => BooleanPromise;
}
interface ModalSubmitCommand extends InteractionCommand {
  type: CommandTypes.ModalSubmitCommand;
  data: ComponentCommandBuilder;
  execute: (client: Client, interaction: ModalSubmitInteraction, commandIdData: RegExpExecArray) => BooleanPromise;
}
interface StringSelectMenuCommand extends InteractionCommand {
  type: CommandTypes.StringSelectMenuCommand;
  data: ComponentCommandBuilder;
  execute: (client: Client, interaction: StringSelectMenuInteraction, commandIdData: RegExpExecArray) => BooleanPromise;
}
interface ChannelSelectMenuCommand extends InteractionCommand {
  type: CommandTypes.ChannelSelectMenuCommand;
  data: ComponentCommandBuilder;
  execute: (
    client: Client,
    interaction: ChannelSelectMenuInteraction,
    commandIdData: RegExpExecArray
  ) => BooleanPromise;
}
interface UserSelectMenuCommand extends InteractionCommand {
  type: CommandTypes.UserSelectMenuCommand;
  data: ComponentCommandBuilder;
  execute: (client: Client, interaction: UserSelectMenuInteraction, commandIdData: RegExpExecArray) => BooleanPromise;
}
interface RoleSelectMenuCommand extends InteractionCommand {
  type: CommandTypes.RoleSelectMenuCommand;
  data: ComponentCommandBuilder;
  execute: (client: Client, interaction: RoleSelectMenuInteraction, commandIdData: RegExpExecArray) => BooleanPromise;
}

interface MentionableSelectMenuCommand extends InteractionCommand {
  type: CommandTypes.MentionableSelectMenuCommand;
  data: ComponentCommandBuilder;
  execute: (
    client: Client,
    interaction: MentionableSelectMenuInteraction,
    commandIdData: RegExpExecArray
  ) => BooleanPromise;
}

declare type ApplicationCommand = SlashCommand | ContextMenuCommand;
declare type SelectMenuCommand =
  | StringSelectMenuCommand
  | UserSelectMenuCommand
  | MentionableSelectMenuCommand
  | RoleSelectMenuCommand
  | ChannelSelectMenuCommand;

declare type ComponentCommand = ButtonCommand | ModalSubmitCommand | SelectMenuCommand;

declare type AnyCommand = MessageCommand | ApplicationCommand | ComponentCommand;

declare interface ClientCommands {
  messageCommands: Collection<string, MessageCommand>;
  slashCommands: Collection<string, SlashCommand>;
  contextMenuCommands: Collection<string, ContextMenuCommand>;
  applicationCommands: Collection<string, ApplicationCommand>;
  buttonCommands: Collection<RegExp, ButtonCommand>;
  modalSubmit: Collection<RegExp, ModalSubmitCommand>;
  stringSelectMenuCommands: Collection<RegExp, StringSelectMenuCommand>;
  userSelectMenuCommands: Collection<RegExp, UserSelectMenuCommand>;
  roleSelectMenuCommands: Collection<RegExp, RoleSelectMenuCommand>;
  channelSelectMenuCommands: Collection<RegExp, ChannelSelectMenuCommand>;
  mentionableSelectMenuCommands: Collection<RegExp, MentionableSelectMenuCommand>;
}
