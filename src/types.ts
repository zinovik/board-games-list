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
  numOwned: number;
}
