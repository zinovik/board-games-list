import type { Game } from './types';
import { Order } from './types';

export const filterOptions: { options: { value: string; label: string }[] }[] =
  [
    {
      options: [
        { value: 'brest', label: 'Owned Brest' },
        { value: 'warszawa', label: 'Owned Warszawa' },
        { value: 'not_owned', label: 'Not owned' },
      ],
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
    },

    {
      options: [
        { value: 'base_game', label: 'Base game' },
        { value: 'expansion', label: 'Expansion' },
      ],
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
    },

    {
      options: [
        { value: 'best_at_2', label: 'Best at 2' },
        { value: 'best_at_3', label: 'Best at 3' },
        { value: 'best_at_4_plus', label: 'Best at 4+' },
      ],
    },

    {
      options: [
        { value: 'duels', label: 'Duel games' },
        { value: 'max_players_3', label: 'Max Players 3' },
        { value: 'max_players_4', label: 'Max Players 4' },
        { value: 'max_players_5', label: 'Max Players 5' },
        { value: 'max_players_6_plus', label: 'Max Players 6+' },
      ],
    },

    {
      options: [
        { value: 'playing_time_lte_30', label: 'Play Time < 30m' },
        { value: 'playing_time_30_60', label: 'Play Time 30-60m' },
        { value: 'playing_time_60_90', label: 'Play Time 60-90m' },
        { value: 'playing_time_90_120', label: 'Play Time 90-120m' },
        { value: 'playing_time_120_180', label: 'Play Time 120-180m' },
        { value: 'playing_time_180_plus', label: 'Play Time >= 180m' },
      ],
    },

    {
      options: [
        { value: 'boardgamearena', label: 'BoardGameArena' },
        { value: 'yucata', label: 'Yucata' },
      ],
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
] satisfies { value: keyof Game; label: string }[];

export type SortValue = (typeof sortOptions)[number]['value'];

export const orderOptions: { value: Order; label: string }[] = [
  { value: Order.asc, label: 'ASC' },
  { value: Order.desc, label: 'DESC' },
] as const;
