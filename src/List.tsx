import React, { useState } from 'react';
import type { Game } from './services/gamesService';

interface ListProps {
  games: Game[];
  filters: string[];
  filterMode?: 'AND' | 'OR';
}

const List: React.FC<ListProps> = ({ games, filters, filterMode = 'OR' }) => {
  const [sortBy, setSortBy] = useState('rank');

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

  const filteredGames = (
    filters.length === 0
      ? games
      : games.filter((game) => {
          if (filterMode === 'AND') {
            return filters.every((filter) => checkFilter(game, filter));
          } else {
            return filters.some((filter) => checkFilter(game, filter));
          }
        })
  ).sort((a, b) => {
    switch (sortBy) {
      case 'rank':
        return (a.rank ?? 99999) - (b.rank ?? 99999);
      case 'weight':
        return (a.weight ?? 99999) - (b.weight ?? 99999);
      case 'maxPlayers':
        return (a.maxPlayers ?? 99999) - (b.maxPlayers ?? 99999);
      case 'bestPlayers':
        return (a.bestPlayers ?? 99999) - (b.bestPlayers ?? 99999);
      case 'playTime':
        return (a.playingTime ?? 99999) - (b.playingTime ?? 99999);
      default:
        return 0;
    }
  });

  return (
    <div className="list">
      <div>
        Sort by:
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="rank">Rank</option>
          <option value="weight">Weight</option>
          <option value="maxPlayers">Max Players</option>
          <option value="bestPlayers">Best Players</option>
          <option value="playTime">Play Time</option>
        </select>
      </div>
      <div>Items: {filteredGames.length}</div>
      <ul>
        {filteredGames.map((game, index) => (
          <li key={index}>
            {game.rank ? `${game.rank}. ` : ''}
            <a
              href={`https://boardgamegeek.com/boardgame/${game.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {game.name} ({game.year})
            </a>
            {game.isExpansion ? ' [Expansion]' : ''}
            {game.ownedCity ? `, owned in ${game.ownedCity}` : ''}
            {game.version ? `, ${game.version}` : ''}
            {game.protectors ? `, ${game.protectors}` : ''}
            {game.isPlayedOnlineOnly ? `, played Online Only` : ''}
            {!game.isPlayedOnlineOnly && game.isPlayed ? `, played` : ''}, w:{' '}
            {game.weight}, mp: {game.maxPlayers}, bp: {game.bestPlayers}, pt:{' '}
            {game.playingTime}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default List;
