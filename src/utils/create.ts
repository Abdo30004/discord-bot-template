import { Command } from '../types/command';
import { ClientEventKey, Event } from '../types/event';

export function createEvent<T extends ClientEventKey, Ready extends boolean = true>(event: Event<T, Ready>) {
  return event;
}

export function createCommand(command: Command) {
  return command;
}
