import React from 'react';
import { Mode, Order } from './types';
import {
  filterOptions,
  modeOptions,
  orderOptions,
  sortOptions,
  type FilterValue,
  type SortValue,
} from './options';

interface FilterAndSortProps {
  filters: FilterValue[] | null;
  mode: Mode | null;
  sort: SortValue | null;
  order: Order | null;
  onChange: (
    filters: FilterValue[],
    mode: Mode,
    sort: SortValue,
    order: Order,
  ) => void;
}

const FilterAndSort: React.FC<FilterAndSortProps> = ({
  filters,
  mode,
  sort,
  order,
  onChange,
}) => {
  if (!filters || !mode || !sort || !order) {
    onChange(['is_played'], Mode.and, sortOptions[0].value, Order.asc); // defaults
    return null;
  }

  const handleCheckboxChange = (value: FilterValue) => {
    const newFilters = filters.includes(value)
      ? filters.filter((f) => f !== value)
      : [...filters, value];

    onChange(newFilters, mode, sort, order);
  };

  const handleModeChange = (mode: Mode) => onChange(filters, mode, sort, order);

  const setSort = (sort: SortValue) => onChange(filters, mode, sort, order);

  const setOrder = (order: Order) => onChange(filters, mode, sort, order);

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          paddingBottom: '10px',
        }}
      >
        {filterOptions.map((item) => (
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

      <div style={{ paddingBottom: '10px' }}>
        <label>Mode:</label>
        {modeOptions.map(({ value, label }) => (
          <label>
            <input
              type="radio"
              checked={mode === value}
              onChange={() => handleModeChange(value)}
            />
            {label}
          </label>
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
  );
};

export default FilterAndSort;
