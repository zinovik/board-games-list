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
    onChange(
      filters || ['brest', 'warszawa', 'base_game'],
      sort || sortOptions[0].value,
      true,
      true,
      true,
    ); // defaults
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
      <label style={{ display: 'flex' }}>
        <input
          type="checkbox"
          checked={isFiltersHidden}
          onChange={() => handleIsFiltersHiddenChange(!isFiltersHidden)}
        />
        Filters are hidden
      </label>

      {!isFiltersHidden && (
        <>
          <div
            style={{
              display: 'flex',
              paddingTop: '10px',
              gap: '10px',
              flexDirection: 'column',
            }}
          >
            {filterOptions.map((group) => (
              <div
                key={group.options[0].value}
                style={{ display: 'flex', flexDirection: 'column' }}
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

      <div style={{ paddingTop: '10px' }}>
        Selected filters:{' '}
        {filters
          .map(
            (f) =>
              filterOptions.flatMap((o) => o.options).find((o) => o.value === f)
                ?.label,
          )
          .join(', ')}
      </div>

      <div style={{ paddingTop: '10px' }}>
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

      <div style={{ paddingTop: '10px' }}>
        <label style={{ display: 'flex' }}>
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
