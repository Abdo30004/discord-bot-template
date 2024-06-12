import { camelCase, formatString, titleCase } from './functions';

String.prototype.format = function (record: Record<string, string>): string {
  return formatString(this.toString(), record);
};

String.prototype.toTitleCase = function (): string {
  return titleCase(this.toString());
};

String.prototype.toCamelCase = function (firstCapital = false): string {
  return camelCase(this.toString(), firstCapital);
};
