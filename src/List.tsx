import React from 'react';
import type { Game } from './types';
import { Order } from './types';
import { filterOptions, type FilterValue, type SortValue } from './options';

interface ListProps {
  games: Game[];
  filters: FilterValue[];
  sort: SortValue;
  order: Order;
}

const buildUrl = (name: string, id?: number) =>
  id
    ? `https://boardgamegeek.com/boardgame/${id}`
    : `https://boardgamegeek.com/geeksearch.php?action=search&objecttype=boardgame&q=${name}`;

const formatBestPlayers = (n: number) =>
  Number.isInteger(n) ? `${n}` : `${Math.floor(n)}-${Math.floor(n) + 1}`;

const List: React.FC<ListProps> = ({ games, filters, sort, order }) => {
  const selectedFilterOptions = filterOptions
    .map((group) => ({
      check: group.check,
      options: group.options.filter((option) => filters.includes(option.value)),
    }))
    .filter((group) => group.options.length > 0);

  const filteredGames = games.filter((game) =>
    selectedFilterOptions.every((group) =>
      group.options.some((option) => group.check(game, option.value)),
    ),
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
              {game.playingTime ? ` ${game.playingTime}m` : ''} ({game.numOwned}
              )
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default List;
