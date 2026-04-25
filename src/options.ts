import type { Game } from './types';
import { Mode, Order } from './types';

export const filterOptions = [
  { value: 'owned', label: 'Owned' },
  { value: 'brest', label: 'Owned Brest' },
  { value: 'warszawa', label: 'Owned Warszawa' },
  { value: 'not_owned', label: 'Not owned' },
  { value: 'played', label: 'Played' },
  { value: 'played_at_least_offline', label: 'Played (at least offline)' },
  { value: 'not_played', label: 'Not played' },
  { value: 'played_online_only', label: 'Played online only' },
  { value: 'base_game', label: 'Base game' },
  { value: 'expansion', label: 'Expansion' },
  { value: 'weight_lte_3', label: 'Weight 3-' },
  { value: 'weight_3_4', label: 'Weight 3-4' },
  { value: 'weight_gte_4', label: 'Weight 4+' },
  { value: 'best_at_2', label: 'Best at 2' },
  { value: 'best_at_3', label: 'Best at 3' },
  { value: 'best_at_4_plus', label: 'Best at 4+' },
  { value: 'duels', label: 'Duel games' },
  { value: 'max_players_gte_3', label: 'Max Players 3+' },
  { value: 'max_players_gte_5', label: 'Max Players 5+' },
  { value: 'playing_time_lte_60', label: 'Play Time <= 60m' },
  { value: 'playing_time_60_120', label: 'Play Time 60-120m' },
  { value: 'playing_time_gte_120', label: 'Play Time >= 120m' },
  { value: 'boardgamearena', label: 'BoardGameArena' },
  { value: 'yucata', label: 'Yucata' },
] as const;

export type FilterValue = (typeof filterOptions)[number]['value'];

export const modeOptions: { value: Mode; label: string }[] = [
  { value: Mode.and, label: 'AND' },
  { value: Mode.or, label: 'OR' },
] as const;

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
