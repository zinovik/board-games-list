import React, { useEffect, useState } from 'react';
import type { Game } from './types';
import { filterOptions, type FilterValue, type SortValue } from './options';

interface ListProps {
  games: Game[];
  filters: FilterValue[];
  sort: SortValue;
  isAscOrder: boolean;
  shouldShowImages: boolean;
}

const BOARD_GAME_ARENA_ICON_URL =
  'https://raw.githubusercontent.com/zinovik/digital-board-games/refs/heads/main/src/icons/boargamearena.jpg';
const YUCATA_ICON_URL =
  'https://raw.githubusercontent.com/zinovik/digital-board-games/refs/heads/main/src/icons/yucata.jpg';

const IMG_WIDTH = 150;

const buildUrl = (name: string, id?: number) =>
  id
    ? `https://boardgamegeek.com/boardgame/${id}`
    : `https://boardgamegeek.com/geeksearch.php?action=search&objecttype=boardgame&q=${name}`;

const formatBestPlayers = (n: number) =>
  Number.isInteger(n) ? `${n}` : `${Math.floor(n)}-${Math.floor(n) + 1}`;

const List: React.FC<ListProps> = ({
  games,
  filters,
  sort,
  isAscOrder,
  shouldShowImages,
}) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

    if (typeof a[sort] === 'string' && typeof b[sort] === 'string') {
      return isAscOrder
        ? a[sort].localeCompare(b[sort])
        : b[sort].localeCompare(a[sort]);
    }

    if (typeof a[sort] === 'number' && typeof b[sort] === 'number') {
      return isAscOrder ? a[sort] - b[sort] : b[sort] - a[sort];
    }

    return 0;
  });

  const oneLineMode = !shouldShowImages && windowWidth >= 800;

  const multiLinesMode =
    (shouldShowImages && windowWidth < 600) || windowWidth < 500 - IMG_WIDTH;

  return (
    <>
      <div style={{ paddingTop: '10px' }}>Items: {sortedGames.length}</div>

      {sortedGames.map((game) => (
        <div // main game line div
          style={{ display: 'flex', paddingTop: '12px' }}
          key={`${game.name}${game.id}`}
          title={`${game.version}\n${game.protectors}`}
        >
          {shouldShowImages && (
            <div // image div
              style={{
                width: IMG_WIDTH,
                paddingRight: '10px',
                display: 'flex',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <img
                src={`/board-games-list/images/${game.id}.jpg`}
                style={{ maxWidth: IMG_WIDTH }}
                alt="🎲"
              />
            </div>
          )}

          <div // rank, name, platforms div, info, owners div
            style={{
              display: 'flex',
              flexDirection: oneLineMode ? 'row' : 'column',
              flexGrow: oneLineMode ? 100 : 0,
            }}
          >
            <div // rank, name and platforms div
              style={{
                display: 'flex',
                flexDirection: multiLinesMode ? 'column' : 'row',
                flexGrow: oneLineMode ? 100 : 0,
              }}
            >
              {(game.rank || oneLineMode) && (
                <div // rank div
                  style={{
                    width: oneLineMode ? '3rem' : 'auto',
                    paddingRight: oneLineMode || multiLinesMode ? 0 : '10px',
                    display: 'flex',
                    flexShrink: 0,
                    justifyContent: oneLineMode ? 'center' : 'left',
                  }}
                >
                  {game.rank}
                </div>
              )}

              <div // name and platforms div
                style={{
                  flexGrow: oneLineMode ? 0 : 100,
                }}
              >
                <a
                  href={buildUrl(game.name, game.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <strong>{`${game.name} (${game.year})`}</strong>
                </a>

                {[
                  [game.boardGameArena, BOARD_GAME_ARENA_ICON_URL],
                  [game.yucata, YUCATA_ICON_URL],
                ].map(
                  ([url, iconUrl]) =>
                    url && (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ paddingLeft: '5px' }}
                        key={iconUrl}
                      >
                        <img
                          src={iconUrl}
                          style={{ width: '15px', height: '15px' }}
                        />
                      </a>
                    ),
                )}
              </div>
            </div>

            {/* info and owners div */}
            <div
              style={{
                display: 'flex',
                flexDirection: multiLinesMode ? 'column' : 'row',
                gap: multiLinesMode ? 0 : '10px',
                paddingLeft: oneLineMode ? '10px' : 0,
              }}
            >
              {/* info div */}
              <div>
                {game.ownedCity ? ` ${game.ownedCity}` : ''}
                {game.isPlayedOnlineOnly ? `[online]` : ''}
                <strong>{game.weight ? ` ${game.weight}` : ''}</strong>{' '}
                {formatBestPlayers(game.bestPlayers) || '?'}/{game.maxPlayers}
                {game.playingTime ? ` ${game.playingTime}m` : ''}
              </div>

              {/* owners div */}
              <div>({game.numOwned})</div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default List;
