import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import SocialLogin from './components/SocialLogin';
import SignUpPrompt from './components/SignUpPrompt';
import ChessThemeElements from './components/ChessThemeElements';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (userData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store user data in localStorage for session persistence
      localStorage.setItem('chesstutor_user', JSON.stringify(userData));
      
      // Navigate to main game interface
      navigate('/main-game-interface');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setIsLoading(true);
    
    try {
      // Simulate social authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        id: '1',
        name: 'Chess Player',
        email: `player@${provider}.com`,
        preferences: {
          difficulty: 'beginner',
          coachStyle: 'patient'
        }
      };

      await handleLogin(userData);
    } catch (error) {
      console.error(`${provider} login failed:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Chess-themed background elements */}
      <ChessThemeElements />
      
      {/* Main content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <LoginHeader />
        
        {/* Main login content */}
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md">
            {/* Welcome message */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-heading font-semibold text-foreground mb-3">
                Welcome Back
              </h2>
              <p className="text-muted-foreground">
                Continue your chess learning journey with AI-powered coaching
              </p>
            </div>

            {/* Login card */}
            <div className="bg-card rounded-xl shadow-moderate p-6 border border-border backdrop-blur-sm">
              <LoginForm 
                onLogin={handleLogin}
                isLoading={isLoading}
              />
              
              <SocialLogin 
                onSocialLogin={handleSocialLogin}
                isLoading={isLoading}
              />
            </div>

            {/* Sign up prompt */}
            <SignUpPrompt />
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 px-4 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ChessTutor. All rights reserved.
          </p>
          <div className="flex items-center justify-center space-x-4 mt-2">
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors duration-fast">
              Privacy Policy
            </a>
            <span className="text-xs text-muted-foreground">•</span>
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors duration-fast">
              Terms of Service
            </a>
            <span className="text-xs text-muted-foreground">•</span>
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors duration-fast">
              Support
            </a>
          </div>
        </footer>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card rounded-lg p-6 shadow-prominent border border-border">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
              <span className="text-foreground font-medium">Signing you in...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;