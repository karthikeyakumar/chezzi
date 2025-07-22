import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const LoginRedirect = () => {
  const navigate = useNavigate();

  const handleSignInClick = () => {
    navigate('/login');
  };

  return (
    <div className="mt-8 text-center">
      <div className="p-4 bg-muted/30 rounded-lg border border-border">
        <p className="text-sm text-muted-foreground mb-3">
          Already have an account?
        </p>
        <Button
          variant="outline"
          onClick={handleSignInClick}
          iconName="LogIn"
          iconPosition="left"
          iconSize={16}
        >
          Sign In Instead
        </Button>
      </div>
      
      <div className="mt-6">
        <p className="text-xs text-muted-foreground">
          Need help? Contact our{' '}
          <a href="#" className="text-primary hover:underline">
            support team
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginRedirect;