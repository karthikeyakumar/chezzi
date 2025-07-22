import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SocialLogin = ({ onSocialLogin, isLoading }) => {
  const handleSocialAuth = (provider) => {
    if (onSocialLogin) {
      onSocialLogin(provider);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-background text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={() => handleSocialAuth('google')}
          disabled={isLoading}
          className="flex items-center justify-center"
        >
          <Icon name="Chrome" size={18} className="mr-2" />
          Google
        </Button>
        
        <Button
          variant="outline"
          onClick={() => handleSocialAuth('facebook')}
          disabled={isLoading}
          className="flex items-center justify-center"
        >
          <Icon name="Facebook" size={18} className="mr-2" />
          Facebook
        </Button>
      </div>
    </div>
  );
};

export default SocialLogin;