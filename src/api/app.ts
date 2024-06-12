import express from 'express';
import http from 'http';
import chalk from 'chalk';
import { Logger } from '../utils/logger';

import { client } from '../index';

const app = express();

const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/commands', (req, res) => {
  res.json(client.commands);
});

app.use((req, res) => {
  res.status(404).send('Not Found');
});

async function startApi(debug = false): Promise<boolean> {
  const port = Number(process.env.PORT) || 3000;
  try {
    server.listen(port, () => {
      if (debug) console.log(chalk.green(`Server is running on port http://localhost:${port}`));
    });
    return true;
  } catch (error) {
    Logger.logError(error as Error);
    return false;
  }
}

export { startApi };
