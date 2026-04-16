import React, { useState } from 'react';
import type { Game } from './services/gamesService';

interface ListProps {
  games: Game[];
  filters: string[];
  filterMode?: 'AND' | 'OR';
}

const List: React.FC<ListProps> = ({ games, filters, filterMode = 'OR' }) => {
  const [sortBy, setSortBy] = useState<keyof Game>('rank');
  const [order, setOrder] = useState<'ASC' | 'DESC'>('ASC');

  const checkFilter = (game: Game, filter: string): boolean => {
    switch (filter) {
      case 'owned':
        return Boolean(game.ownedCity);
      case 'brest':
        return game.ownedCity === 'Brest';
      case 'warszawa':
        return game.ownedCity === 'Warszawa';
      case 'is_played':
        return game.isPlayed;
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
      case 'max_players_gte_5':
        return game.maxPlayers >= 5;
      default:
        return false;
    }
  };

  const filteredGames =
    filters.length === 0
      ? games
      : games.filter((game) => {
          if (filterMode === 'AND') {
            return filters.every((filter) => checkFilter(game, filter));
          } else {
            return filters.some((filter) => checkFilter(game, filter));
          }
        });

  const sortedGames = filteredGames.sort((a, b) => {
    if (!a[sortBy] && !b[sortBy]) return 0;
    if (!a[sortBy]) return 1;
    if (!b[sortBy]) return -1;

    if (order === 'ASC') {
      return Number(a[sortBy]) - Number(b[sortBy]);
    } else {
      return Number(b[sortBy]) - Number(a[sortBy]);
    }
  });

  return (
    <div className="list">
      <div>
        Sort by:
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as keyof Game)}
        >
          <option value="rank">Rank</option>
          <option value="weight">Weight</option>
          <option value="maxPlayers">Max Players</option>
          <option value="bestPlayers">Best Players</option>
          <option value="playingTime">Play Time</option>
        </select>
        <div style={{ marginBottom: '10px' }}>
          <label>
            <input
              type="radio"
              name="order"
              value="ASC"
              checked={order === 'ASC'}
              onChange={() => setOrder('ASC')}
            />
            ASC (lowest first)
          </label>
          <label style={{ marginLeft: '15px' }}>
            <input
              type="radio"
              name="order"
              value="DESC"
              checked={order === 'DESC'}
              onChange={() => setOrder('DESC')}
            />
            DESC (highest first)
          </label>
        </div>
      </div>
      <div>Items: {sortedGames.length}</div>
      <ul>
        {sortedGames.map((game) => (
          <div
            className="row"
            key={`${game.name}${game.id}`}
            title={game.protectors}
          >
            <div className="cell rank">{game.rank ? `${game.rank}. ` : ''}</div>
            <div className="cell game">
              <a
                href={`https://boardgamegeek.com/${
                  game.id
                    ? `boardgame/${game.id}`
                    : `geeksearch.php?action=search&objecttype=boardgame&q=${game.name}`
                }`}
                target="_blank"
                rel="noopener noreferrer"
              >{`${game.name} (${game.year})`}</a>
            </div>
            <div className="cell sites">
              {game.ownedCity ? ` [${game.ownedCity}]` : ''}
              {game.version ? ` [${game.version.split(' ')[0]}]` : ''}
              {game.isPlayedOnlineOnly ? `[online]` : ''}
              {game.weight ? ` [${game.weight}]` : ''} {game.bestPlayers || '?'}
              /{game.maxPlayers}
              {game.playingTime ? ` ${game.playingTime}m` : ''}
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default List;
