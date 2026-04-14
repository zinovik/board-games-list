import { useState, useEffect } from 'react';
import Filter from './Filter';
import List from './List';
import { fetchGames } from './services/gamesService';
import type { Game } from './services/gamesService';
import './App.css';

function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [filters, setFilters] = useState<string[]>([]);
  const [filterMode, setFilterMode] = useState<'AND' | 'OR'>('OR');

  useEffect(() => {
    const loadGames = async () => {
      const data = await fetchGames();
      setGames(data);
    };
    loadGames();
  }, []);

  return (
    <div className="app">
      <Filter onFilterChange={setFilters} onFilterModeChange={setFilterMode} />
      <List games={games} filters={filters} filterMode={filterMode} />
    </div>
  );
}

export default App;
