import express, { Express } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookies from 'cookie-parser';
import { env, isProduction, preflightENV } from '~/lib/env';
import { services } from '~/services/router';
import { client } from '~/config';

preflightENV();

(async () => {
  try {
    await client.connect();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();

client.on('connect', () => {
  console.log('Redis client connected');
  return;
});
export const app: Express = express();

app.use(bodyParser.json());
app.use(cookies());
app.use(cors({ origin: true, credentials: true }));

// origin: env('CLIENT_URL') ?

app.use(isProduction ? '/' : '/api', services);

const port = env('PORT') || 8000;

app.listen(port, () => console.log(isProduction ? `\n${env('SERVER_URL')}` : `\nServer: http://localhost:${port} 🚀`));
