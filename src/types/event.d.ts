import type { ClientEvents } from 'discord.js';

import type { Client } from '../base/client';
declare type ClientEventKey = keyof ClientEvents;

declare interface Event<ClientEvent extends ClientEventKey> {
  name: ClientEvent;
  run: (client: Client<true>, ...args: ClientEvents[ClientEvent]) => Promise<boolean>;
}

declare type AnyEvent = Event<ClientEventKey>;
