import type { Game } from './types';
import { Cities, Order } from './types';

export const filterOptions: {
  options: { value: string; label: string }[];
  check: (game: Game, value: string) => boolean;
}[] = [
  {
    options: [
      { value: 'brest', label: 'Owned Brest' },
      { value: 'warszawa', label: 'Owned Warszawa' },
      { value: 'not_owned', label: 'Not owned' },
    ],
    check: (game: Game, value: string) => {
      switch (value) {
        case 'brest':
          return game.ownedCity === Cities.Brest;
        case 'warszawa':
          return game.ownedCity === Cities.Warszawa;
        case 'not_owned':
          return !game.ownedCity;
        default:
          return false;
      }
    },
  },

  {
    options: [
      {
        value: 'played_at_least_offline',
        label: 'Played (at least offline)',
      },
      { value: 'played_online_only', label: 'Played online only' },
      { value: 'not_played', label: 'Not played' },
    ],
    check: (game: Game, value: string) => {
      switch (value) {
        case 'played_at_least_offline':
          return game.isPlayed && !game.isPlayedOnlineOnly;
        case 'played_online_only':
          return game.isPlayedOnlineOnly;
        case 'not_played':
          return !game.isPlayed;
        default:
          return false;
      }
    },
  },

  {
    options: [
      { value: 'base_game', label: 'Base game' },
      { value: 'expansion', label: 'Expansion' },
    ],
    check: (game: Game, value: string) => {
      switch (value) {
        case 'base_game':
          return !game.isExpansion;
        case 'expansion':
          return game.isExpansion;
        default:
          return false;
      }
    },
  },

  {
    options: [
      { value: 'weight_1_1.5', label: 'Weight 1 - 1.5' },
      { value: 'weight_1.5_2', label: 'Weight 1.5 - 2' },
      { value: 'weight_2_2.5', label: 'Weight 2 - 2.5' },
      { value: 'weight_2.5_3', label: 'Weight 2.5 - 3' },
      { value: 'weight_3_3.5', label: 'Weight 3 - 3.5' },
      { value: 'weight_3.5_4', label: 'Weight 3.5 - 4' },
      { value: 'weight_4_4.5', label: 'Weight 4 - 4.5' },
      { value: 'weight_4.5_plus', label: 'Weight 4.5+' },
    ],
    check: (game: Game, value: string) => {
      switch (value) {
        case 'weight_1_1.5':
          return game.weight >= 1 && game.weight < 1.5;
        case 'weight_1.5_2':
          return game.weight >= 1.5 && game.weight < 2;
        case 'weight_2_2.5':
          return game.weight >= 2 && game.weight < 2.5;
        case 'weight_2.5_3':
          return game.weight >= 2.5 && game.weight < 3;
        case 'weight_3_3.5':
          return game.weight >= 3 && game.weight < 3.5;
        case 'weight_3.5_4':
          return game.weight >= 3.5 && game.weight < 4;
        case 'weight_4_4.5':
          return game.weight >= 4 && game.weight < 4.5;
        case 'weight_4.5_plus':
          return game.weight >= 4.5;
        default:
          return false;
      }
    },
  },

  {
    options: [
      { value: 'best_at_2', label: 'Best at 2' },
      { value: 'best_at_3', label: 'Best at 3' },
      { value: 'best_at_4_plus', label: 'Best at 4+' },
    ],
    check: (game: Game, value: string) => {
      switch (value) {
        case 'best_at_2':
          return game.bestPlayers >= 1.5 && game.bestPlayers < 2.5;
        case 'best_at_3':
          return game.bestPlayers >= 2.5 && game.bestPlayers < 3.5;
        case 'best_at_4_plus':
          return game.bestPlayers >= 3.5;
        default:
          return false;
      }
    },
  },

  {
    options: [
      { value: 'duels', label: 'Duel games' },
      { value: 'max_players_3', label: 'Max Players 3' },
      { value: 'max_players_4', label: 'Max Players 4' },
      { value: 'max_players_5', label: 'Max Players 5' },
      { value: 'max_players_6_plus', label: 'Max Players 6+' },
    ],
    check: (game: Game, value: string) => {
      switch (value) {
        case 'duels':
          return game.maxPlayers === 2;
        case 'max_players_3':
          return game.maxPlayers === 3;
        case 'max_players_4':
          return game.maxPlayers === 4;
        case 'max_players_5':
          return game.maxPlayers === 5;
        case 'max_players_6_plus':
          return game.maxPlayers >= 6;
        case 'max_players_gte_5':
          return game.maxPlayers >= 5;
        default:
          return false;
      }
    },
  },

  {
    options: [
      { value: 'playing_time_30_minus', label: 'Play Time <= 30m' },
      { value: 'playing_time_30_60', label: 'Play Time 30-60m' },
      { value: 'playing_time_60_90', label: 'Play Time 60-90m' },
      { value: 'playing_time_90_120', label: 'Play Time 90-120m' },
      { value: 'playing_time_120_180', label: 'Play Time 120-180m' },
      { value: 'playing_time_180_plus', label: 'Play Time >= 180m' },
    ],
    check: (game: Game, value: string) => {
      switch (value) {
        case 'playing_time_30_minus':
          return game.playingTime <= 30;
        case 'playing_time_30_60':
          return game.playingTime >= 30 && game.playingTime < 60;
        case 'playing_time_60_90':
          return game.playingTime >= 60 && game.playingTime < 90;
        case 'playing_time_90_120':
          return game.playingTime >= 90 && game.playingTime < 120;
        case 'playing_time_120_180':
          return game.playingTime >= 120 && game.playingTime < 180;
        case 'playing_time_180_plus':
          return game.playingTime >= 180;
        default:
          return false;
      }
    },
  },

  {
    options: [
      { value: 'boardgamearena', label: 'BoardGameArena' },
      { value: 'yucata', label: 'Yucata' },
    ],
    check: (game: Game, value: string) => {
      switch (value) {
        case 'boardgamearena':
          return Boolean(game.boardGameArena);
        case 'yucata':
          return Boolean(game.yucata);
        default:
          return false;
      }
    },
  },
] as const;

export type FilterValue =
  (typeof filterOptions)[number]['options'][number]['value'];

export const sortOptions = [
  { value: 'rank', label: 'Rank' },
  { value: 'weight', label: 'Weight' },
  { value: 'maxPlayers', label: 'Max Players' },
  { value: 'bestPlayers', label: 'Best Players' },
  { value: 'playingTime', label: 'Play Time' },
  { value: 'year', label: 'Year' },
  { value: 'numOwned', label: 'Number Owned' },
] satisfies { value: keyof Game; label: string }[];

export type SortValue = (typeof sortOptions)[number]['value'];

export const orderOptions: { value: Order; label: string }[] = [
  { value: Order.asc, label: 'ASC' },
  { value: Order.desc, label: 'DESC' },
] as const;
