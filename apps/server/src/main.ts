import express from 'express';
import cors from 'cors';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();
app.use(cors());

let tokens;

async function setAccessTokens() {
  const url =
    'https://prod.trackmania.core.nadeo.online/v2/authentication/token/basic';

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({ audience: 'NadeoLiveServices' }),
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        'Basic ' +
        Buffer.from('trackermania:Xk;HX5][tG8AC?Ah').toString('base64'),
    },
  });

  tokens = await response.json();
}

// async function refreshToken() {
//   const url =
//     'https://prod.trackmania.core.nadeo.online/v2/authentication/token/refresh';
//
//   const response = await fetch(url, {
//     method: 'POST',
//     body: JSON.stringify({ audience: 'NadeoLiveServices' }),
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `nadeo_v1 t=${tokens.refreshToken}`,
//     },
//   });
//
//   const json = await response.json();
//   tokens = json;
// }

async function getMaps(maps: any[]) {
  const mapUids = maps.map((map) => map.mapUid).join(',');
  const mapsUrl = `https://live-services.trackmania.nadeo.live/api/token/map/get-multiple?mapUidList=${mapUids}`;

  const response = await fetch(mapsUrl, {
    method: 'GET',
    headers: {
      Authorization: `nadeo_v1 t=${tokens.accessToken}`,
    },
  });
  return await response.json();
}

async function singleCampaignWithMaps(queriedId, campaigns) {
  const campaign = campaigns.find((c) => c.seasonUid === queriedId);

  const maps = (await getMaps(campaign.playlist)).mapList;

  return {
    ...campaign,
    maps,
  };
}

async function getCampaigns() {
  const url =
    'https://live-services.trackmania.nadeo.live/api/token/campaign/official?offset=0&length=100';

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `nadeo_v1 t=${tokens.accessToken}`,
    },
  });
  return (await response.json()).campaignList;
}

app.get('/campaigns', async (req, res) => {
  const campaigns = await getCampaigns();

  res.send(campaigns);
});

app.get('/campaign', async (req, res) => {
  const campaigns = await getCampaigns();

  const queriedId = req.query.id as string;
  const toSend = await singleCampaignWithMaps(queriedId, campaigns);
  res.send(toSend);
});

app.listen(port, host, async () => {
  await setAccessTokens();
  console.log(`[ ready ] http://${host}:${port}`);
});
