import React, { useState } from 'react';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';


const AudioPreferencesSection = ({ settings, onSettingChange }) => {
  const [isTestingVoice, setIsTestingVoice] = useState(false);

  const voiceOptions = [
    { 
      value: 'sarah-friendly', 
      label: 'Sarah (Friendly)',
      description: 'Warm, encouraging female voice'
    },
    { 
      value: 'david-professional', 
      label: 'David (Professional)',
      description: 'Clear, authoritative male voice'
    },
    { 
      value: 'emma-casual', 
      label: 'Emma (Casual)',
      description: 'Relaxed, conversational female voice'
    },
    { 
      value: 'james-mentor', 
      label: 'James (Mentor)',
      description: 'Experienced, wise male voice'
    }
  ];

  const playbackSpeedOptions = [
    { value: '0.75', label: '0.75x (Slow)', description: 'Slower pace for better comprehension' },
    { value: '1.0', label: '1.0x (Normal)', description: 'Standard speaking speed' },
    { value: '1.25', label: '1.25x (Fast)', description: 'Quicker pace for experienced users' },
    { value: '1.5', label: '1.5x (Very Fast)', description: 'Rapid speech for advanced learners' }
  ];

  const handleVoiceTest = () => {
    setIsTestingVoice(true);
    // Simulate voice test
    setTimeout(() => {
      setIsTestingVoice(false);
    }, 3000);
  };

  const handleVolumeChange = (type, value) => {
    onSettingChange(`${type}Volume`, parseInt(value));
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6 space-y-6">
      <div>
        <h3 className="text-lg font-heading font-semibold text-card-foreground">
          Audio Preferences
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Configure voice narration, sound effects, and audio settings
        </p>
      </div>

      {/* Text-to-Speech Settings */}
      <div>
        <h4 className="text-md font-heading font-medium text-card-foreground mb-4">
          Text-to-Speech Narration
        </h4>
        
        <div className="space-y-4">
          <Checkbox
            label="Enable voice narration"
            description="Hear spoken explanations and coaching guidance"
            checked={settings.enableVoiceNarration}
            onChange={(e) => onSettingChange('enableVoiceNarration', e.target.checked)}
          />

          {settings.enableVoiceNarration && (
            <div className="ml-6 space-y-4 p-4 bg-muted/20 rounded-lg border border-border">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Select
                    label="Voice Selection"
                    description="Choose your preferred narrator voice"
                    options={voiceOptions}
                    value={settings.selectedVoice}
                    onChange={(value) => onSettingChange('selectedVoice', value)}
                  />
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleVoiceTest}
                    loading={isTestingVoice}
                    iconName="Play"
                    iconPosition="left"
                    className="mt-2"
                  >
                    {isTestingVoice ? 'Playing...' : 'Test Voice'}
                  </Button>
                </div>

                <Select
                  label="Playback Speed"
                  description="Adjust speaking speed"
                  options={playbackSpeedOptions}
                  value={settings.playbackSpeed}
                  onChange={(value) => onSettingChange('playbackSpeed', value)}
                />
              </div>

              {/* Voice Volume Control */}
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Voice Volume: {settings.voiceVolume}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={settings.voiceVolume}
                  onChange={(e) => handleVolumeChange('voice', e.target.value)}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Mute</span>
                  <span>Moderate</span>
                  <span>Loud</span>
                </div>
              </div>

              {/* Voice Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Checkbox
                  label="Auto-read moves"
                  description="Automatically narrate moves as they're played"
                  checked={settings.autoReadMoves}
                  onChange={(e) => onSettingChange('autoReadMoves', e.target.checked)}
                />
                
                <Checkbox
                  label="Read coaching tips"
                  description="Narrate AI coaching suggestions"
                  checked={settings.readCoachingTips}
                  onChange={(e) => onSettingChange('readCoachingTips', e.target.checked)}
                />
                
                <Checkbox
                  label="Position descriptions"
                  description="Describe board positions verbally"
                  checked={settings.positionDescriptions}
                  onChange={(e) => onSettingChange('positionDescriptions', e.target.checked)}
                />
                
                <Checkbox
                  label="Game status updates"
                  description="Announce check, checkmate, and draws"
                  checked={settings.gameStatusUpdates}
                  onChange={(e) => onSettingChange('gameStatusUpdates', e.target.checked)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sound Effects */}
      <div>
        <h4 className="text-md font-heading font-medium text-card-foreground mb-4">
          Sound Effects
        </h4>
        
        <div className="space-y-4">
          <Checkbox
            label="Enable sound effects"
            description="Play audio feedback for game events"
            checked={settings.enableSoundEffects}
            onChange={(e) => onSettingChange('enableSoundEffects', e.target.checked)}
          />

          {settings.enableSoundEffects && (
            <div className="ml-6 space-y-4 p-4 bg-muted/20 rounded-lg border border-border">
              {/* Sound Effects Volume */}
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Effects Volume: {settings.effectsVolume}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={settings.effectsVolume}
                  onChange={(e) => handleVolumeChange('effects', e.target.value)}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Individual Sound Effects */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Checkbox
                  label="Move sounds"
                  description="Audio feedback when pieces move"
                  checked={settings.moveSounds}
                  onChange={(e) => onSettingChange('moveSounds', e.target.checked)}
                />
                
                <Checkbox
                  label="Capture sounds"
                  description="Special sound when pieces are captured"
                  checked={settings.captureSounds}
                  onChange={(e) => onSettingChange('captureSounds', e.target.checked)}
                />
                
                <Checkbox
                  label="Check notification"
                  description="Alert sound when king is in check"
                  checked={settings.checkNotification}
                  onChange={(e) => onSettingChange('checkNotification', e.target.checked)}
                />
                
                <Checkbox
                  label="Game end sounds"
                  description="Audio for checkmate, stalemate, and draws"
                  checked={settings.gameEndSounds}
                  onChange={(e) => onSettingChange('gameEndSounds', e.target.checked)}
                />
                
                <Checkbox
                  label="Button clicks"
                  description="Feedback sounds for UI interactions"
                  checked={settings.buttonClickSounds}
                  onChange={(e) => onSettingChange('buttonClickSounds', e.target.checked)}
                />
                
                <Checkbox
                  label="Notification sounds"
                  description="Audio alerts for coaching tips and hints"
                  checked={settings.notificationSounds}
                  onChange={(e) => onSettingChange('notificationSounds', e.target.checked)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Background Audio */}
      <div>
        <h4 className="text-md font-heading font-medium text-card-foreground mb-4">
          Background Audio
        </h4>
        
        <div className="space-y-4">
          <Checkbox
            label="Background music"
            description="Play ambient music during gameplay"
            checked={settings.backgroundMusic}
            onChange={(e) => onSettingChange('backgroundMusic', e.target.checked)}
          />

          {settings.backgroundMusic && (
            <div className="ml-6 space-y-4 p-4 bg-muted/20 rounded-lg border border-border">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Music Volume: {settings.musicVolume}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={settings.musicVolume}
                  onChange={(e) => handleVolumeChange('music', e.target.value)}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              <Select
                label="Music Style"
                description="Choose background music theme"
                options={[
                  { value: 'classical', label: 'Classical', description: 'Traditional classical music' },
                  { value: 'ambient', label: 'Ambient', description: 'Soft electronic soundscapes' },
                  { value: 'nature', label: 'Nature', description: 'Peaceful nature sounds' },
                  { value: 'minimal', label: 'Minimal', description: 'Subtle minimalist compositions' }
                ]}
                value={settings.musicStyle}
                onChange={(value) => onSettingChange('musicStyle', value)}
                className="w-full lg:w-1/2"
              />

              <Checkbox
                label="Auto-pause during coaching"
                description="Automatically lower music when AI coach speaks"
                checked={settings.autoPauseDuringCoaching}
                onChange={(e) => onSettingChange('autoPauseDuringCoaching', e.target.checked)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Audio Test Panel */}
      <div className="bg-accent/5 rounded-lg p-4 border border-accent/20">
        <div className="flex items-center justify-between">
          <div>
            <h5 className="text-sm font-medium text-card-foreground">Audio Test</h5>
            <p className="text-xs text-muted-foreground">Test your current audio settings</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Volume2"
              iconPosition="left"
              onClick={() => console.log('Testing sound effects')}
            >
              Test Effects
            </Button>
            {settings.enableVoiceNarration && (
              <Button
                variant="outline"
                size="sm"
                iconName="MessageCircle"
                iconPosition="left"
                onClick={handleVoiceTest}
                loading={isTestingVoice}
              >
                Test Voice
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPreferencesSection;