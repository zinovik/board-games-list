import React, { useState } from 'react';

interface FilterProps {
  onFilterChange: (filters: string[]) => void;
  onFilterModeChange?: (mode: 'AND' | 'OR') => void;
}

const Filter: React.FC<FilterProps> = ({
  onFilterChange,
  onFilterModeChange,
}) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [filterMode, setFilterMode] = useState<'AND' | 'OR'>('OR');

  const filters = [
    { value: 'owned', label: 'Owned' },
    { value: 'brest', label: 'Owned Brest' },
    { value: 'warszawa', label: 'Owned Warszawa' },
    { value: 'is_played', label: 'Played' },
    { value: 'is_played_online_only', label: 'Played online only' },
    { value: 'is_base_game', label: 'Base game' },
    { value: 'is_expansion', label: 'Expansion' },
    { value: 'weight_lte_3', label: 'Weight 3-' },
    { value: 'weight_3_4', label: 'Weight 3-4' },
    { value: 'weight_gte_4', label: 'Weight 4+' },
    { value: 'max_players_gte_5', label: 'Max Players 5+' },
  ];

  const handleCheckboxChange = (value: string) => {
    const newFilters = selectedFilters.includes(value)
      ? selectedFilters.filter((f) => f !== value)
      : [...selectedFilters, value];
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleModeChange = (mode: 'AND' | 'OR') => {
    setFilterMode(mode);
    onFilterModeChange?.(mode);
  };

  return (
    <div className="filter">
      <div style={{ marginBottom: '10px' }}>
        <label>
          <input
            type="radio"
            name="filterMode"
            value="OR"
            checked={filterMode === 'OR'}
            onChange={() => handleModeChange('OR')}
          />
          OR (any match)
        </label>
        <label style={{ marginLeft: '15px' }}>
          <input
            type="radio"
            name="filterMode"
            value="AND"
            checked={filterMode === 'AND'}
            onChange={() => handleModeChange('AND')}
          />
          AND (all match)
        </label>
      </div>
      {filters.map((item) => (
        <label key={item.value}>
          <input
            type="checkbox"
            checked={selectedFilters.includes(item.value)}
            onChange={() => handleCheckboxChange(item.value)}
          />
          {item.label}
        </label>
      ))}
    </div>
  );
};

export default Filter;
