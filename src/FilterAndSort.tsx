import React from 'react';
import {
  filterOptions,
  orderOptions,
  sortOptions,
  type FilterValue,
  type SortValue,
} from './options';

interface FilterAndSortProps {
  filters: FilterValue[] | null;
  sort: SortValue | null;
  isAscOrder: boolean;
  shouldShowImages: boolean;
  isFiltersHidden: boolean;
  onChange: (
    filters: FilterValue[],
    sort: SortValue,
    isAscOrder: boolean,
    shouldShowImages: boolean,
    isFiltersHidden: boolean,
  ) => void;
}

const FilterAndSort: React.FC<FilterAndSortProps> = ({
  filters,
  sort,
  isAscOrder,
  shouldShowImages,
  isFiltersHidden,
  onChange,
}) => {
  if (!filters || !sort) {
    onChange(['base_game'], sortOptions[0].value, true, false, false); // defaults
    return null;
  }

  const handleCheckboxChange = (value: FilterValue) => {
    const newFilters = filters.includes(value)
      ? filters.filter((f) => f !== value)
      : [...filters, value];

    onChange(newFilters, sort, isAscOrder, shouldShowImages, isFiltersHidden);
  };

  const setSort = (sort: SortValue, prevValue: SortValue) =>
    onChange(
      filters,
      sort,
      sort === prevValue ? !isAscOrder : isAscOrder,
      shouldShowImages,
      isFiltersHidden,
    );

  const handleShouldShowImagesChange = (shouldShowImages: boolean) =>
    onChange(filters, sort, isAscOrder, shouldShowImages, isFiltersHidden);

  const handleIsFiltersHiddenChange = (isFiltersHidden: boolean) =>
    onChange(filters, sort, isAscOrder, shouldShowImages, isFiltersHidden);

  return (
    <>
      {!isFiltersHidden && (
        <>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {filterOptions.map((group) => (
              <div
                key={group.options[0].value}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  paddingBottom: '10px',
                }}
              >
                {group.options.map((item) => (
                  <label key={item.value}>
                    <input
                      type="checkbox"
                      checked={filters.includes(item.value)}
                      onChange={() => handleCheckboxChange(item.value)}
                    />
                    {item.label}
                  </label>
                ))}
              </div>
            ))}
          </div>
        </>
      )}

      <div style={{ paddingBottom: '10px' }}>
        <label>
          <input
            type="checkbox"
            checked={isFiltersHidden}
            onChange={() => handleIsFiltersHiddenChange(!isFiltersHidden)}
          />
          Filters are hidden
        </label>
      </div>

      <div style={{ paddingBottom: '10px' }}>
        Selected filters:{' '}
        {filters
          .map(
            (f) =>
              filterOptions.flatMap((o) => o.options).find((o) => o.value === f)
                ?.label,
          )
          .join(', ')}
      </div>

      <div style={{ paddingBottom: '10px' }}>
        <label>
          Sort {orderOptions.find((o) => o.value === isAscOrder)?.label}:
        </label>
        {sortOptions.map(({ value, label }) => (
          <label>
            <input
              type="radio"
              checked={sort === value}
              onClick={() => setSort(value, sort)}
            />
            {label}
          </label>
        ))}
      </div>

      <div style={{ paddingBottom: '10px' }}>
        <label>
          <input
            type="checkbox"
            checked={shouldShowImages}
            onChange={() => handleShouldShowImagesChange(!shouldShowImages)}
          />
          Show images
        </label>
      </div>
    </>
  );
};

export default FilterAndSort;
