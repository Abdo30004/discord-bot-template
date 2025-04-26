import http from 'node:http';

import colors from 'ansi-colors';
import express from 'express';

import { client } from '../index';
import { ENV } from '../utils/env';
import { Logger } from '../utils/logger';

const app = express();

const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/ready', (req, res) => {
  res.json({
    status: client.isReady()
  });
});

app.use((req, res) => {
  res.status(404).send('Not Found');
});

export async function startApi(debug = false): Promise<boolean> {
  const port = ENV.PORT || 3000;
  try {
    server.listen(port, () => {
      if (debug) console.log(colors.white.bold.bgCyanBright(`Server is running http://localhost:${port}`));
    });
    return true;
  } catch (error) {
    Logger.logError(error as Error);
    return false;
  }
}
