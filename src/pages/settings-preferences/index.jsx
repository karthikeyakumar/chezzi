import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import GamePreferencesSection from './components/GamePreferencesSection';
import AICoachingSection from './components/AICoachingSection';
import AudioPreferencesSection from './components/AudioPreferencesSection';
import NotificationSection from './components/NotificationSection';
import AccountManagementSection from './components/AccountManagementSection';
import SettingsNavigation from './components/SettingsNavigation';
import SaveConfirmationBar from './components/SaveConfirmationBar';

const SettingsPreferences = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('game-preferences');
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Default settings state
  const [settings, setSettings] = useState({
    // Game Preferences
    boardTheme: 'classic-wood',
    pieceStyle: 'classic-staunton',
    animationSpeed: 'normal',
    showCoordinates: true,
    highlightMoves: true,
    showLastMove: true,
    pieceShadows: true,
    autoPromoteQueen: false,
    confirmMoves: false,
    showCapturedPieces: true,
    enableUndo: true,

    // AI Coaching
    coachingFrequency: 'major-decisions',
    explanationComplexity: 'intermediate',
    personalityType: 'encouraging-mentor',
    humorLevel: 'light',
    encouragementStyle: 'balanced',
    technicalDepth: 60,
    openingGuidance: true,
    tacticalAlerts: true,
    endgameCoaching: true,
    blunderPrevention: true,
    positionEvaluation: true,
    moveSuggestions: true,
    focusOpening: true,
    focusMiddlegame: true,
    focusEndgame: false,
    focusTactics: true,
    focusPositional: true,
    focusTimeManagement: false,

    // Audio Preferences
    enableVoiceNarration: true,
    selectedVoice: 'sarah-friendly',
    playbackSpeed: '1.0',
    voiceVolume: 75,
    autoReadMoves: true,
    readCoachingTips: true,
    positionDescriptions: false,
    gameStatusUpdates: true,
    enableSoundEffects: true,
    effectsVolume: 80,
    moveSounds: true,
    captureSounds: true,
    checkNotification: true,
    gameEndSounds: true,
    buttonClickSounds: false,
    notificationSounds: true,
    backgroundMusic: false,
    musicVolume: 40,
    musicStyle: 'classical',
    autoPauseDuringCoaching: true,

    // Notifications
    enableEmailNotifications: true,
    emailFrequency: 'weekly',
    progressReports: true,
    achievementNotifications: true,
    coachingSessionSummaries: true,
    newFeatureAnnouncements: false,
    chessTipsArticles: true,
    tournamentInvitations: false,
    dailyPracticeReminders: true,
    reminderTime: '18:00',
    weekendReminders: false,
    streakNotifications: true,
    dailyPuzzleReminders: true,
    puzzleDifficulty: 'intermediate',
    puzzleReminderTime: '09:00',
    puzzleStreakTracking: true,
    browserNotifications: true,
    gameInvitationNotifications: true,
    moveReminderNotifications: false,
    coachingInsightNotifications: true,
    achievementUnlockedNotifications: true,

    // Account Management
    displayName: 'Chess Enthusiast',
    email: 'player@chesstutor.com',
    skillLevel: 'intermediate',
    learningGoal: 'skill-improvement',
    timeZone: 'UTC-5',
    twoFactorAuth: false,
    loginNotifications: true,
    shareProgressWithFriends: true,
    publicProfile: false,
    gameAnalysisSharing: true,
    performanceAnalytics: true,
    marketingCommunications: false
  });

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load saved settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('chesstutor-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Failed to load saved settings:', error);
      }
    }
  }, []);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save to localStorage
      localStorage.setItem('chesstutor-settings', JSON.stringify(settings));
      
      setHasChanges(false);
      setShowSuccessMessage(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
      
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    // Reset to default values (keeping user info)
    setSettings(prev => ({
      ...prev,
      // Game Preferences
      boardTheme: 'classic-wood',
      pieceStyle: 'classic-staunton',
      animationSpeed: 'normal',
      showCoordinates: true,
      highlightMoves: true,
      showLastMove: true,
      pieceShadows: true,
      autoPromoteQueen: false,
      confirmMoves: false,
      showCapturedPieces: true,
      enableUndo: true,
      
      // AI Coaching
      coachingFrequency: 'major-decisions',
      explanationComplexity: 'intermediate',
      personalityType: 'encouraging-mentor',
      humorLevel: 'light',
      encouragementStyle: 'balanced',
      technicalDepth: 60,
      
      // Audio
      enableVoiceNarration: true,
      selectedVoice: 'sarah-friendly',
      playbackSpeed: '1.0',
      voiceVolume: 75,
      enableSoundEffects: true,
      effectsVolume: 80,
      backgroundMusic: false,
      
      // Notifications
      enableEmailNotifications: true,
      emailFrequency: 'weekly',
      dailyPracticeReminders: true,
      reminderTime: '18:00',
      
      // Privacy
      shareProgressWithFriends: true,
      publicProfile: false,
      gameAnalysisSharing: true,
      performanceAnalytics: true
    }));
    setHasChanges(true);
  };

  const handleCancel = () => {
    // Reload settings from localStorage or defaults
    const savedSettings = localStorage.getItem('chesstutor-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Failed to reload settings:', error);
      }
    }
    setHasChanges(false);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'game-preferences':
        return (
          <GamePreferencesSection
            settings={settings}
            onSettingChange={handleSettingChange}
          />
        );
      case 'ai-coaching':
        return (
          <AICoachingSection
            settings={settings}
            onSettingChange={handleSettingChange}
          />
        );
      case 'audio-preferences':
        return (
          <AudioPreferencesSection
            settings={settings}
            onSettingChange={handleSettingChange}
          />
        );
      case 'notifications':
        return (
          <NotificationSection
            settings={settings}
            onSettingChange={handleSettingChange}
          />
        );
      case 'account-management':
        return (
          <AccountManagementSection
            settings={settings}
            onSettingChange={handleSettingChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/main-game-interface')}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="ArrowLeft" size={20} />
            </Button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-heading font-semibold text-foreground">
                Settings & Preferences
              </h1>
              <p className="text-muted-foreground mt-1">
                Customize your chess learning experience
              </p>
            </div>
          </div>

          {/* Success Message */}
          {showSuccessMessage && (
            <div className="bg-success/10 border border-success/20 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-success/20 rounded-full">
                  <Icon name="Check" size={16} className="text-success" />
                </div>
                <div>
                  <p className="text-sm font-medium text-success">
                    Settings saved successfully!
                  </p>
                  <p className="text-xs text-success/80">
                    Your preferences have been updated and will take effect immediately.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navigation */}
          {!isMobile && (
            <SettingsNavigation
              activeSection={activeSection}
              onSectionChange={setActiveSection}
              isMobile={false}
            />
          )}

          {/* Mobile Navigation */}
          {isMobile && (
            <SettingsNavigation
              activeSection={activeSection}
              onSectionChange={setActiveSection}
              isMobile={true}
            />
          )}

          {/* Content Area */}
          <div className="flex-1">
            {renderActiveSection()}
          </div>
        </div>
      </div>

      {/* Save Confirmation Bar */}
      <SaveConfirmationBar
        hasChanges={hasChanges}
        onSave={handleSave}
        onReset={handleReset}
        onCancel={handleCancel}
        isSaving={isSaving}
      />
    </div>
  );
};

export default SettingsPreferences;