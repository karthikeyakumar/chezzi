import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginHeader = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/login');
  };

  return (
    <header className="w-full py-6 px-4">
      <div className="flex items-center justify-center">
        <div 
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={handleLogoClick}
        >
          <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-xl group-hover:bg-primary/90 transition-colors duration-300">
            <svg
              width="28"
              height="28"
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
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-heading font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
              ChessTutor
            </h1>
            <p className="text-sm font-caption text-muted-foreground">
              AI Chess Coaching
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default LoginHeader;