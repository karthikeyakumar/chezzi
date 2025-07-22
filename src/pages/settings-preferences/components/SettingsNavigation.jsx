import React from 'react';
import Icon from '../../../components/AppIcon';

const SettingsNavigation = ({ activeSection, onSectionChange, isMobile = false }) => {
  const navigationItems = [
    {
      id: 'game-preferences',
      label: 'Game Settings',
      icon: 'Gamepad2',
      description: 'Board theme, pieces, and gameplay'
    },
    {
      id: 'ai-coaching',
      label: 'AI Coaching',
      icon: 'Bot',
      description: 'Coach personality and guidance'
    },
    {
      id: 'audio-preferences',
      label: 'Audio & Voice',
      icon: 'Volume2',
      description: 'Sound effects and narration'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: 'Bell',
      description: 'Email and reminder settings'
    },
    {
      id: 'account-management',
      label: 'Account',
      icon: 'User',
      description: 'Profile and security settings'
    }
  ];

  if (isMobile) {
    return (
      <div className="flex overflow-x-auto pb-2 mb-6 border-b border-border">
        <div className="flex space-x-1 min-w-max">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                activeSection === item.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-card-foreground hover:bg-muted/50'
              }`}
            >
              <Icon name={item.icon} size={16} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-muted/30 rounded-xl border border-border p-4">
      <h3 className="text-sm font-heading font-semibold text-card-foreground mb-4 px-2">
        Settings Categories
      </h3>
      <nav className="space-y-1">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`flex items-start w-full p-3 rounded-lg text-left transition-colors duration-200 ${
              activeSection === item.id
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-card-foreground hover:bg-muted/50'
            }`}
          >
            <Icon 
              name={item.icon} 
              size={18} 
              className={`mr-3 mt-0.5 flex-shrink-0 ${
                activeSection === item.id ? 'text-primary-foreground' : ''
              }`} 
            />
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-medium ${
                activeSection === item.id ? 'text-primary-foreground' : 'text-card-foreground'
              }`}>
                {item.label}
              </div>
              <div className={`text-xs mt-1 ${
                activeSection === item.id ? 'text-primary-foreground/80' : 'text-muted-foreground'
              }`}>
                {item.description}
              </div>
            </div>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default SettingsNavigation;