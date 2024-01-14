export type TrackmaniaIoCampaign = Campaign & {
  maps: Track[];
};

export type Campaign = {
  seasonUid: string;
  name: string;
  image: string;
  year: string;
  season: string;
  tracks: Track[];
};

export type Track = {
  uid: string;
  name: string;
  author: string;
  url: string;
  thumbnailUrl: string;
  uploaded: string;
  storageId: string;
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

export type TimeRegistration = {
  date: number;
  time?: Time;
  timeInMillis?: number;
};
