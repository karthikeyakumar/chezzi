import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const RegistrationHeader = () => {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const handleLogoClick = () => {
    navigate('/login');
  };

  return (
    <div className="text-center mb-8">
      {/* Back Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBackToLogin}
          className="text-muted-foreground hover:text-foreground"
        >
          <Icon name="ArrowLeft" size={20} />
        </Button>
        
        <div className="flex-1" />
      </div>

      {/* Logo and Brand */}
      <div 
        className="flex items-center justify-center mb-6 cursor-pointer group"
        onClick={handleLogoClick}
      >
        <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-xl group-hover:bg-primary/90 transition-colors duration-200">
          <svg
            width="32"
            height="32"
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
      </div>

      {/* Welcome Content */}
      <div className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-heading font-semibold text-foreground">
          Join ChessTutor
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
          Start your personalized chess learning journey with AI-powered coaching tailored to your skill level
        </p>
      </div>

      {/* Chess-themed Visual Elements */}
      <div className="flex items-center justify-center space-x-4 mt-6 opacity-60">
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
          <span className="text-lg">♔</span>
        </div>
        <div className="w-2 h-2 bg-primary/30 rounded-full"></div>
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
          <span className="text-lg">♕</span>
        </div>
        <div className="w-2 h-2 bg-primary/30 rounded-full"></div>
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
          <span className="text-lg">♖</span>
        </div>
      </div>
    </div>
  );
};

export default RegistrationHeader;