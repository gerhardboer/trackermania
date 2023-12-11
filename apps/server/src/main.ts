import express from 'express';
import cors from 'cors';
import { Client } from 'trackmania.io';
import { writeFileSync } from 'fs';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();
app.use(cors());

const client = new Client();

let cache: any = {};

app.get('/clear-cache', async (req, res) => {
  cache = {};
});

app.get('/campaign', async (req, res) => {
  const queriedId = req.query.id as string;
  const campaign = queriedId
    ? await client.campaigns.get(0, parseInt(queriedId))
    : await client.campaigns.currentSeason();

  if (!cache.campaign) cache.campaign = {};
  if (!cache.campaign[campaign.id]) {
    const maps = await campaign.maps();

    cache.campaign[campaign.id] = {
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

  res.send(cache.campaign[campaign.id]);
});

app.get('/campaigns', async (req, res) => {
  if (!cache.campaigns) {
    const campaigns = await client.campaigns.officialCampaigns();
    const response = [];
    for (const campaign of campaigns) {
      response.push({
        name: campaign.name,
        id: campaign.id,
        image: (await campaign.getCampaign()).image,
      });
    }

    cache.campaigns = response;

    writeFileSync('./cache.json', JSON.stringify(cache));
  }

  res.send(cache.campaigns);
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
