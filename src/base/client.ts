import { lstat, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import process from 'node:process';

import colors from 'ansi-colors';
import type { ClientOptions } from 'discord.js';
import { Client as DiscordBotClient, Collection, REST, Routes } from 'discord.js';

import { startApi } from '../api/app';
import { Config } from '../configs/bot';
import { connectToDB, database } from '../database/main';
import type { AnyCommand, ApplicationCommand, ClientCommands } from '../types/command';
import { CommandTypes } from '../types/enums';
import type { AnyEvent } from '../types/event';
import { ENV } from '../utils/env';
import { Logger } from '../utils/logger';

export class Client<Ready extends boolean = boolean> extends DiscordBotClient<Ready> {
  protected cwd: string = process.cwd();

  protected isTypescript: boolean = process.argv[1].endsWith('.ts');
  public static readonly sourceFolder = 'src';
  public static readonly distFolder = 'dist';

  public commands: ClientCommands = {
    messageCommands: new Collection(),
    slashCommands: new Collection(),
    contextMenuCommands: new Collection(),
    buttonCommands: new Collection(),
    stringSelectMenuCommands: new Collection(),
    userSelectMenuCommands: new Collection(),
    mentionableSelectMenuCommands: new Collection(),
    roleSelectMenuCommands: new Collection(),
    channelSelectMenuCommands: new Collection(),

    modalSubmit: new Collection(),
    get applicationCommands() {
      return new Collection<string, ApplicationCommand>([...this.slashCommands, ...this.contextMenuCommands]);
    }
  };

  public config = Config;

  public logger = Logger;

  public db = database;

  public env = ENV;

  constructor(options: ClientOptions) {
    super(options);
  }

  protected async readDir<T>(dir: string): Promise<T[]> {
    try {
      const baseDir = this.isTypescript ? Client.sourceFolder : Client.distFolder;
      const path = resolve(this.cwd, baseDir, dir);
      const files = await readdir(path);
      const data: T[] = [];
      for (const file of files) {
        const filePath = resolve(path, file);
        const stat = await lstat(filePath);

        if (stat.isDirectory()) {
          const insideFiles: T[] = await this.readDir(filePath);
          data.push(...insideFiles);
          continue;
        }

        if (!(this.isTypescript ? file.endsWith('.ts') : file.endsWith('.js'))) continue;

        const importData: Record<string, T | undefined> = await import(filePath);
        const importedLength = Object.keys(importData).length;

        if (importedLength === 0) {
          Logger.logErrorMessage(`File ${filePath} is empty, no exports found`, true);
        }

        for (const key in importData) {
          const imported = importData[key] as T;
          data.push(imported);
        }
      }
      return data;
    } catch (error) {
      Logger.logError(error as Error);
      return [];
    }
  }

  protected async loadEvents(eventsDir: string, debug = false): Promise<boolean> {
    const events = await this.readDir<AnyEvent>(eventsDir).catch(() => null);
    if (!events) return false;

    for (const event of events) {
      this.on(event.name, async (...args) => {
        if (!this.isReady() && event.clientIsReady !== false) return false;

        try {
          await event.run(this, ...args);
        } catch (error) {
          console.log(colors.red(`Error in event ${event.name}`));
          Logger.logError(error as Error);
        }
      });

      if (debug) Logger.logEventRegistered(event);
    }

    return true;
  }

  protected async loadCommands(commandsDir: string, debug = false): Promise<boolean> {
    let commands = await this.readDir<AnyCommand>(commandsDir).catch(() => null);
    if (!commands) return false;
    commands = commands.sort((a, b) => a.type - b.type || a.data.name.localeCompare(b.data.name));

    for (const command of commands) {
      switch (command.type) {
        case CommandTypes.MessageCommand:
          this.commands.messageCommands.set(command.data.name, command);
          break;
        case CommandTypes.SlashCommand:
          this.commands.slashCommands.set(command.data.name, command);
          break;
        case CommandTypes.UserContextMenuCommand:
        case CommandTypes.MessageContextMenuCommand:
          this.commands.contextMenuCommands.set(command.data.name, command);
          break;
        case CommandTypes.ButtonCommand:
          this.commands.buttonCommands.set(command.data.customId, command);
          break;
        case CommandTypes.ModalSubmitCommand:
          this.commands.modalSubmit.set(command.data.customId, command);
          break;
        case CommandTypes.StringSelectMenuCommand:
          this.commands.stringSelectMenuCommands.set(command.data.customId, command);
          break;
        case CommandTypes.UserSelectMenuCommand:
          this.commands.userSelectMenuCommands.set(command.data.customId, command);
          break;
        case CommandTypes.RoleSelectMenuCommand:
          this.commands.roleSelectMenuCommands.set(command.data.customId, command);
          break;
        case CommandTypes.MentionableSelectMenuCommand:
          this.commands.mentionableSelectMenuCommands.set(command.data.customId, command);
          break;
        case CommandTypes.ChannelSelectMenuCommand:
          this.commands.channelSelectMenuCommands.set(command.data.customId, command);
          break;
      }

      if (debug) Logger.logCommandRegistered(command);
    }

    return true;
  }

  protected async registerCommands(): Promise<boolean> {
    const commands = this.commands.applicationCommands.map(command => command.data.toJSON());

    const rest = new REST().setToken(ENV.BOT_TOKEN);

    try {
      await rest.put(Routes.applicationCommands(ENV.CLIENT_ID), {
        body: commands
      });
      return true;
    } catch (error) {
      Logger.logError(error as Error);
      return false;
    }
  }

  protected async startDatabase(): Promise<boolean> {
    try {
      const connected = await connectToDB();
      return connected;
    } catch (error) {
      Logger.logError(error as Error);
      return false;
    }
  }

  public async init(options: StartOptions): Promise<boolean> {
    const loadCommands = await this.loadCommands(options.commandsDirName, options.debug);

    if (options.debug && loadCommands) console.log(colors.white.bold.bgGreenBright(`Commands loaded successfully\n`));

    const loadEvents = await this.loadEvents(options.eventsDirName, options.debug);

    if (options.debug && loadEvents) console.log(colors.white.bold.bgBlueBright(`Events loaded successfully\n`));

    const registeredCommands = options.registerCommands ? await this.registerCommands() : true;

    if (options.debug && options.registerCommands && registeredCommands)
      console.log(colors.white.bold.bgGreen(`ApplicationCommands registered successfully\n`));

    const connectedToDatabase = await this.startDatabase();

    if (options.debug && connectedToDatabase) console.log(colors.white.bold.bgCyanBright(`Connected to database\n`));

    const loggedToDiscord = await this.login(options.token)
      .then(() => true)
      .catch(() => false);

    if (options.debug && loggedToDiscord) console.log(colors.white.bold.bgGreenBright(`Logged in to Discord\n`));

    const startApiSuccess = await startApi(options.debug);

    if (options.debug && startApiSuccess) console.log(colors.white.bold.bgGreenBright(`API started successfully\n`));

    const allSuccess =
      loadCommands && loadEvents && registeredCommands && connectedToDatabase && loggedToDiscord && startApiSuccess;

    return allSuccess;
  }
}
