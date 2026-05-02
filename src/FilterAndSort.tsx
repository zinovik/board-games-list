import React from 'react';
import { Order } from './types';
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
  order: Order | null;
  isFilterAndSortHidden: boolean;
  onChange: (
    filters: FilterValue[],
    sort: SortValue,
    order: Order,
    isFilterAndSortHidden: boolean,
  ) => void;
}

const FilterAndSort: React.FC<FilterAndSortProps> = ({
  filters,
  sort,
  order,
  isFilterAndSortHidden,
  onChange,
}) => {
  if (!filters || !sort || !order) {
    onChange(
      ['base_game'],
      sortOptions[0].value,
      Order.asc,
      isFilterAndSortHidden,
    ); // defaults
    return null;
  }

  const handleCheckboxChange = (value: FilterValue) => {
    const newFilters = filters.includes(value)
      ? filters.filter((f) => f !== value)
      : [...filters, value];

    onChange(newFilters, sort, order, isFilterAndSortHidden);
  };

  const setSort = (sort: SortValue) =>
    onChange(filters, sort, order, isFilterAndSortHidden);

  const setOrder = (order: Order) =>
    onChange(filters, sort, order, isFilterAndSortHidden);

  const handleIsFilterAndSortHiddenChange = (isFilterAndSortHidden: boolean) =>
    onChange(filters, sort, order, isFilterAndSortHidden);

  return (
    <>
      {!isFilterAndSortHidden && (
        <>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              paddingBottom: '10px',
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

          <div style={{ paddingBottom: '10px' }}>
            <label>Sort:</label>
            {sortOptions.map(({ value, label }) => (
              <label>
                <input
                  type="radio"
                  checked={sort === value}
                  onChange={() => setSort(value)}
                />
                {label}
              </label>
            ))}
          </div>

          <div style={{ paddingBottom: '10px' }}>
            <label>Order:</label>
            {orderOptions.map(({ value, label }) => (
              <label>
                <input
                  type="radio"
                  checked={order === value}
                  onChange={() => setOrder(value)}
                />
                {label}
              </label>
            ))}
          </div>
        </>
      )}

      <div style={{ paddingBottom: '10px' }}>
        Selected filters:{' '}
        {filters
          .map(
            (f) =>
              filterOptions.flatMap((o) => o.options).find((o) => o.value === f)
                ?.label,
          )
          .join(', ')}{' '}
        | Sort: {sortOptions.find((o) => o.value === sort)?.label} | Order:{' '}
        {orderOptions.find((o) => o.value === order)?.label}
      </div>

      <div style={{ paddingBottom: '10px' }}>
        <label>
          <input
            type="checkbox"
            checked={isFilterAndSortHidden}
            onChange={() =>
              handleIsFilterAndSortHiddenChange(!isFilterAndSortHidden)
            }
          />
          Filters and Sort are hidden
        </label>
      </div>
    </>
  );
};

export default FilterAndSort;
