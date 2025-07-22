import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const StickyActionBar = ({ selectedCoach, onContinue, onBack }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-prominent z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={onBack}
            iconName="ArrowLeft"
            iconPosition="left"
            className="text-muted-foreground hover:text-foreground"
          >
            Back
          </Button>

          {/* Selected Coach Info & Continue */}
          <div className="flex items-center space-x-4">
            {selectedCoach && (
              <div className="hidden sm:flex items-center space-x-3 bg-card border border-border rounded-lg px-4 py-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                  <Icon name="Bot" size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-card-foreground">
                    {selectedCoach.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedCoach.specialty}
                  </p>
                </div>
              </div>
            )}

            <Button
              variant="default"
              size="lg"
              onClick={onContinue}
              disabled={!selectedCoach}
              iconName="ArrowRight"
              iconPosition="right"
              className="min-w-[200px]"
            >
              {selectedCoach 
                ? `Continue with ${selectedCoach.name.split(' ')[0]}` 
                : 'Select a Coach'
              }
            </Button>
          </div>
        </div>

        {/* Mobile Selected Coach Info */}
        {selectedCoach && (
          <div className="sm:hidden mt-3 flex items-center space-x-3 bg-card border border-border rounded-lg px-4 py-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
              <Icon name="Bot" size={18} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-card-foreground">
                Selected: {selectedCoach.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {selectedCoach.specialty} • {selectedCoach.experience}
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Star" size={14} className="text-warning fill-current" />
              <span className="text-xs text-muted-foreground">{selectedCoach.rating}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StickyActionBar;