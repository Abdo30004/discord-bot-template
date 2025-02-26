import { config as envConfig } from 'dotenv';

import { Logger } from './logger';
envConfig(); // Load environment variables from .env file

export function checkEnvVar<T = string>(name: string, parser?: (value: string) => T, panic?: true): T;
export function checkEnvVar<T = string>(name: string, parser?: (value: string) => T, panic?: false): T | undefined;
export function checkEnvVar<T = string>(
  name: string,
  parser?: (value: string) => T,
  panic: boolean = true
): T | undefined {
  const envVar = process.env[name];
  if (!envVar) {
    if (panic) {
      Logger.logErrorMessage(`Missing required environment variable: ${name}`, true);
    }
    return undefined;
  }
  return parser ? parser(envVar) : envVar;
}

export const PORT = checkEnvVar('PORT', value => parseInt(value));

export const BOT_TOKEN = checkEnvVar('BOT_TOKEN');

export const CLIENT_ID = checkEnvVar('BOT_TOKEN');

export const MONGO_URI = checkEnvVar('MONGO_URI');

export const DATABASE_NAME = checkEnvVar('DATABASE_NAME');

export const NODE_ENV = checkEnvVar('NODE_ENV');

export const ENV = {
  PORT,
  BOT_TOKEN,
  CLIENT_ID,
  MONGO_URI,
  DATABASE_NAME,
  NODE_ENV
};
