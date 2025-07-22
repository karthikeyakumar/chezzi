import React, { useState, useEffect } from 'react';
import Button from './Button';
import Input from './Input';
import Select from './Select';
import { Checkbox } from './Checkbox';
import Icon from '../AppIcon';

const SettingsModal = ({ isOpen, onClose, user, onSave }) => {
  const [activeTab, setActiveTab] = useState('game');
  const [settings, setSettings] = useState({
    // Game Preferences
    difficulty: 'intermediate',
    boardTheme: 'classic',
    pieceStyle: 'traditional',
    showCoordinates: true,
    highlightMoves: true,
    animateMovements: true,
    
    // AI Coach Settings
    coachPersonality: 'encouraging',
    feedbackFrequency: 'moderate',
    analysisDepth: 'standard',
    voiceEnabled: true,
    hintLevel: 'subtle',
    
    // Audio & Visual
    soundEffects: true,
    moveSound: true,
    captureSound: true,
    checkSound: true,
    backgroundMusic: false,
    musicVolume: 50,
    effectsVolume: 75,
    
    // Account & Privacy
    displayName: '',
    email: '',
    shareProgress: true,
    emailNotifications: true,
    weeklyReport: true,
    marketingEmails: false,
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (user) {
      setSettings(prev => ({
        ...prev,
        displayName: user.name || '',
        email: user.email || '',
        ...user.preferences
      }));
    }
  }, [user]);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(settings);
    }
    setHasChanges(false);
    onClose();
  };

  const handleReset = () => {
    // Reset to default values
    setSettings({
      difficulty: 'intermediate',
      boardTheme: 'classic',
      pieceStyle: 'traditional',
      showCoordinates: true,
      highlightMoves: true,
      animateMovements: true,
      coachPersonality: 'encouraging',
      feedbackFrequency: 'moderate',
      analysisDepth: 'standard',
      voiceEnabled: true,
      hintLevel: 'subtle',
      soundEffects: true,
      moveSound: true,
      captureSound: true,
      checkSound: true,
      backgroundMusic: false,
      musicVolume: 50,
      effectsVolume: 75,
      displayName: user?.name || '',
      email: user?.email || '',
      shareProgress: true,
      emailNotifications: true,
      weeklyReport: true,
      marketingEmails: false,
    });
    setHasChanges(true);
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'game', label: 'Game Settings', icon: 'Gamepad2' },
    { id: 'coach', label: 'AI Coach', icon: 'Bot' },
    { id: 'audio', label: 'Audio & Visual', icon: 'Volume2' },
    { id: 'account', label: 'Account', icon: 'User' },
  ];

  const difficultyOptions = [
    { value: 'beginner', label: 'Beginner', description: 'Patient guidance with basic concepts' },
    { value: 'intermediate', label: 'Intermediate', description: 'Balanced challenge with strategic insights' },
    { value: 'advanced', label: 'Advanced', description: 'Complex analysis and deep tactics' },
  ];

  const boardThemeOptions = [
    { value: 'classic', label: 'Classic Wood' },
    { value: 'modern', label: 'Modern Clean' },
    { value: 'marble', label: 'Marble Elegance' },
    { value: 'tournament', label: 'Tournament Standard' },
  ];

  const pieceStyleOptions = [
    { value: 'traditional', label: 'Traditional Staunton' },
    { value: 'modern', label: 'Modern Minimalist' },
    { value: 'classic', label: 'Classic Wooden' },
  ];

  const coachPersonalityOptions = [
    { value: 'encouraging', label: 'Encouraging', description: 'Positive and supportive feedback' },
    { value: 'analytical', label: 'Analytical', description: 'Detailed technical analysis' },
    { value: 'patient', label: 'Patient Teacher', description: 'Gentle guidance for beginners' },
    { value: 'challenging', label: 'Challenging', description: 'Pushes you to improve faster' },
  ];

  const feedbackFrequencyOptions = [
    { value: 'minimal', label: 'Minimal', description: 'Only critical moments' },
    { value: 'moderate', label: 'Moderate', description: 'Balanced coaching' },
    { value: 'frequent', label: 'Frequent', description: 'Detailed move-by-move guidance' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-4xl max-h-[90vh] bg-card rounded-xl shadow-prominent border border-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-heading font-semibold text-card-foreground">
              Settings & Preferences
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Customize your chess learning experience
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-card-foreground"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="flex h-[600px]">
          {/* Sidebar Navigation */}
          <div className="w-64 border-r border-border bg-muted/30">
            <nav className="p-4 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center w-full px-3 py-2 text-sm rounded-lg transition-colors duration-fast ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-card-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon name={tab.icon} size={16} className="mr-3" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Game Settings Tab */}
              {activeTab === 'game' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-heading font-medium text-card-foreground mb-4">
                      Game Preferences
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Select
                        label="Difficulty Level"
                        description="Choose your preferred challenge level"
                        options={difficultyOptions}
                        value={settings.difficulty}
                        onChange={(value) => handleSettingChange('difficulty', value)}
                      />

                      <Select
                        label="Board Theme"
                        options={boardThemeOptions}
                        value={settings.boardTheme}
                        onChange={(value) => handleSettingChange('boardTheme', value)}
                      />

                      <Select
                        label="Piece Style"
                        options={pieceStyleOptions}
                        value={settings.pieceStyle}
                        onChange={(value) => handleSettingChange('pieceStyle', value)}
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-heading font-medium text-card-foreground mb-3">
                      Visual Aids
                    </h4>
                    <div className="space-y-3">
                      <Checkbox
                        label="Show board coordinates"
                        description="Display A-H and 1-8 labels on the board"
                        checked={settings.showCoordinates}
                        onChange={(e) => handleSettingChange('showCoordinates', e.target.checked)}
                      />
                      <Checkbox
                        label="Highlight possible moves"
                        description="Show available moves when selecting a piece"
                        checked={settings.highlightMoves}
                        onChange={(e) => handleSettingChange('highlightMoves', e.target.checked)}
                      />
                      <Checkbox
                        label="Animate piece movements"
                        description="Smooth animations for piece movements"
                        checked={settings.animateMovements}
                        onChange={(e) => handleSettingChange('animateMovements', e.target.checked)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* AI Coach Tab */}
              {activeTab === 'coach' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-heading font-medium text-card-foreground mb-4">
                      AI Coach Settings
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Select
                        label="Coach Personality"
                        description="Choose your preferred coaching style"
                        options={coachPersonalityOptions}
                        value={settings.coachPersonality}
                        onChange={(value) => handleSettingChange('coachPersonality', value)}
                      />

                      <Select
                        label="Feedback Frequency"
                        description="How often should the coach provide guidance"
                        options={feedbackFrequencyOptions}
                        value={settings.feedbackFrequency}
                        onChange={(value) => handleSettingChange('feedbackFrequency', value)}
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-heading font-medium text-card-foreground mb-3">
                      Coaching Features
                    </h4>
                    <div className="space-y-3">
                      <Checkbox
                        label="Enable voice coaching"
                        description="Hear spoken guidance and explanations"
                        checked={settings.voiceEnabled}
                        onChange={(e) => handleSettingChange('voiceEnabled', e.target.checked)}
                      />
                      <div className="ml-6">
                        <Select
                          label="Hint Level"
                          options={[
                            { value: 'none', label: 'No Hints' },
                            { value: 'subtle', label: 'Subtle Hints' },
                            { value: 'clear', label: 'Clear Guidance' },
                            { value: 'detailed', label: 'Detailed Explanations' },
                          ]}
                          value={settings.hintLevel}
                          onChange={(value) => handleSettingChange('hintLevel', value)}
                          className="mt-3"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Audio & Visual Tab */}
              {activeTab === 'audio' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-heading font-medium text-card-foreground mb-4">
                      Audio & Visual Settings
                    </h3>
                    
                    <div className="space-y-4">
                      <Checkbox
                        label="Sound effects"
                        description="Enable game sound effects"
                        checked={settings.soundEffects}
                        onChange={(e) => handleSettingChange('soundEffects', e.target.checked)}
                      />
                      
                      {settings.soundEffects && (
                        <div className="ml-6 space-y-3">
                          <Checkbox
                            label="Move sounds"
                            checked={settings.moveSound}
                            onChange={(e) => handleSettingChange('moveSound', e.target.checked)}
                          />
                          <Checkbox
                            label="Capture sounds"
                            checked={settings.captureSound}
                            onChange={(e) => handleSettingChange('captureSound', e.target.checked)}
                          />
                          <Checkbox
                            label="Check notification sound"
                            checked={settings.checkSound}
                            onChange={(e) => handleSettingChange('checkSound', e.target.checked)}
                          />
                        </div>
                      )}

                      <Checkbox
                        label="Background music"
                        description="Soft background music during gameplay"
                        checked={settings.backgroundMusic}
                        onChange={(e) => handleSettingChange('backgroundMusic', e.target.checked)}
                      />
                    </div>

                    <div className="mt-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-card-foreground mb-2">
                          Effects Volume: {settings.effectsVolume}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={settings.effectsVolume}
                          onChange={(e) => handleSettingChange('effectsVolume', parseInt(e.target.value))}
                          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                      
                      {settings.backgroundMusic && (
                        <div>
                          <label className="block text-sm font-medium text-card-foreground mb-2">
                            Music Volume: {settings.musicVolume}%
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={settings.musicVolume}
                            onChange={(e) => handleSettingChange('musicVolume', parseInt(e.target.value))}
                            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Account Tab */}
              {activeTab === 'account' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-heading font-medium text-card-foreground mb-4">
                      Account Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Display Name"
                        type="text"
                        value={settings.displayName}
                        onChange={(e) => handleSettingChange('displayName', e.target.value)}
                        placeholder="Your display name"
                      />

                      <Input
                        label="Email Address"
                        type="email"
                        value={settings.email}
                        onChange={(e) => handleSettingChange('email', e.target.value)}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-heading font-medium text-card-foreground mb-3">
                      Privacy & Notifications
                    </h4>
                    <div className="space-y-3">
                      <Checkbox
                        label="Share progress with friends"
                        description="Allow friends to see your chess progress"
                        checked={settings.shareProgress}
                        onChange={(e) => handleSettingChange('shareProgress', e.target.checked)}
                      />
                      <Checkbox
                        label="Email notifications"
                        description="Receive important updates via email"
                        checked={settings.emailNotifications}
                        onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                      />
                      <Checkbox
                        label="Weekly progress report"
                        description="Get a summary of your weekly progress"
                        checked={settings.weeklyReport}
                        onChange={(e) => handleSettingChange('weeklyReport', e.target.checked)}
                      />
                      <Checkbox
                        label="Marketing emails"
                        description="Receive tips, news, and promotional content"
                        checked={settings.marketingEmails}
                        onChange={(e) => handleSettingChange('marketingEmails', e.target.checked)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={!hasChanges}
          >
            Reset to Defaults
          </Button>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleSave}
              disabled={!hasChanges}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;