import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';


const AccountManagementSection = ({ settings, onSettingChange }) => {
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  const skillLevelOptions = [
    { value: 'absolute-beginner', label: 'Absolute Beginner', description: 'Just learning the rules' },
    { value: 'beginner', label: 'Beginner', description: 'Know the rules, learning basics' },
    { value: 'intermediate', label: 'Intermediate', description: 'Understand tactics and strategy' },
    { value: 'advanced', label: 'Advanced', description: 'Strong player with deep knowledge' },
    { value: 'expert', label: 'Expert', description: 'Tournament-level player' }
  ];

  const learningGoalOptions = [
    { value: 'casual-fun', label: 'Casual Fun', description: 'Play for enjoyment and relaxation' },
    { value: 'skill-improvement', label: 'Skill Improvement', description: 'Steadily improve chess abilities' },
    { value: 'competitive-play', label: 'Competitive Play', description: 'Prepare for tournaments' },
    { value: 'teaching-others', label: 'Teaching Others', description: 'Learn to teach chess effectively' },
    { value: 'professional-development', label: 'Professional Development', description: 'Pursue chess professionally' }
  ];

  const timeZoneOptions = [
    { value: 'UTC-8', label: 'Pacific Time (UTC-8)' },
    { value: 'UTC-7', label: 'Mountain Time (UTC-7)' },
    { value: 'UTC-6', label: 'Central Time (UTC-6)' },
    { value: 'UTC-5', label: 'Eastern Time (UTC-5)' },
    { value: 'UTC+0', label: 'Greenwich Mean Time (UTC+0)' },
    { value: 'UTC+1', label: 'Central European Time (UTC+1)' },
    { value: 'UTC+5:30', label: 'India Standard Time (UTC+5:30)' },
    { value: 'UTC+8', label: 'China Standard Time (UTC+8)' }
  ];

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (passwordErrors[field]) {
      setPasswordErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validatePasswordChange = () => {
    const errors = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = () => {
    if (validatePasswordChange()) {
      // Simulate password change
      console.log('Password changed successfully');
      setShowPasswordChange(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6 space-y-6">
      <div>
        <h3 className="text-lg font-heading font-semibold text-card-foreground">
          Account Management
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your profile, security, and privacy settings
        </p>
      </div>

      {/* Profile Information */}
      <div>
        <h4 className="text-md font-heading font-medium text-card-foreground mb-4">
          Profile Information
        </h4>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Input
            label="Display Name"
            type="text"
            placeholder="Your display name"
            value={settings.displayName}
            onChange={(e) => onSettingChange('displayName', e.target.value)}
            description="This name will be visible to other players"
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="your@email.com"
            value={settings.email}
            onChange={(e) => onSettingChange('email', e.target.value)}
            description="Used for notifications and account recovery"
          />

          <Select
            label="Skill Level"
            description="Help us provide appropriate coaching"
            options={skillLevelOptions}
            value={settings.skillLevel}
            onChange={(value) => onSettingChange('skillLevel', value)}
          />

          <Select
            label="Time Zone"
            description="For scheduling and tournament times"
            options={timeZoneOptions}
            value={settings.timeZone}
            onChange={(value) => onSettingChange('timeZone', value)}
          />
        </div>

        <div className="mt-6">
          <Select
            label="Primary Learning Goal"
            description="What do you hope to achieve with ChessTutor?"
            options={learningGoalOptions}
            value={settings.learningGoal}
            onChange={(value) => onSettingChange('learningGoal', value)}
            className="w-full lg:w-1/2"
          />
        </div>
      </div>

      {/* Security Settings */}
      <div>
        <h4 className="text-md font-heading font-medium text-card-foreground mb-4">
          Security & Authentication
        </h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border">
            <div>
              <h5 className="text-sm font-medium text-card-foreground">Password</h5>
              <p className="text-xs text-muted-foreground">
                Last changed: January 15, 2025
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPasswordChange(!showPasswordChange)}
              iconName="Key"
              iconPosition="left"
            >
              Change Password
            </Button>
          </div>

          {showPasswordChange && (
            <div className="ml-4 p-4 bg-muted/10 rounded-lg border border-border space-y-4">
              <Input
                label="Current Password"
                type="password"
                placeholder="Enter current password"
                value={passwordData.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                error={passwordErrors.currentPassword}
                required
              />

              <Input
                label="New Password"
                type="password"
                placeholder="Enter new password"
                value={passwordData.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                error={passwordErrors.newPassword}
                description="Must be at least 8 characters long"
                required
              />

              <Input
                label="Confirm New Password"
                type="password"
                placeholder="Confirm new password"
                value={passwordData.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                error={passwordErrors.confirmPassword}
                required
              />

              <div className="flex items-center space-x-3">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handlePasswordSubmit}
                  iconName="Check"
                  iconPosition="left"
                >
                  Update Password
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPasswordChange(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <Checkbox
            label="Two-factor authentication"
            description="Add an extra layer of security to your account"
            checked={settings.twoFactorAuth}
            onChange={(e) => onSettingChange('twoFactorAuth', e.target.checked)}
          />

          <Checkbox
            label="Login notifications"
            description="Get notified when someone logs into your account"
            checked={settings.loginNotifications}
            onChange={(e) => onSettingChange('loginNotifications', e.target.checked)}
          />
        </div>
      </div>

      {/* Privacy Controls */}
      <div>
        <h4 className="text-md font-heading font-medium text-card-foreground mb-4">
          Privacy & Data Sharing
        </h4>
        
        <div className="space-y-4">
          <Checkbox
            label="Share progress with friends"
            description="Allow friends to see your chess improvement and achievements"
            checked={settings.shareProgressWithFriends}
            onChange={(e) => onSettingChange('shareProgressWithFriends', e.target.checked)}
          />
          
          <Checkbox
            label="Public profile"
            description="Make your profile visible to other ChessTutor users"
            checked={settings.publicProfile}
            onChange={(e) => onSettingChange('publicProfile', e.target.checked)}
          />
          
          <Checkbox
            label="Game analysis sharing"
            description="Allow anonymized game data to improve AI coaching"
            checked={settings.gameAnalysisSharing}
            onChange={(e) => onSettingChange('gameAnalysisSharing', e.target.checked)}
          />
          
          <Checkbox
            label="Performance analytics"
            description="Help improve ChessTutor by sharing usage analytics"
            checked={settings.performanceAnalytics}
            onChange={(e) => onSettingChange('performanceAnalytics', e.target.checked)}
          />
          
          <Checkbox
            label="Marketing communications"
            description="Receive promotional emails and special offers"
            checked={settings.marketingCommunications}
            onChange={(e) => onSettingChange('marketingCommunications', e.target.checked)}
          />
        </div>
      </div>

      {/* Data Management */}
      <div>
        <h4 className="text-md font-heading font-medium text-card-foreground mb-4">
          Data Management
        </h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border">
            <div>
              <h5 className="text-sm font-medium text-card-foreground">Export Data</h5>
              <p className="text-xs text-muted-foreground">
                Download all your chess games, progress, and account data
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
            >
              Export Data
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-warning/5 rounded-lg border border-warning/20">
            <div>
              <h5 className="text-sm font-medium text-card-foreground">Delete Account</h5>
              <p className="text-xs text-muted-foreground">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              iconName="Trash2"
              iconPosition="left"
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>

      {/* Account Statistics */}
      <div className="bg-accent/5 rounded-lg p-4 border border-accent/20">
        <h5 className="text-sm font-medium text-card-foreground mb-3">Account Statistics</h5>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-lg font-heading font-semibold text-accent">247</div>
            <div className="text-xs text-muted-foreground">Games Played</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-heading font-semibold text-accent">1,456</div>
            <div className="text-xs text-muted-foreground">Puzzles Solved</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-heading font-semibold text-accent">89</div>
            <div className="text-xs text-muted-foreground">Days Active</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-heading font-semibold text-accent">1,247</div>
            <div className="text-xs text-muted-foreground">Rating Points</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountManagementSection;