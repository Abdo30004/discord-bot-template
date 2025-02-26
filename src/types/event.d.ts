import type { ClientEvents } from 'discord.js';

import type { Client } from '../base/client';
declare type ClientEventKey = keyof ClientEvents;

declare interface Event<ClientEvent extends ClientEventKey, Ready extends boolean> {
  name: ClientEvent;
  clientIsReady?: Ready;
  run: (client: Client<Ready>, ...args: ClientEvents[ClientEvent]) => Promise<boolean>;
}

declare type AnyEvent = Event<ClientEventKey, boolean>;
