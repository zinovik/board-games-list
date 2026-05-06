import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterAndSort from './FilterAndSort';
import List from './List';
import { fetchGames } from './services/gamesService';
import type { Game } from './types';
import type { FilterValue, SortValue } from './options';

const FILTERS_URL_PARAMETER = 'filters';
const SORT_URL_PARAMETER = 'sort';
const IS_ASC_ORDER_URL_PARAMETER = 'asc';
const SHOULD_SHOW_IMAGES_URL_PARAMETER = 'images';
const IS_FILTERS_HIDDEN_URL_PARAMETER = 'hidden';

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
  const sort = searchParams.get(SORT_URL_PARAMETER) as SortValue | null;
  const isAscOrder = searchParams.get(IS_ASC_ORDER_URL_PARAMETER) === 'true';
  const shouldShowImages =
    searchParams.get(SHOULD_SHOW_IMAGES_URL_PARAMETER) === 'true';
  const isFiltersHidden =
    searchParams.get(IS_FILTERS_HIDDEN_URL_PARAMETER) === 'true';

  const setUrlParams = (
    filters: FilterValue[],
    sort: SortValue,
    isAscOrder: boolean,
    shouldShowImages: boolean,
    isFiltersHidden: boolean,
  ) => {
    setSearchParams({
      [FILTERS_URL_PARAMETER]: filters.join(','),
      [SORT_URL_PARAMETER]: sort,
      [IS_ASC_ORDER_URL_PARAMETER]: isAscOrder.toString(),
      [SHOULD_SHOW_IMAGES_URL_PARAMETER]: shouldShowImages.toString(),
      [IS_FILTERS_HIDDEN_URL_PARAMETER]: isFiltersHidden.toString(),
    });
  };

  return (
    <main style={{ maxWidth: 1000, margin: '0 auto' }}>
      <FilterAndSort
        filters={filters}
        sort={sort}
        isAscOrder={isAscOrder}
        shouldShowImages={shouldShowImages}
        isFiltersHidden={isFiltersHidden}
        onChange={setUrlParams}
      />

      {!games || !filters || !sort ? (
        <div>Loading...</div>
      ) : (
        <List
          games={games}
          filters={filters}
          sort={sort}
          isAscOrder={isAscOrder}
          shouldShowImages={shouldShowImages}
        />
      )}
    </main>
  );
}

export default App;
