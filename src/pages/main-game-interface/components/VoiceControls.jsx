import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VoiceControls = ({ 
  isEnabled = false, 
  onToggle, 
  currentText = '',
  isPlaying = false,
  onPlay,
  onPause,
  onStop 
}) => {
  const [volume, setVolume] = useState(75);
  const [speed, setSpeed] = useState(1.0);
  const [voice, setVoice] = useState('female');
  const [isExpanded, setIsExpanded] = useState(false);

  // Mock current narration text
  const mockNarrationText = currentText || `Your move 1.e4 is excellent! This is the King's Pawn opening, one of the most popular choices at all levels. By advancing your king's pawn two squares, you immediately stake a claim in the center of the board, controlling the important d5 and f5 squares.`;

  const voiceOptions = [
    { value: 'female', label: 'Elena (Female)', accent: 'American' },
    { value: 'male', label: 'Viktor (Male)', accent: 'British' },
    { value: 'neutral', label: 'Alex (Neutral)', accent: 'Canadian' }
  ];

  const speedOptions = [
    { value: 0.5, label: 'Very Slow' },
    { value: 0.75, label: 'Slow' },
    { value: 1.0, label: 'Normal' },
    { value: 1.25, label: 'Fast' },
    { value: 1.5, label: 'Very Fast' }
  ];

  const handlePlay = () => {
    if (onPlay) {
      onPlay(mockNarrationText, { voice, speed: speed, volume: volume / 100 });
    }
  };

  const handlePause = () => {
    if (onPause) {
      onPause();
    }
  };

  const handleStop = () => {
    if (onStop) {
      onStop();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Mock progress for demonstration
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(45); // 45 seconds

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= duration) {
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  if (!isEnabled) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-subtle p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="VolumeX" size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Voice narration disabled</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onToggle}
            className="text-xs"
          >
            Enable Voice
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle">
      {/* Main Controls */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Icon name="Volume2" size={16} className="text-primary" />
            <span className="text-sm font-medium text-card-foreground">Voice Narration</span>
            <div className="px-2 py-0.5 bg-success/20 text-success text-xs rounded-full">
              Active
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-muted-foreground hover:text-card-foreground"
          >
            <Icon name={isExpanded ? "ChevronUp" : "Settings"} size={16} />
          </Button>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center space-x-3 mb-3">
          <Button
            variant="outline"
            size="icon"
            onClick={isPlaying ? handlePause : handlePlay}
            className="text-primary hover:text-primary"
          >
            <Icon name={isPlaying ? "Pause" : "Play"} size={16} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleStop}
            disabled={!isPlaying && progress === 0}
            className="text-muted-foreground hover:text-card-foreground"
          >
            <Icon name="Square" size={16} />
          </Button>

          <div className="flex-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5">
              <div 
                className="bg-primary h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${(progress / duration) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Current Text Preview */}
        <div className="p-3 bg-muted/30 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="MessageSquare" size={14} className="text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">Now playing:</p>
              <p className="text-sm text-card-foreground line-clamp-2">
                {mockNarrationText}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Settings */}
      {isExpanded && (
        <div className="border-t border-border p-4 bg-muted/20">
          <div className="space-y-4">
            {/* Voice Selection */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Voice
              </label>
              <div className="grid grid-cols-1 gap-2">
                {voiceOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setVoice(option.value)}
                    className={`
                      flex items-center justify-between p-2 rounded-lg border transition-colors text-left
                      ${voice === option.value
                        ? 'border-primary bg-primary/10 text-primary' :'border-border bg-background hover:bg-muted/50 text-card-foreground'
                      }
                    `}
                  >
                    <div>
                      <div className="text-sm font-medium">{option.label}</div>
                      <div className="text-xs opacity-70">{option.accent} accent</div>
                    </div>
                    {voice === option.value && (
                      <Icon name="Check" size={16} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Speed Control */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Speed: {speed}x
              </label>
              <div className="flex items-center space-x-2">
                <Icon name="Rewind" size={14} className="text-muted-foreground" />
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.25"
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                />
                <Icon name="FastForward" size={14} className="text-muted-foreground" />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                {speedOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSpeed(option.value)}
                    className={`
                      px-2 py-1 rounded transition-colors
                      ${speed === option.value
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Volume Control */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Volume: {volume}%
              </label>
              <div className="flex items-center space-x-2">
                <Icon name="VolumeX" size={14} className="text-muted-foreground" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                />
                <Icon name="Volume2" size={14} className="text-muted-foreground" />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="text-muted-foreground hover:text-card-foreground"
              >
                <Icon name="VolumeX" size={14} className="mr-2" />
                Disable Voice
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Test voice functionality
                  handlePlay();
                }}
                className="text-xs"
              >
                <Icon name="TestTube" size={14} className="mr-2" />
                Test Voice
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceControls;