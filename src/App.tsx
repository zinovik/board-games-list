import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterAndSort from './FilterAndSort';
import List from './List';
import { fetchGames } from './services/gamesService';
import type { Game, Mode, Order } from './types';
import type { FilterValue, SortValue } from './options';

const FILTERS_URL_PARAMETER = 'filters';
const MODE_URL_PARAMETER = 'mode';
const SORT_URL_PARAMETER = 'sort';
const ORDER_URL_PARAMETER = 'order';
const IS_FILTER_AND_SORT_HIDDEN = 'hidden';

function App() {
  const [games, setGames] = useState<Game[]>();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const loadGames = async () => {
      const data = await fetchGames();
      setGames(data);
    };
    loadGames();
  }, []);

  const filters =
    (searchParams
      .get(FILTERS_URL_PARAMETER)
      ?.split(',')
      .filter((f) => Boolean(f)) as FilterValue[]) ?? null;
  const mode = searchParams.get(MODE_URL_PARAMETER) as Mode | null;
  const sort = searchParams.get(SORT_URL_PARAMETER) as SortValue | null;
  const order = searchParams.get(ORDER_URL_PARAMETER) as Order | null;
  const isFilterAndSortHidden =
    searchParams.get(IS_FILTER_AND_SORT_HIDDEN) === 'true';

  const setUrlParams = (
    filters: FilterValue[],
    mode: Mode,
    sort: SortValue,
    order: Order,
    isFilterAndSortHidden: boolean,
  ) => {
    setSearchParams({
      [FILTERS_URL_PARAMETER]: filters.join(','),
      [MODE_URL_PARAMETER]: mode,
      [SORT_URL_PARAMETER]: sort,
      [ORDER_URL_PARAMETER]: order,
      [IS_FILTER_AND_SORT_HIDDEN]: isFilterAndSortHidden.toString(),
    });
  };

  return (
    <main style={{ maxWidth: 1000, margin: '0 auto' }}>
      <FilterAndSort
        filters={filters}
        mode={mode}
        sort={sort}
        order={order}
        isFilterAndSortHidden={isFilterAndSortHidden}
        onChange={setUrlParams}
      />

      {!games || !filters || !mode || !sort || !order ? (
        <div>Loading...</div>
      ) : (
        <List
          games={games}
          filters={filters}
          mode={mode}
          sort={sort}
          order={order}
        />
      )}
    </main>
  );
}

export default App;
