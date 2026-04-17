import React from 'react';
import type { Game } from './types';
import { Cities, Mode, Order } from './types';
import type { FilterValue, SortValue } from './options';

interface ListProps {
  games: Game[];
  filters: FilterValue[];
  mode: Mode;
  sort: SortValue;
  order: Order;
}

const checkFilter = (game: Game, filter: FilterValue): boolean => {
  switch (filter) {
    case 'owned':
      return Boolean(game.ownedCity);
    case 'brest':
      return game.ownedCity === Cities.Brest;
    case 'warszawa':
      return game.ownedCity === Cities.Warszawa;
    case 'is_played':
      return game.isPlayed;
    case 'is_played_at_least_offline':
      return game.isPlayed && !game.isPlayedOnlineOnly;
    case 'is_not_played':
      return !game.isPlayed;
    case 'is_played_online_only':
      return game.isPlayedOnlineOnly;
    case 'is_base_game':
      return !game.isExpansion;
    case 'is_expansion':
      return game.isExpansion;
    case 'weight_lte_3':
      return game.weight <= 3;
    case 'weight_3_4':
      return game.weight >= 3 && game.weight <= 4;
    case 'weight_gte_4':
      return game.weight >= 4;
    case 'best_at_2':
      return game.bestPlayers >= 1.5 && game.bestPlayers <= 2.5;
    case 'best_at_3':
      return game.bestPlayers >= 2.5 && game.bestPlayers <= 3.5;
    case 'best_at_4_plus':
      return game.bestPlayers >= 3.5;
    case 'duels':
      return game.maxPlayers === 2;
    case 'max_players_gte_5':
      return game.maxPlayers >= 5;
    case 'playing_time_lte_60':
      return game.playingTime <= 60;
    case 'playing_time_60_120':
      return game.playingTime >= 60 && game.playingTime <= 120;
    case 'playing_time_gte_120':
      return game.playingTime >= 120;
    case 'boardgamearena':
      return Boolean(game.boardGameArena);
    case 'yucata':
      return Boolean(game.yucata);

    default:
      return false;
  }
};

const buildUrl = (name: string, id?: number) =>
  id
    ? `https://boardgamegeek.com/boardgame/${id}`
    : `https://boardgamegeek.com/geeksearch.php?action=search&objecttype=boardgame&q=${name}`;

const formatBestPlayers = (n: number) =>
  Number.isInteger(n) ? `${n}` : `${Math.floor(n)}-${Math.floor(n) + 1}`;

const List: React.FC<ListProps> = ({ games, filters, mode, sort, order }) => {
  const filteredGames =
    filters.length === 0
      ? []
      : games.filter((game) =>
          mode === Mode.and
            ? filters.every((filter) => checkFilter(game, filter))
            : filters.some((filter) => checkFilter(game, filter)),
        );

  const sortedGames = filteredGames.sort((a, b) => {
    if (!a[sort] && !b[sort]) return 0;
    if (!a[sort]) return 1;
    if (!b[sort]) return -1;

    return order === Order.asc
      ? Number(a[sort]) - Number(b[sort])
      : Number(b[sort]) - Number(a[sort]);
  });

  return (
    <>
      <div>Items: {sortedGames.length}</div>

      {sortedGames.map((game) => (
        <div
          style={{ display: 'flex', flexDirection: 'row' }}
          key={`${game.name}${game.id}`}
          title={`${game.version}\n${game.protectors}`}
        >
          <div style={{ width: '3rem' }}>
            {game.rank ? `${game.rank}. ` : ''}
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: window.innerWidth > 800 ? 'row' : 'column',
              flexGrow: 100,
              padding: 2,
            }}
          >
            <div style={{ padding: 2, flexGrow: 100 }}>
              <a
                href={buildUrl(game.name, game.id)}
                target="_blank"
                rel="noopener noreferrer"
              >{`${game.name} (${game.year})`}</a>

              {game.boardGameArena && (
                <a
                  href={game.boardGameArena}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="https://raw.githubusercontent.com/zinovik/digital-board-games/refs/heads/main/src/icons/boargamearena.jpg"
                    style={{
                      paddingLeft: '10px',
                      width: '15px',
                      height: '15px',
                    }}
                  />
                </a>
              )}
              {game.yucata && (
                <a href={game.yucata} target="_blank" rel="noopener noreferrer">
                  <img
                    src="https://raw.githubusercontent.com/zinovik/digital-board-games/refs/heads/main/src/icons/yucata.jpg"
                    style={{
                      paddingLeft: '10px',
                      width: '15px',
                      height: '15px',
                    }}
                  />
                </a>
              )}
            </div>

            <div style={{ textAlign: 'left' }}>
              {game.ownedCity ? ` ${game.ownedCity}` : ''}
              {game.isPlayedOnlineOnly ? `[online]` : ''}
              <strong>{game.weight ? ` ${game.weight}` : ''}</strong>{' '}
              {formatBestPlayers(game.bestPlayers) || '?'}/{game.maxPlayers}
              {game.playingTime ? ` ${game.playingTime}m` : ''}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default List;
