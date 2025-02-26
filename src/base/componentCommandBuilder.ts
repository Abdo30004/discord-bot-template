import type { ComponentCommandBuilderData } from '../types/command';

export class ComponentCommandBuilder {
  public data: ComponentCommandBuilderData = {
    name: '',
    customId: ''
  };

  constructor(data?: ComponentCommandBuilderData) {
    if (data) this.data = data;
  }

  setName(name: string) {
    this.data.name = name;
    return this;
  }

  get name() {
    return this.data.name;
  }

  setCustomId(customId: string) {
    this.data.customId = customId;
    return this;
  }

  get customId() {
    return this.data.customId;
  }

  toJSON() {
    return this.data;
  }
}
