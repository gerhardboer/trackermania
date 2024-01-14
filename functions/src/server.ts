import { trackermaniaPassword } from './trackermania-password';

export class Server {
  private tokens: { accessToken: string; refreshToken: string } = {
    accessToken: '',
    refreshToken: '',
  };

  async setAccessTokens() {
    const url =
      'https://prod.trackmania.core.nadeo.online/v2/authentication/token/basic';

    const password = trackermaniaPassword.value();

    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ audience: 'NadeoLiveServices' }),
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Basic ' + Buffer.from(`trackermania:${password}`).toString('base64'),
      },
    });

    this.tokens = await response.json();
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

  async getMaps(maps: any[]) {
    const mapUids = maps.map((map) => map.mapUid).join(',');
    const mapsUrl = `https://live-services.trackmania.nadeo.live/api/token/map/get-multiple?mapUidList=${mapUids}`;

    const response = await fetch(mapsUrl, {
      method: 'GET',
      headers: {
        Authorization: `nadeo_v1 t=${this.tokens.accessToken}`,
      },
    });
    return await response.json();
  }

  async singleCampaignWithMaps(queriedId: string, campaigns: any[]) {
    const campaign = campaigns.find((c) => c.seasonUid === queriedId);

    const maps = (await this.getMaps(campaign.playlist)).mapList;

    return {
      ...campaign,
      maps,
    };
  }

  async getCampaigns() {
    const url =
      'https://live-services.trackmania.nadeo.live/api/token/campaign/official?offset=0&length=100';

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `nadeo_v1 t=${this.tokens.accessToken}`,
      },
    });
    return (await response.json()).campaignList;
  }
}
