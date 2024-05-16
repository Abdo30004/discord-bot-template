declare namespace NodeJS {
  interface ProcessEnv {
    TOKEN: string;
    PORT: string;
    [key: string]: undefined; //force all env vars to be explicitly defined
  }
}
