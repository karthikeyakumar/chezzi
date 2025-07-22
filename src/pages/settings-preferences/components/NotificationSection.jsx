import React from 'react';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const NotificationSection = ({ settings, onSettingChange }) => {
  const emailFrequencyOptions = [
    { value: 'never', label: 'Never', description: 'No email notifications' },
    { value: 'daily', label: 'Daily', description: 'Once per day summary' },
    { value: 'weekly', label: 'Weekly', description: 'Weekly progress reports' },
    { value: 'monthly', label: 'Monthly', description: 'Monthly achievement summaries' }
  ];

  const reminderTimeOptions = [
    { value: '09:00', label: '9:00 AM', description: 'Morning practice reminder' },
    { value: '12:00', label: '12:00 PM', description: 'Lunch break reminder' },
    { value: '18:00', label: '6:00 PM', description: 'Evening practice reminder' },
    { value: '20:00', label: '8:00 PM', description: 'Night practice reminder' }
  ];

  const puzzleDifficultyOptions = [
    { value: 'beginner', label: 'Beginner', description: 'Simple tactical puzzles' },
    { value: 'intermediate', label: 'Intermediate', description: 'Moderate difficulty puzzles' },
    { value: 'advanced', label: 'Advanced', description: 'Challenging tactical problems' },
    { value: 'mixed', label: 'Mixed', description: 'Variety of difficulty levels' }
  ];

  return (
    <div className="bg-card rounded-xl border border-border p-6 space-y-6">
      <div>
        <h3 className="text-lg font-heading font-semibold text-card-foreground">
          Notifications & Reminders
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Manage email preferences and practice reminders
        </p>
      </div>

      {/* Email Notifications */}
      <div>
        <h4 className="text-md font-heading font-medium text-card-foreground mb-4">
          Email Notifications
        </h4>
        
        <div className="space-y-4">
          <Checkbox
            label="Enable email notifications"
            description="Receive chess-related updates via email"
            checked={settings.enableEmailNotifications}
            onChange={(e) => onSettingChange('enableEmailNotifications', e.target.checked)}
          />

          {settings.enableEmailNotifications && (
            <div className="ml-6 space-y-4 p-4 bg-muted/20 rounded-lg border border-border">
              <Select
                label="Email Frequency"
                description="How often should we send you updates"
                options={emailFrequencyOptions}
                value={settings.emailFrequency}
                onChange={(value) => onSettingChange('emailFrequency', value)}
                className="w-full lg:w-1/2"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Checkbox
                  label="Progress reports"
                  description="Weekly summaries of your chess improvement"
                  checked={settings.progressReports}
                  onChange={(e) => onSettingChange('progressReports', e.target.checked)}
                />
                
                <Checkbox
                  label="Achievement notifications"
                  description="Celebrate milestones and accomplishments"
                  checked={settings.achievementNotifications}
                  onChange={(e) => onSettingChange('achievementNotifications', e.target.checked)}
                />
                
                <Checkbox
                  label="Coaching session summaries"
                  description="Recap of AI coaching insights after sessions"
                  checked={settings.coachingSessionSummaries}
                  onChange={(e) => onSettingChange('coachingSessionSummaries', e.target.checked)}
                />
                
                <Checkbox
                  label="New feature announcements"
                  description="Updates about new ChessTutor features"
                  checked={settings.newFeatureAnnouncements}
                  onChange={(e) => onSettingChange('newFeatureAnnouncements', e.target.checked)}
                />
                
                <Checkbox
                  label="Chess tips and articles"
                  description="Educational content and strategy guides"
                  checked={settings.chessTipsArticles}
                  onChange={(e) => onSettingChange('chessTipsArticles', e.target.checked)}
                />
                
                <Checkbox
                  label="Tournament invitations"
                  description="Invites to online chess tournaments"
                  checked={settings.tournamentInvitations}
                  onChange={(e) => onSettingChange('tournamentInvitations', e.target.checked)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Practice Reminders */}
      <div>
        <h4 className="text-md font-heading font-medium text-card-foreground mb-4">
          Practice Reminders
        </h4>
        
        <div className="space-y-4">
          <Checkbox
            label="Daily practice reminders"
            description="Get reminded to practice chess regularly"
            checked={settings.dailyPracticeReminders}
            onChange={(e) => onSettingChange('dailyPracticeReminders', e.target.checked)}
          />

          {settings.dailyPracticeReminders && (
            <div className="ml-6 space-y-4 p-4 bg-muted/20 rounded-lg border border-border">
              <Select
                label="Reminder Time"
                description="When should we remind you to practice"
                options={reminderTimeOptions}
                value={settings.reminderTime}
                onChange={(value) => onSettingChange('reminderTime', value)}
                className="w-full lg:w-1/2"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Checkbox
                  label="Weekend reminders"
                  description="Include Saturday and Sunday reminders"
                  checked={settings.weekendReminders}
                  onChange={(e) => onSettingChange('weekendReminders', e.target.checked)}
                />
                
                <Checkbox
                  label="Streak notifications"
                  description="Celebrate practice streaks and milestones"
                  checked={settings.streakNotifications}
                  onChange={(e) => onSettingChange('streakNotifications', e.target.checked)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Daily Puzzle Reminders */}
      <div>
        <h4 className="text-md font-heading font-medium text-card-foreground mb-4">
          Daily Puzzle Reminders
        </h4>
        
        <div className="space-y-4">
          <Checkbox
            label="Daily puzzle notifications"
            description="Get notified about new tactical puzzles"
            checked={settings.dailyPuzzleReminders}
            onChange={(e) => onSettingChange('dailyPuzzleReminders', e.target.checked)}
          />

          {settings.dailyPuzzleReminders && (
            <div className="ml-6 space-y-4 p-4 bg-muted/20 rounded-lg border border-border">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Select
                  label="Puzzle Difficulty"
                  description="Preferred difficulty level for daily puzzles"
                  options={puzzleDifficultyOptions}
                  value={settings.puzzleDifficulty}
                  onChange={(value) => onSettingChange('puzzleDifficulty', value)}
                />

                <Select
                  label="Puzzle Reminder Time"
                  description="When to send puzzle notifications"
                  options={reminderTimeOptions}
                  value={settings.puzzleReminderTime}
                  onChange={(value) => onSettingChange('puzzleReminderTime', value)}
                />
              </div>

              <Checkbox
                label="Puzzle streak tracking"
                description="Track consecutive days of puzzle solving"
                checked={settings.puzzleStreakTracking}
                onChange={(e) => onSettingChange('puzzleStreakTracking', e.target.checked)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Push Notifications */}
      <div>
        <h4 className="text-md font-heading font-medium text-card-foreground mb-4">
          Browser Notifications
        </h4>
        
        <div className="space-y-4">
          <Checkbox
            label="Enable browser notifications"
            description="Show notifications in your browser"
            checked={settings.browserNotifications}
            onChange={(e) => onSettingChange('browserNotifications', e.target.checked)}
          />

          {settings.browserNotifications && (
            <div className="ml-6 space-y-3 p-4 bg-muted/20 rounded-lg border border-border">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Checkbox
                  label="Game invitations"
                  description="Notifications for game invites"
                  checked={settings.gameInvitationNotifications}
                  onChange={(e) => onSettingChange('gameInvitationNotifications', e.target.checked)}
                />
                
                <Checkbox
                  label="Move reminders"
                  description="Remind when it's your turn to move"
                  checked={settings.moveReminderNotifications}
                  onChange={(e) => onSettingChange('moveReminderNotifications', e.target.checked)}
                />
                
                <Checkbox
                  label="Coaching insights"
                  description="New insights from your AI coach"
                  checked={settings.coachingInsightNotifications}
                  onChange={(e) => onSettingChange('coachingInsightNotifications', e.target.checked)}
                />
                
                <Checkbox
                  label="Achievement unlocked"
                  description="Celebrate new achievements instantly"
                  checked={settings.achievementUnlockedNotifications}
                  onChange={(e) => onSettingChange('achievementUnlockedNotifications', e.target.checked)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notification Preview */}
      <div className="bg-success/5 rounded-lg p-4 border border-success/20">
        <div className="flex items-start space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-success/20 rounded-full flex-shrink-0">
            <Icon name="Bell" size={16} className="text-success" />
          </div>
          <div className="flex-1">
            <h5 className="text-sm font-medium text-card-foreground">Notification Preview</h5>
            <p className="text-xs text-muted-foreground mt-1">
              "Great job! You've completed your daily puzzle and maintained your 7-day streak. 
              Your tactical rating has improved by 15 points this week!"
            </p>
            <p className="text-xs text-success mt-2">
              Sample notification based on your current settings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSection;