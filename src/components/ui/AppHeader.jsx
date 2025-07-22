import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const AppHeader = ({ user, onLogout, onOpenSettings }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isAuthenticated = !!user;
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  const handleSettingsClick = () => {
    if (onOpenSettings) {
      onOpenSettings();
    }
    setShowUserMenu(false);
  };

  const handleProfileClick = () => {
    // Navigate to profile or show profile modal
    setShowUserMenu(false);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    setShowUserMenu(false);
    navigate('/login');
  };

  const handleLogoClick = () => {
    if (isAuthenticated) {
      navigate('/main-game-interface');
    } else {
      navigate('/login');
    }
  };

  if (isAuthPage) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border shadow-subtle">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo and Brand */}
        <div 
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={handleLogoClick}
        >
          <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg group-hover:bg-primary/90 transition-colors duration-fast">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="text-primary-foreground"
            >
              <path
                d="M12 2L4 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-8-5z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="currentColor"
                fillOpacity="0.1"
              />
              <path
                d="M9 12l2 2 4-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-heading font-semibold text-foreground group-hover:text-primary transition-colors duration-fast">
              ChessTutor
            </h1>
            <p className="text-xs font-caption text-muted-foreground">
              AI Chess Coaching
            </p>
          </div>
        </div>

        {/* Navigation Actions */}
        {isAuthenticated ? (
          <div className="flex items-center space-x-2">
            {/* Settings Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSettingsClick}
              className="text-muted-foreground hover:text-foreground"
              title="Settings & Preferences"
            >
              <Icon name="Settings" size={20} />
            </Button>

            {/* User Menu */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="text-muted-foreground hover:text-foreground"
                title="User Menu"
              >
                <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                  <Icon name="User" size={16} />
                </div>
              </Button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-moderate z-50">
                  <div className="p-3 border-b border-border">
                    <p className="font-medium text-sm text-popover-foreground">
                      {user?.name || 'Chess Player'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email || 'player@chesstutor.com'}
                    </p>
                  </div>
                  
                  <div className="p-1">
                    <button
                      onClick={handleProfileClick}
                      className="flex items-center w-full px-3 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors duration-fast"
                    >
                      <Icon name="User" size={16} className="mr-3" />
                      Profile & Progress
                    </button>
                    
                    <button
                      onClick={handleSettingsClick}
                      className="flex items-center w-full px-3 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors duration-fast"
                    >
                      <Icon name="Settings" size={16} className="mr-3" />
                      Settings
                    </button>
                    
                    <div className="border-t border-border my-1"></div>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-3 py-2 text-sm text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-md transition-colors duration-fast"
                    >
                      <Icon name="LogOut" size={16} className="mr-3" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              onClick={() => navigate('/login')}
              className="text-muted-foreground hover:text-foreground"
            >
              Sign In
            </Button>
            <Button
              variant="default"
              onClick={() => navigate('/register')}
            >
              Get Started
            </Button>
          </div>
        )}
      </div>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
};

export default AppHeader;