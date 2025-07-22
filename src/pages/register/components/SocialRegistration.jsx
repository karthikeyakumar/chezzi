import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';


const SocialRegistration = ({ onSocialSuccess }) => {
  const navigate = useNavigate();
  const [loadingProvider, setLoadingProvider] = useState(null);

  const socialProviders = [
    {
      id: 'google',
      name: 'Google',
      icon: 'Chrome',
      color: 'hover:bg-red-50 hover:border-red-200',
      textColor: 'text-red-600'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: 'Facebook',
      color: 'hover:bg-blue-50 hover:border-blue-200',
      textColor: 'text-blue-600'
    }
  ];

  const handleSocialAuth = async (provider) => {
    setLoadingProvider(provider.id);

    try {
      // Simulate social authentication
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock successful social registration
      const userData = {
        id: Date.now().toString(),
        displayName: `Chess Player`,
        email: `player@${provider.id}.com`,
        skillLevel: 'beginner',
        preferences: {
          difficulty: 'beginner',
          coachStyle: 'encouraging',
          emailNotifications: true
        },
        socialProvider: provider.id,
        createdAt: new Date().toISOString()
      };

      if (onSocialSuccess) {
        onSocialSuccess(userData);
      }

      navigate('/ai-coach-selection');
    } catch (error) {
      console.error(`${provider.name} authentication failed:`, error);
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-background text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {socialProviders.map((provider) => (
          <Button
            key={provider.id}
            variant="outline"
            onClick={() => handleSocialAuth(provider)}
            loading={loadingProvider === provider.id}
            disabled={loadingProvider !== null}
            iconName={provider.icon}
            iconPosition="left"
            iconSize={18}
            className={`${provider.color} transition-colors duration-200`}
          >
            <span className={provider.textColor}>
              {provider.name}
            </span>
          </Button>
        ))}
      </div>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          By signing up, you agree to our{' '}
          <a href="#" className="text-primary hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-primary hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default SocialRegistration;