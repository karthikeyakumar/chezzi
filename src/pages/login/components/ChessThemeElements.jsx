import React from 'react';

const ChessThemeElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Subtle chess board pattern background */}
      <div className="absolute top-0 left-0 w-32 h-32 opacity-5">
        <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
          {Array.from({ length: 64 }).map((_, index) => (
            <div
              key={index}
              className={`${
                (Math.floor(index / 8) + index) % 2 === 0
                  ? 'bg-primary' :'bg-transparent'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Chess piece silhouettes */}
      <div className="absolute bottom-0 right-0 w-24 h-24 opacity-5">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-full h-full text-primary"
        >
          {/* King piece silhouette */}
          <path d="M12 2l1 2h2l-1 2h1v2h-1l1 8H9l1-8H9V6h1L9 4h2l1-2z" />
        </svg>
      </div>

      <div className="absolute top-1/4 right-8 w-16 h-16 opacity-5">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-full h-full text-primary"
        >
          {/* Knight piece silhouette */}
          <path d="M6 20h12l-1-2H7l-1 2zM8 18h8l-1-2H9l-1 2zM10 16h4l-1-2h-2l-1 2zM11 14h2v-2h-2v2zM10 12h4V8h-1l-1-2h-1l-1 2h-1v4z" />
        </svg>
      </div>

      {/* Decorative dots pattern */}
      <div className="absolute top-1/3 left-8 grid grid-cols-3 gap-2 opacity-10">
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            key={index}
            className="w-1 h-1 bg-primary rounded-full"
          />
        ))}
      </div>
    </div>
  );
};

export default ChessThemeElements;