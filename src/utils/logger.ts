import chalk from 'chalk';
import { User } from 'discord.js';

import { Command } from '../types/command';
import { CommandTypes } from '../types/enums';
import { AnyEvent } from '../types/event';

export class Logger {
  public static logError(error: Error, panic = false): void {
    console.log(
      `${chalk.red.underline.bold('Error:')} ${chalk.green.bold(
        error.name
      )} ${chalk.red.bold(error.message)}\n${chalk.white(error.stack)}`
    );
    if (panic) process.exit(1);
  }
  public static logErrorMessage(message: string, panic = false): void {
    console.log(`${chalk.red.underline.bold('Error:')} ${chalk.red.bold(message)}\n`);
    if (panic) process.exit(1);
  }

  public static logWarningMessage(warning: string): void {
    console.log(`${chalk.yellow.underline.bold('Warning:')} ${chalk.red.bold(warning)}\n`);
  }

  public static logEventRegistered(event: AnyEvent): void {
    console.log(
      `${chalk.blue.underline.bold('Event:')} ${chalk.red.bold(event.name)} ${chalk.magenta('has been registered successfully')}\n`
    );
  }
  public static logCommandRegistered(command: Command): void {
    console.log(
      `${chalk.green.underline.bold.bold('Command:')} ${chalk.red.bold(
        command.data.name
      )} ${chalk.blue(CommandTypes[command.type])} ${chalk.magenta('has been registered successfully')}\n`
    );
  }
  public static logCommandUsed(command: Command, user: User) {
    const message = `- ${chalk.greenBright(command.data.name)} ${chalk.red(
      CommandTypes[command.type]
    )} was used by ${chalk.greenBright(user.username)}`;
    console.log(message);
  }
}
