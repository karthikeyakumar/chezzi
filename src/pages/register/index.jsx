import React, { useState } from 'react';
import RegistrationHeader from './components/RegistrationHeader';
import SocialRegistration from './components/SocialRegistration';
import RegistrationForm from './components/RegistrationForm';
import LoginRedirect from './components/LoginRedirect';

const RegisterPage = () => {
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleRegistrationSuccess = (userData) => {
    console.log('Registration successful:', userData);
    setRegistrationSuccess(true);
    
    // Store user data in localStorage for demo purposes
    localStorage.setItem('chesstutor_user', JSON.stringify(userData));
  };

  const handleSocialSuccess = (userData) => {
    console.log('Social registration successful:', userData);
    setRegistrationSuccess(true);
    
    // Store user data in localStorage for demo purposes
    localStorage.setItem('chesstutor_user', JSON.stringify(userData));
  };

  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-xl shadow-moderate p-8 border border-border text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-success/10 rounded-full mx-auto mb-4">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                className="text-success"
              >
                <path
                  d="M9 12l2 2 4-4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
            
            <h2 className="text-xl font-heading font-semibold text-card-foreground mb-2">
              Welcome to ChessTutor!
            </h2>
            <p className="text-muted-foreground mb-6">
              Your account has been created successfully. Get ready to start your chess learning journey with AI coaching.
            </p>
            
            <div className="animate-gentle-pulse">
              <p className="text-sm text-primary font-medium">
                Redirecting to your chess board...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Registration Header */}
          <RegistrationHeader />

          {/* Main Registration Card */}
          <div className="bg-card rounded-xl shadow-moderate border border-border overflow-hidden">
            {/* Social Registration */}
            <div className="p-6 pb-4">
              <SocialRegistration onSocialSuccess={handleSocialSuccess} />
            </div>

            {/* Registration Form */}
            <div className="px-6 pb-6">
              <RegistrationForm onRegistrationSuccess={handleRegistrationSuccess} />
            </div>
          </div>

          {/* Login Redirect */}
          <LoginRedirect />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;