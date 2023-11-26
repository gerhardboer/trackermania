import express from 'express';
import cors from 'cors';
import { Client } from 'trackmania.io';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();
app.use(cors());

const client = new Client();

const cache: any = {};

app.get('/campaign', async (req, res) => {
  if (!cache.campaign) {
    const campaign = await client.campaigns.currentSeason();
    const maps = await campaign.maps();

    cache.campaign = {
      campaign: campaign.name,
      maps: maps.map((map) => ({
        name: map.name,
        author: map.authorName,
        url: map.url,
        thumbnail: map.thumbnail,
        environment: map.environment,
        uploaded: map.uploaded,
        storageId: map.storageId,
        uid: map.uid,
        fileName: map.fileName,
        submitterName: map.submitterName,
        submitter: map.submitter,
      })),
    };
  }

  res.send(cache.campaign);
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
