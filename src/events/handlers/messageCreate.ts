import { Event } from "../../@types/event";
import { CommandTypes } from "../../@types/enums";
import { MessageCommand } from "../../@types/command";

let event: Event<"messageCreate"> = {
  name: "messageCreate",
  run: async (client, message) => {
    if (message.partial) await message.fetch().catch(() => null);
    if (message.author.bot) return false;

    if (!message.content.startsWith(client.config.prefix)) return false;

    let [commandName, ...args] = message.content
      .trim()
      .slice(client.config.prefix.length)
      .split(/ +/);

    let commandsCollection = client.commands.get(CommandTypes.MessageCommand);
    if (!commandsCollection) return false;

    let command = commandsCollection.get(commandName) as MessageCommand;
    if (!command) return false;
    if (command.devOnly && !client.config.devsIds.includes(message.author.id))
      return false;

    client.logger.logCommandUsed(command, message.author);

    try {
      await command.execute(client, message, args);
    } catch (error) {
      client.logger.logError(error as Error);
      return false;
    }

    return true;
  },
};

export default event;
