export class MessageCommandBuilder {
	public name: string = '';
	public description: string = '';
	public aliases: string[] = [];

	// constructor() {}

	setName(name: string) {
		this.name = name;
		return this;
	}
	setDescription(description: string) {
		this.description = description;
		return this;
	}

	setAliases(aliases: string[]) {
		this.aliases = aliases;
		return this;
	}

	addAlias(alias: string) {
		this.aliases.push(alias);
		return this;
	}

	toJSON() {
		return JSON.parse(JSON.stringify(this));
	}
}
