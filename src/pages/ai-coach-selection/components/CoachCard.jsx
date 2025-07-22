import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const CoachCard = ({ coach, isSelected, onSelect, onPreviewAudio }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleAudioPreview = () => {
    setIsPlayingAudio(true);
    onPreviewAudio(coach.id, coach.sampleText);
    
    // Simulate audio duration
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 3000);
  };

  return (
    <div className={`relative bg-card rounded-xl border-2 transition-all duration-normal hover:shadow-moderate ${
      isSelected 
        ? 'border-primary shadow-moderate ring-2 ring-primary/20' 
        : 'border-border hover:border-primary/50'
    }`}>
      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center z-10">
          <Icon name="Check" size={14} className="text-primary-foreground" />
        </div>
      )}

      <div className="p-6">
        {/* Coach Avatar */}
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
              <Image
                src={coach.avatar}
                alt={`${coach.name} avatar`}
                className="w-16 h-16 rounded-full object-cover"
              />
            </div>
            {coach.isNew && (
              <div className="absolute -top-1 -right-1 bg-success text-success-foreground text-xs px-2 py-1 rounded-full font-medium">
                New
              </div>
            )}
          </div>
        </div>

        {/* Coach Info */}
        <div className="text-center mb-4">
          <h3 className="text-lg font-heading font-semibold text-card-foreground mb-1">
            {coach.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            {coach.specialty}
          </p>
          <div className="flex items-center justify-center space-x-1 mb-3">
            {coach.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary/50 text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-card-foreground/80 text-center mb-4 line-clamp-3">
          {coach.description}
        </p>

        {/* Sample Dialogue */}
        <div className="bg-muted/30 rounded-lg p-3 mb-4">
          <p className="text-xs text-muted-foreground mb-1">Sample coaching:</p>
          <p className="text-sm text-card-foreground italic">
            "{coach.sampleDialogue}"
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <div className="flex items-center space-x-1">
            <Icon name="Users" size={12} />
            <span>{coach.studentsCount} students</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Star" size={12} className="text-warning fill-current" />
            <span>{coach.rating}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Clock" size={12} />
            <span>{coach.experience}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            fullWidth
            onClick={handleAudioPreview}
            disabled={isPlayingAudio}
            iconName={isPlayingAudio ? "Volume2" : "Play"}
            iconPosition="left"
            className="text-xs"
          >
            {isPlayingAudio ? 'Playing Preview...' : 'Preview Voice'}
          </Button>
          
          <Button
            variant={isSelected ? "default" : "outline"}
            size="sm"
            fullWidth
            onClick={() => onSelect(coach)}
            iconName={isSelected ? "Check" : "UserPlus"}
            iconPosition="left"
          >
            {isSelected ? 'Selected' : 'Select Coach'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CoachCard;