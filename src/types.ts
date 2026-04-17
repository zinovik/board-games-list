export const Cities = {
  Brest: 'Brest',
  Warszawa: 'Warszawa',
} as const;

export interface Game {
  name: string;
  year: number;
  id?: number;
  ownedCity?: keyof typeof Cities;
  version?: string;
  protectors?: string;
  isPlayed: boolean;
  isPlayedOnlineOnly: boolean;
  rank?: number;
  maxPlayers: number;
  bestPlayers: number;
  weight: number;
  isExpansion: boolean;
  playingTime: number;
  boardGameArena?: string;
  yucata?: string;
}

export const Mode = {
  and: 'and',
  or: 'or',
} as const;

export type Mode = (typeof Mode)[keyof typeof Mode];

export const Order = {
  asc: 'asc',
  desc: 'desc',
} as const;

export type Order = (typeof Order)[keyof typeof Order];
