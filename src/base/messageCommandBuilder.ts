import { MessageCommandBuilderData, MessageCommandCategory } from '../@types/command';

export class MessageCommandBuilder {
  public data: MessageCommandBuilderData = {
    name: '',
    description: '',
    aliases: [],
    category: null
  };

  constructor(data?: MessageCommandBuilderData) {
    if (data) this.data = data;
  }

  setName(name: string) {
    this.data.name = name;
    return this;
  }

  get name() {
    return this.data.name;
  }

  setDescription(description: string) {
    this.data.description = description;
    return this;
  }

  get description() {
    return this.data.description;
  }

  setAliases(aliases: string[]) {
    this.data.aliases = aliases;
    return this;
  }

  get aliases() {
    return this.data.aliases;
  }

  addAliases(...aliases: string[]) {
    this.data.aliases.push(...aliases.filter(alias => !this.data.aliases.includes(alias)));
    return this;
  }

  setCategory(category: MessageCommandCategory) {
    this.data.category = category;
    return this;
  }

  get category() {
    return this.data.category;
  }

  toJSON() {
    return this.data;
  }
}
