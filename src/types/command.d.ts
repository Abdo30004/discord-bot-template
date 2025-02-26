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
  customId: string;
};

interface ButtonCommand extends InteractionCommand {
  type: CommandTypes.ButtonCommand;
  data: ComponentCommandBuilder;
  execute: (client: Client, interaction: ButtonInteraction) => BooleanPromise;
}
interface ModalSubmitCommand extends InteractionCommand {
  type: CommandTypes.ModalSubmitCommand;
  data: ComponentCommandBuilder;
  execute: (client: Client, interaction: ModalSubmitInteraction) => BooleanPromise;
}
interface StringSelectMenuCommand extends InteractionCommand {
  type: CommandTypes.StringSelectMenuCommand;
  data: ComponentCommandBuilder;
  execute: (client: Client, interaction: StringSelectMenuInteraction) => BooleanPromise;
}
interface ChannelSelectMenuCommand extends InteractionCommand {
  type: CommandTypes.ChannelSelectMenuCommand;
  data: ComponentCommandBuilder;
  execute: (client: Client, interaction: ChannelSelectMenuInteraction) => BooleanPromise;
}
interface UserSelectMenuCommand extends InteractionCommand {
  type: CommandTypes.UserSelectMenuCommand;
  data: ComponentCommandBuilder;
  execute: (client: Client, interaction: UserSelectMenuInteraction) => BooleanPromise;
}
interface RoleSelectMenuCommand extends InteractionCommand {
  type: CommandTypes.RoleSelectMenuCommand;
  data: ComponentCommandBuilder;
  execute: (client: Client, interaction: RoleSelectMenuInteraction) => BooleanPromise;
}

interface MentionableSelectMenuCommand extends InteractionCommand {
  type: CommandTypes.MentionableSelectMenuCommand;
  data: ComponentCommandBuilder;
  execute: (client: Client, interaction: MentionableSelectMenuInteraction) => BooleanPromise;
}

declare type ApplicationCommand = SlashCommand | ContextMenuCommand;
declare type SelectMenuCommand =
  | StringSelectMenuCommand
  | UserSelectMenuCommand
  | MentionableSelectMenuCommand
  | RoleSelectMenuCommand
  | ChannelSelectMenuCommand;

declare type AnyCommand =
  | MessageCommand
  | SlashCommand
  | ContextMenuCommand
  | ButtonCommand
  | SelectMenuCommand
  | ModalSubmitCommand;

declare interface ClientCommands {
  messageCommands: Collection<string, MessageCommand>;
  slashCommands: Collection<string, SlashCommand>;
  contextMenuCommands: Collection<string, ContextMenuCommand>;
  buttonCommands: Collection<string, ButtonCommand>;
  modalSubmit: Collection<string, ModalSubmitCommand>;
  stringSelectMenuCommands: Collection<string, StringSelectMenuCommand>;
  userSelectMenuCommands: Collection<string, UserSelectMenuCommand>;
  roleSelectMenuCommands: Collection<string, RoleSelectMenuCommand>;
  channelSelectMenuCommands: Collection<string, ChannelSelectMenuCommand>;
  mentionableSelectMenuCommands: Collection<string, MentionableSelectMenuCommand>;
  applicationCommands: Collection<string, ApplicationCommand>;
}
