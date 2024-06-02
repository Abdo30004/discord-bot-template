declare namespace NodeJS {
  interface ProcessEnv {
    TOKEN: string;
    PORT: string;
    MONGO_URI: string;
    DATABASE_NAME: string;
    [key: string]: undefined; //force all env vars to be explicitly defined
  }
}

declare interface String {
  format(record: Record<string, string>): string;
  toTitleCase(): string;
  toCamelCase(firstCapital?: boolean): string;
}

