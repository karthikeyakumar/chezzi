import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const SignUpPrompt = () => {
  const navigate = useNavigate();

  const handleCreateAccount = () => {
    navigate('/register');
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <div className="text-center p-6 bg-card/50 rounded-xl border border-border">
        <h3 className="text-lg font-heading font-medium text-foreground mb-2">
          New to Chess?
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Start your chess journey with personalized AI coaching and interactive lessons designed for beginners.
        </p>
        
        <Button
          variant="outline"
          size="lg"
          onClick={handleCreateAccount}
          fullWidth
          className="mb-3"
        >
          Create Account
        </Button>
        
        <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
          <span className="flex items-center">
            <svg className="w-3 h-3 mr-1 text-success" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Free to start
          </span>
          <span className="flex items-center">
            <svg className="w-3 h-3 mr-1 text-success" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            AI-powered coaching
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUpPrompt;