import type { ComponentCommandBuilderData } from '../types/command';

export class ComponentCommandBuilder {
  public data: ComponentCommandBuilderData = {
    name: '',
    customId: /.?/
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

  setCustomId(customId: RegExp | string) {
    if (typeof customId === 'string') customId = new RegExp(customId);
    this.data.customId = customId;
    return this;
  }

  get customId() {
    return this.data.customId;
  }

  get needReset() {
    return /[gy]/i.test(this.data.customId.flags);
  }

  reset() {
    this.data.customId.lastIndex = 0;
    return this;
  }

  toJSON() {
    return this.data;
  }
}
