import React from 'react';
import CoachCard from './CoachCard';
import Icon from '../../../components/AppIcon';

const CoachGrid = ({ 
  coaches, 
  selectedCoach, 
  onSelectCoach, 
  onPreviewAudio, 
  isLoading,
  hasFilters 
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-card rounded-xl border border-border p-6 animate-pulse">
            <div className="flex items-center justify-center mb-4">
              <div className="w-20 h-20 bg-muted rounded-full"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
              <div className="h-3 bg-muted rounded w-1/2 mx-auto"></div>
              <div className="h-16 bg-muted rounded"></div>
              <div className="h-8 bg-muted rounded"></div>
              <div className="h-8 bg-muted rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (coaches.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Search" size={24} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-heading font-medium text-foreground mb-2">
          {hasFilters ? 'No coaches match your filters' : 'No coaches available'}
        </h3>
        <p className="text-muted-foreground mb-4">
          {hasFilters 
            ? 'Try adjusting your search criteria or clearing filters to see more options.' :'We\'re working on adding more AI coaches to help with your chess journey.'
          }
        </p>
        {hasFilters && (
          <button
            onClick={() => window.location.reload()}
            className="text-primary hover:underline text-sm"
          >
            Clear all filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {coaches.map((coach) => (
        <CoachCard
          key={coach.id}
          coach={coach}
          isSelected={selectedCoach?.id === coach.id}
          onSelect={onSelectCoach}
          onPreviewAudio={onPreviewAudio}
        />
      ))}
    </div>
  );
};

export default CoachGrid;