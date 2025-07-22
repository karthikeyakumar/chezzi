import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GameControls = ({ 
  onHint, 
  onUndo, 
  onAnalysis, 
  onNewGame, 
  onResign,
  canUndo = true,
  isAnalysisMode = false,
  gameStatus = 'playing' // 'playing', 'paused', 'finished'
}) => {
  const [showConfirmResign, setShowConfirmResign] = useState(false);
  const [showGameMenu, setShowGameMenu] = useState(false);

  const handleResign = () => {
    if (showConfirmResign) {
      onResign && onResign();
      setShowConfirmResign(false);
    } else {
      setShowConfirmResign(true);
      // Auto-hide confirmation after 5 seconds
      setTimeout(() => setShowConfirmResign(false), 5000);
    }
  };

  const handleNewGame = () => {
    onNewGame && onNewGame();
    setShowGameMenu(false);
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle p-4">
      {/* Primary Actions */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <Button
          variant="outline"
          onClick={onHint}
          className="flex flex-col items-center space-y-1 h-auto py-3"
          disabled={gameStatus === 'finished'}
        >
          <Icon name="Lightbulb" size={20} />
          <span className="text-xs">Hint</span>
        </Button>

        <Button
          variant="outline"
          onClick={onUndo}
          className="flex flex-col items-center space-y-1 h-auto py-3"
          disabled={!canUndo || gameStatus === 'finished'}
        >
          <Icon name="Undo2" size={20} />
          <span className="text-xs">Undo</span>
        </Button>

        <Button
          variant={isAnalysisMode ? "default" : "outline"}
          onClick={onAnalysis}
          className="flex flex-col items-center space-y-1 h-auto py-3"
        >
          <Icon name="Search" size={20} />
          <span className="text-xs">Analysis</span>
        </Button>
      </div>

      {/* Game Status */}
      <div className="flex items-center justify-between mb-4 p-3 bg-muted/30 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className={`
            w-2 h-2 rounded-full
            ${gameStatus === 'playing' ? 'bg-success animate-pulse' : 
              gameStatus === 'paused' ? 'bg-warning' : 'bg-muted-foreground'}
          `}></div>
          <span className="text-sm font-medium text-card-foreground capitalize">
            {gameStatus === 'playing' ? 'Game Active' : 
             gameStatus === 'paused' ? 'Game Paused' : 'Game Finished'}
          </span>
        </div>

        {gameStatus === 'playing' && (
          <div className="text-xs text-muted-foreground">
            15:42 remaining
          </div>
        )}
      </div>

      {/* Secondary Actions */}
      <div className="space-y-2">
        {/* Game Menu Toggle */}
        <Button
          variant="ghost"
          onClick={() => setShowGameMenu(!showGameMenu)}
          className="w-full justify-between"
        >
          <span>Game Options</span>
          <Icon name={showGameMenu ? "ChevronUp" : "ChevronDown"} size={16} />
        </Button>

        {/* Expandable Game Menu */}
        {showGameMenu && (
          <div className="space-y-2 pl-4 border-l-2 border-border">
            <Button
              variant="ghost"
              onClick={handleNewGame}
              className="w-full justify-start text-sm"
            >
              <Icon name="Plus" size={16} className="mr-2" />
              New Game
            </Button>

            <Button
              variant="ghost"
              onClick={() => {
                // Save game functionality
                console.log('Save game');
                setShowGameMenu(false);
              }}
              className="w-full justify-start text-sm"
            >
              <Icon name="Save" size={16} className="mr-2" />
              Save Game
            </Button>

            <Button
              variant="ghost"
              onClick={() => {
                // Load game functionality
                console.log('Load game');
                setShowGameMenu(false);
              }}
              className="w-full justify-start text-sm"
            >
              <Icon name="FolderOpen" size={16} className="mr-2" />
              Load Game
            </Button>

            <Button
              variant="ghost"
              onClick={() => {
                // Export game functionality
                console.log('Export game');
                setShowGameMenu(false);
              }}
              className="w-full justify-start text-sm"
            >
              <Icon name="Download" size={16} className="mr-2" />
              Export PGN
            </Button>
          </div>
        )}

        {/* Resign Button */}
        {gameStatus === 'playing' && (
          <Button
            variant={showConfirmResign ? "destructive" : "ghost"}
            onClick={handleResign}
            className="w-full"
          >
            {showConfirmResign ? (
              <>
                <Icon name="AlertTriangle" size={16} className="mr-2" />
                Confirm Resign
              </>
            ) : (
              <>
                <Icon name="Flag" size={16} className="mr-2" />
                Resign Game
              </>
            )}
          </Button>
        )}
      </div>

      {/* Quick Stats */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-heading font-semibold text-card-foreground">
              24
            </div>
            <div className="text-xs text-muted-foreground">Moves Played</div>
          </div>
          <div>
            <div className="text-lg font-heading font-semibold text-card-foreground">
              +0.4
            </div>
            <div className="text-xs text-muted-foreground">Position Eval</div>
          </div>
        </div>
      </div>

      {/* Coaching Insights */}
      <div className="mt-4 p-3 bg-accent/10 border border-accent/20 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="Target" size={16} className="text-accent mt-0.5" />
          <div>
            <div className="text-sm font-medium text-accent-foreground">
              Focus Area
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Work on piece coordination and central control
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Actions */}
      {showConfirmResign && (
        <div className="mt-4 p-3 bg-error/10 border border-error/20 rounded-lg">
          <div className="flex items-center space-x-2 text-error text-sm">
            <Icon name="AlertCircle" size={16} />
            <span>Click "Confirm Resign" again to end the game</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameControls;