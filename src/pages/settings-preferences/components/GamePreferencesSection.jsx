import React, { useState } from 'react';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const GamePreferencesSection = ({ settings, onSettingChange }) => {
  const [previewBoard, setPreviewBoard] = useState(false);

  const boardThemeOptions = [
    { 
      value: 'classic-wood', 
      label: 'Classic Wood',
      description: 'Traditional wooden chess board with warm brown tones'
    },
    { 
      value: 'marble-elegance', 
      label: 'Marble Elegance',
      description: 'Sophisticated marble texture with subtle veining'
    },
    { 
      value: 'modern-digital', 
      label: 'Modern Digital',
      description: 'Clean digital interface with high contrast'
    },
    { 
      value: 'tournament-standard', 
      label: 'Tournament Standard',
      description: 'Official tournament colors and layout'
    }
  ];

  const pieceStyleOptions = [
    { 
      value: 'classic-staunton', 
      label: 'Classic Staunton',
      description: 'Traditional tournament-style pieces'
    },
    { 
      value: 'modern-minimalist', 
      label: 'Modern Minimalist',
      description: 'Clean, simplified piece designs'
    },
    { 
      value: '3d-realistic', 
      label: '3D Realistic',
      description: 'Detailed three-dimensional pieces'
    },
    { 
      value: 'vintage-ornate', 
      label: 'Vintage Ornate',
      description: 'Decorative classical chess pieces'
    }
  ];

  const animationSpeedOptions = [
    { value: 'slow', label: 'Slow (1.5s)', description: 'Relaxed pace for learning' },
    { value: 'normal', label: 'Normal (1s)', description: 'Standard animation speed' },
    { value: 'fast', label: 'Fast (0.5s)', description: 'Quick movements for experienced players' },
    { value: 'instant', label: 'Instant', description: 'No animation delays' }
  ];

  const handlePreviewToggle = () => {
    setPreviewBoard(!previewBoard);
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-heading font-semibold text-card-foreground">
            Game Preferences
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Customize your chess board appearance and gameplay settings
          </p>
        </div>
        <button
          onClick={handlePreviewToggle}
          className="flex items-center space-x-2 px-3 py-2 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors duration-200"
        >
          <Icon name="Eye" size={16} />
          <span>{previewBoard ? 'Hide' : 'Show'} Preview</span>
        </button>
      </div>

      {/* Preview Board */}
      {previewBoard && (
        <div className="bg-muted/30 rounded-lg p-4 border border-border">
          <div className="flex items-center justify-center">
            <div className="w-64 h-64 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg border-2 border-amber-300 grid grid-cols-8 grid-rows-8 overflow-hidden">
              {Array.from({ length: 64 }, (_, i) => {
                const row = Math.floor(i / 8);
                const col = i % 8;
                const isLight = (row + col) % 2 === 0;
                return (
                  <div
                    key={i}
                    className={`flex items-center justify-center text-xs font-mono ${
                      isLight ? 'bg-amber-100' : 'bg-amber-800'
                    }`}
                  >
                    {i === 0 && '♜'}
                    {i === 1 && '♞'}
                    {i === 2 && '♝'}
                    {i === 3 && '♛'}
                    {i === 4 && '♚'}
                    {i === 7 && '♜'}
                    {i >= 8 && i <= 15 && '♟'}
                    {i >= 48 && i <= 55 && '♙'}
                    {i === 56 && '♖'}
                    {i === 57 && '♘'}
                    {i === 58 && '♗'}
                    {i === 59 && '♕'}
                    {i === 60 && '♔'}
                    {i === 63 && '♖'}
                  </div>
                );
              })}
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-3">
            Preview of {settings.boardTheme} theme with {settings.pieceStyle} pieces
          </p>
        </div>
      )}

      {/* Board Theme Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Select
          label="Board Theme"
          description="Choose your preferred chess board appearance"
          options={boardThemeOptions}
          value={settings.boardTheme}
          onChange={(value) => onSettingChange('boardTheme', value)}
          className="w-full"
        />

        <Select
          label="Piece Style"
          description="Select chess piece design"
          options={pieceStyleOptions}
          value={settings.pieceStyle}
          onChange={(value) => onSettingChange('pieceStyle', value)}
          className="w-full"
        />
      </div>

      {/* Animation Settings */}
      <div>
        <Select
          label="Animation Speed"
          description="Control how fast pieces move on the board"
          options={animationSpeedOptions}
          value={settings.animationSpeed}
          onChange={(value) => onSettingChange('animationSpeed', value)}
          className="w-full lg:w-1/2"
        />
      </div>

      {/* Visual Aids */}
      <div>
        <h4 className="text-md font-heading font-medium text-card-foreground mb-4">
          Visual Aids & Assistance
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Checkbox
            label="Show board coordinates"
            description="Display A-H and 1-8 labels around the board"
            checked={settings.showCoordinates}
            onChange={(e) => onSettingChange('showCoordinates', e.target.checked)}
          />
          
          <Checkbox
            label="Highlight legal moves"
            description="Show available moves when selecting a piece"
            checked={settings.highlightMoves}
            onChange={(e) => onSettingChange('highlightMoves', e.target.checked)}
          />
          
          <Checkbox
            label="Show last move"
            description="Highlight the previous move made"
            checked={settings.showLastMove}
            onChange={(e) => onSettingChange('showLastMove', e.target.checked)}
          />
          
          <Checkbox
            label="Piece shadows"
            description="Add subtle shadows to chess pieces"
            checked={settings.pieceShadows}
            onChange={(e) => onSettingChange('pieceShadows', e.target.checked)}
          />
        </div>
      </div>

      {/* Gameplay Features */}
      <div>
        <h4 className="text-md font-heading font-medium text-card-foreground mb-4">
          Gameplay Features
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Checkbox
            label="Auto-promote to Queen"
            description="Automatically promote pawns to Queen"
            checked={settings.autoPromoteQueen}
            onChange={(e) => onSettingChange('autoPromoteQueen', e.target.checked)}
          />
          
          <Checkbox
            label="Confirm moves"
            description="Require confirmation before making moves"
            checked={settings.confirmMoves}
            onChange={(e) => onSettingChange('confirmMoves', e.target.checked)}
          />
          
          <Checkbox
            label="Show captured pieces"
            description="Display captured pieces beside the board"
            checked={settings.showCapturedPieces}
            onChange={(e) => onSettingChange('showCapturedPieces', e.target.checked)}
          />
          
          <Checkbox
            label="Enable undo move"
            description="Allow taking back the last move"
            checked={settings.enableUndo}
            onChange={(e) => onSettingChange('enableUndo', e.target.checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default GamePreferencesSection;