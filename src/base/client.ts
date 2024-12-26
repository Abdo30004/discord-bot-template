import { Client as DiscordBotClient, ClientOptions, Collection, REST, Routes } from 'discord.js';
import { cwd } from 'process';
import { readdir, lstat } from 'fs/promises';
import { resolve } from 'path';
import { CommandTypes } from '../@types/enums';
import { Logger } from '../utils/logger';
import { Config } from '../configs/bot';
import { Command } from '../@types/command';
import { AnyEvent } from '../@types/event';
import { connectToDB, database } from '../database/main';
import { startApi } from '../api/app';
import chalk from 'chalk';
import process from 'process';

class Client<Ready extends boolean = boolean> extends DiscordBotClient<Ready> {
  protected cwd: string = cwd();

  protected isTypescript: boolean = process.argv[1].endsWith('.ts');

  public commands: Collection<CommandTypes, Collection<string, Command>> = new Collection();

  public config = Config;

  public logger = Logger;

  public db = database;

  public env = process.env;

  constructor(options: ClientOptions) {
    super(options);
  }

  protected async readDir<T>(dir: string): Promise<T[]> {
    try {
      const baseDir = this.isTypescript ? 'src' : 'dist';
      const path = resolve(this.cwd, baseDir, dir);
      const files = await readdir(path);
      const data: T[] = [];
      for (const file of files) {
        const filePath = resolve(path, file);
        const stat = await lstat(filePath);

        if (stat.isDirectory()) {
          const insideFiles = (await this.readDir(filePath)) as T[];
          data.push(...insideFiles);
          continue;
        }

        if ((this.isTypescript && !file.endsWith('.ts')) || (!this.isTypescript && !file.endsWith('.js'))) continue;

        const { default: d } = (await import(filePath)) as {
          [key: string]: T | undefined;
        };

        if (!d) {
          console.log(`File ${filePath} does not have a default export`);
          continue;
        }

        data.push(d);
      }
      return data;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  protected async loadCommands(commandsDir: string, debug = false): Promise<boolean> {
    let commands = await this.readDir<Command>(commandsDir).catch(() => null);
    if (!commands) return false;
    commands = commands.sort((a, b) => a.type - b.type || a.data.name.localeCompare(b.data.name));

    for (const command of commands) {
      let commandsCollection = this.commands.get(command.type);
      if (!commandsCollection) {
        commandsCollection = new Collection();
        this.commands.set(command.type, commandsCollection);
      }

      commandsCollection.set(command.data.name, command);

      if (debug) Logger.logCommandRegistered(command);
    }

    return true;
  }

  protected async loadEvents(eventsDir: string, debug = false): Promise<boolean> {
    const events = await this.readDir<AnyEvent>(eventsDir).catch(() => null);
    if (!events) return false;

    for (const event of events) {
      this.on(event.name, async (...args) => {
        if (!this.isReady()) return false;

        try {
          await event.run(this, ...args);
        } catch (error) {
          console.log(chalk.red`Error in event ${event.name}`);
          Logger.logError(error as Error);
        }
      });

      if (debug) Logger.logEventRegistered(event);
    }

    return true;
  }

  protected async registerCommands(): Promise<boolean> {
    const commands = this.commands
      .filter((commands, type) => type !== CommandTypes.MessageCommand)
      .map(commands => [...commands.values()])
      .filter(commands => commands.every(cmd => cmd.type !== CommandTypes.MessageCommand))
      .flat()
      .map(command => command.data.toJSON());

    const rest = new REST().setToken(this.env.TOKEN);

    try {
      await rest.put(Routes.applicationCommands(this.env.CLIENT_ID), {
        body: commands
      });
      return true;
    } catch (error) {
      console.log(error);
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

  protected waitUntilReady(timeout = 60 * 1000): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.isReady()) return resolve(true);
      this.once('ready', () => resolve(true));
      setTimeout(() => reject(false), timeout);
    });
  }

  public async init(options: StartOptions): Promise<boolean> {
    const loadCommands = await this.loadCommands(options.commandsDirName, options.debug);

    if (options.debug && loadCommands) console.log(chalk.white.bold.bgGreenBright`Commands loaded successfully\n`);

    const loadEvents = await this.loadEvents(options.eventsDirName, options.debug);

    if (options.debug && loadEvents) console.log(chalk.white.bold.bgBlueBright`Events loaded successfully\n`);
    
    const registeredCommands = options.registerCommands ? await this.registerCommands() : true;
    
    if (options.debug && options.registerCommands &&registeredCommands)
      console.log(chalk.white.bold.bgGreen`ApplicationCommands registered successfully\n`);

    const connectedToDatabase = await this.startDatabase();

    if (options.debug && connectedToDatabase) console.log(chalk.bold.white.bgCyanBright`Connected to database\n`);

    await this.login(options.token);

    const startApiSuccess = await startApi(options.debug);

    if (options.debug && startApiSuccess) console.log(chalk.white.bold.bgGreenBright`API started successfully\n`);

    const allSuccess = loadCommands && loadEvents && registeredCommands && connectedToDatabase && startApiSuccess;

    return allSuccess;
  }
}

export { Client };
