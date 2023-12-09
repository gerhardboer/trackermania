import express from 'express';
import cors from 'cors';
import { Client } from 'trackmania.io';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

import { writeFileSync, readFileSync } from 'fs';

const app = express();
app.use(cors());

const client = new Client();

function readCacheFromFile() {
  const file = readFileSync('./cache.json');
  if (file) {
    return JSON.parse(file.toString());
  }
  return {};
}

const cache: any = readCacheFromFile();

app.get('/campaign', async (req, res) => {
  if (!cache.campaign) {
    const campaign = req.params['id']
      ? await client.campaigns.get(0, req.params['id'])
      : await client.campaigns.currentSeason();

    const maps = await campaign.maps();

    cache.campaign = {
      campaign: campaign.name,
      image: campaign.image,
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

    writeFileSync('./cache.json', JSON.stringify(cache));
  }

  res.send(cache.campaign);
});

app.get('/campaigns', async (req, res) => {
  if (!cache.campaigns) {
    const campaigns = await client.campaigns.officialCampaigns();
    cache.campaigns = campaigns.map((campaign) => ({
      name: campaign.name,
      id: campaign.id,
    }));

    writeFileSync('./cache.json', JSON.stringify(cache));
  }

  res.send(cache.campaigns);
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
