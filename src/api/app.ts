import chalk from 'chalk';
import express from 'express';
import http from 'http';

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

// app.get('/ready', (req, res) => {
//   res.json({
//     status: client.isReady()
//   });
// });

app.use((req, res) => {
  res.status(404).send('Not Found');
});

async function startApi(debug = false): Promise<boolean> {
  const port = ENV.PORT || 3000;
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
