import {
  Client as DiscordBotClient,
  ClientOptions,
  Collection,
  REST,
  Routes,
} from "discord.js";
import { cwd } from "process";
import { readdir, lstat } from "fs/promises";
import { resolve } from "path";
import { CommandTypes } from "../@types/enums";
import { Logger } from "../utils/logger";
import { Config } from "../configs/bot";
import { Command } from "../@types/command";
import { AnyEvent } from "../@types/event";
import { connectToDB, database } from "../database/main";
import chalk from "chalk";

class Client<Ready extends boolean = boolean> extends DiscordBotClient<Ready> {
  protected cwd: string = cwd();

  protected isTypescript: boolean = process.argv[1].endsWith(".ts");

  public commands: Collection<CommandTypes, Collection<String, Command>> =
    new Collection();

  public config = Config;

  public logger = Logger;

  public db = database;

  constructor(options: ClientOptions) {
    super(options);
  }

  protected async readDir<T>(dir: string): Promise<T[]> {
    try {
      let baseDir = this.isTypescript ? "src" : "dist";
      let path = resolve(this.cwd, baseDir, dir);
      let files = await readdir(path);
      let data: T[] = [];
      for (let file of files) {
        let filePath = resolve(path, file);
        let stat = await lstat(filePath);

        if (stat.isDirectory()) {
          let insideFiles = (await this.readDir(filePath)) as T[];
          data.push(...insideFiles);
          continue;
        }

        if (
          (this.isTypescript && !file.endsWith(".ts")) ||
          (!this.isTypescript && !file.endsWith(".js"))
        )
          continue;

        let { default: d } = (await import(filePath)) as {
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

  protected async loadCommands(
    commandsDir: string,
    debug = false
  ): Promise<boolean> {
    let commands = await this.readDir<Command>(commandsDir).catch(() => null);
    if (!commands) return false;
    commands = commands.sort(
      (a, b) => a.type - b.type || a.data.name.localeCompare(b.data.name)
    );

    for (let command of commands) {
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

  protected async loadEvents(
    eventsDir: string,
    debug = false
  ): Promise<boolean> {
    let events = await this.readDir<AnyEvent>(eventsDir).catch(() => null);
    if (!events) return false;

    for (let event of events) {
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
    let commands = this.commands
      .filter((commands, type) => type !== CommandTypes.MessageCommand)
      .map((commands) => [...commands.values()])
      .filter((commands) =>
        commands.every((cmd) => cmd.type !== CommandTypes.MessageCommand)
      )
      .flat()
      .map((command) => command.data.toJSON());

    let rest = new REST();

    if (!this.isReady()) return false;

    rest.setToken(this.token);
    try {
      await rest.put(Routes.applicationCommands(this.user.id), {
        body: commands,
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  protected async startDatabase(): Promise<boolean> {
    try {
      let connected = await connectToDB();
      return connected;
    } catch (error) {
      Logger.logError(error as Error);
      return false;
    }
  }

  protected async waitUntilReady(timeout = 60 * 1000): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.isReady()) return resolve(true);
      this.once("ready", () => resolve(true));
      setTimeout(() => reject(false), timeout);
    });
  }

  public async init(options: StartOptions): Promise<boolean> {
    let loadCommands = await this.loadCommands(
      options.commandsDirName,
      options.debug
    );

    if (options.debug && loadCommands) console.log("Commands loaded successfully");

    let loadEvents = await this.loadEvents(
      options.eventsDirName,
      options.debug
    );

    if (options.debug && loadEvents) console.log("Events loaded successfully");

    await this.login(options.token);

    await this.waitUntilReady();

    let registeredCommands = await this.registerCommands();

    if (options.debug && registeredCommands)
      console.log("Commands registered successfully");

    let connectedToDatabase = await this.startDatabase();

    if (options.debug && connectedToDatabase)
      console.log("Connected to database");

    return (
      loadCommands && loadEvents && registeredCommands && connectedToDatabase
    );
  }
}

export { Client };
