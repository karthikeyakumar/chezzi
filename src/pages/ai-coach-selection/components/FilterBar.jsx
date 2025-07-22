import React from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const FilterBar = ({ 
  selectedStyle, 
  onStyleChange, 
  selectedDifficulty, 
  onDifficultyChange,
  searchQuery,
  onSearchChange,
  onClearFilters 
}) => {
  const styleOptions = [
    { value: 'all', label: 'All Styles' },
    { value: 'beginner-friendly', label: 'Beginner-Friendly' },
    { value: 'strategic', label: 'Strategic Focus' },
    { value: 'humorous', label: 'Humorous' },
    { value: 'analytical', label: 'Analytical' },
    { value: 'encouraging', label: 'Encouraging' },
    { value: 'challenging', label: 'Challenging' }
  ];

  const difficultyOptions = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' }
  ];

  const hasActiveFilters = selectedStyle !== 'all' || selectedDifficulty !== 'all' || searchQuery.length > 0;

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Search */}
        <div className="flex-1 lg:max-w-xs">
          <div className="relative">
            <Icon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
            <input
              type="text"
              placeholder="Search coaches..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <Icon name="X" size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <Select
            options={styleOptions}
            value={selectedStyle}
            onChange={onStyleChange}
            placeholder="Coaching Style"
            className="w-full sm:w-48"
          />

          <Select
            options={difficultyOptions}
            value={selectedDifficulty}
            onChange={onDifficultyChange}
            placeholder="Difficulty Level"
            className="w-full sm:w-48"
          />

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              iconName="X"
              iconPosition="left"
              className="whitespace-nowrap"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-border">
          <span className="text-xs text-muted-foreground">Active filters:</span>
          
          {selectedStyle !== 'all' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
              Style: {styleOptions.find(opt => opt.value === selectedStyle)?.label}
              <button
                onClick={() => onStyleChange('all')}
                className="ml-1 hover:text-primary/80"
              >
                <Icon name="X" size={12} />
              </button>
            </span>
          )}
          
          {selectedDifficulty !== 'all' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-accent/10 text-accent">
              Level: {difficultyOptions.find(opt => opt.value === selectedDifficulty)?.label}
              <button
                onClick={() => onDifficultyChange('all')}
                className="ml-1 hover:text-accent/80"
              >
                <Icon name="X" size={12} />
              </button>
            </span>
          )}
          
          {searchQuery && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary/10 text-secondary-foreground">
              Search: "{searchQuery}"
              <button
                onClick={() => onSearchChange('')}
                className="ml-1 hover:text-secondary-foreground/80"
              >
                <Icon name="X" size={12} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterBar;