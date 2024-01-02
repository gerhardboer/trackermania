export type TrackmaniaIoCampaign = Campaign & {
  maps: Track[];
};

export type Campaign = {
  name: string;
  id: number;
  image: string;
  year: string;
  season: string;
  tracks: Track[];
};

export type Track = {
  name: string;
  author: string;
  url: string;
  thumbnail: string;
  uploaded: string;
  storageId: string;
  uid: string;
  fileName: string;
  submitterName: string;
  time?: Time;
};

export type Time = {
  h: number;
  mm: number;
  ss: number;
  SSS: number;
};
