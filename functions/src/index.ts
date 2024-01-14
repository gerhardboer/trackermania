import { onRequest } from 'firebase-functions/v2/https';
import * as express from 'express';
import { Request, Response } from 'express';
import { trackermaniaPassword } from './trackermania-password';
import { Server } from './server';

const API_PREFIX = 'api';
const app = express();

let server: Server;

app.use((req, res, next) => {
  if (!server) {
    server = new Server();
    server.setAccessTokens();
  }
  next();
});

// Rewrite Firebase hosting requests: /api/:path => /:path
app.use((req, res, next) => {
  if (req.url.indexOf(`/${API_PREFIX}/`) === 0) {
    req.url = req.url.substring(API_PREFIX.length + 1);
  }
  next();
});

app.get('/campaigns', async (req: Request, res: Response) => {
  const campaigns = await server.getCampaigns();
  res.send(campaigns);
});

app.get('/campaign', async (req: Request, res: Response) => {
  const campaigns = await server.getCampaigns();
  const queriedId = req.query.id as string;
  const toSend = await server.singleCampaignWithMaps(queriedId, campaigns);

  res.send(toSend);
});

exports.server = onRequest(
  { region: 'europe-west1', secrets: [trackermaniaPassword], cors: true },
  app
);
