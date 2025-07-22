import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MoveHistory = ({ moves = [], currentMoveIndex = -1, onMoveClick, isCollapsed = false, onToggleCollapse }) => {
  const [selectedMoveIndex, setSelectedMoveIndex] = useState(-1);

  // Mock move history data
  const mockMoves = moves.length > 0 ? moves : [
    { moveNumber: 1, white: 'e4', black: 'e5', whiteTime: '14:58', blackTime: '14:55' },
    { moveNumber: 2, white: 'Nf3', black: 'Nc6', whiteTime: '14:45', blackTime: '14:42' },
    { moveNumber: 3, white: 'Bc4', black: 'Bc5', whiteTime: '14:30', blackTime: '14:28' },
    { moveNumber: 4, white: 'O-O', black: 'Nf6', whiteTime: '14:15', blackTime: '14:10' },
    { moveNumber: 5, white: 'd3', black: 'd6', whiteTime: '14:00', blackTime: '13:58' },
    { moveNumber: 6, white: 'Bg5', black: 'h6', whiteTime: '13:45', blackTime: '13:40' },
    { moveNumber: 7, white: 'Bh4', black: 'g5', whiteTime: '13:30', blackTime: '13:25' },
    { moveNumber: 8, white: 'Bg3', black: 'Bg4', whiteTime: '13:15', blackTime: '13:10' }
  ];

  const handleMoveClick = (moveIndex, isWhite) => {
    const actualIndex = isWhite ? moveIndex * 2 : moveIndex * 2 + 1;
    setSelectedMoveIndex(actualIndex);
    
    if (onMoveClick) {
      onMoveClick(actualIndex, mockMoves[moveIndex], isWhite);
    }
  };

  const getMoveEvaluation = (moveNumber) => {
    // Mock evaluation scores
    const evaluations = ['+0.3', '+0.1', '+0.4', '+0.2', '+0.5', '+0.3', '+0.7', '+0.4'];
    return evaluations[moveNumber - 1] || '+0.0';
  };

  const getMoveAnnotation = (move) => {
    // Mock annotations
    const annotations = ['!', '?', '!!', '?!', '', '!?', '!', ''];
    return annotations[Math.floor(Math.random() * annotations.length)];
  };

  if (isCollapsed) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-subtle">
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-t-lg">
          <div className="flex items-center space-x-2">
            <Icon name="History" size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-card-foreground">Move History</span>
            <span className="text-xs text-muted-foreground">({mockMoves.length} moves)</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="text-muted-foreground hover:text-card-foreground"
          >
            <Icon name="ChevronDown" size={16} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-t-lg border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="History" size={16} className="text-muted-foreground" />
          <span className="text-sm font-medium text-card-foreground">Move History</span>
          <span className="text-xs text-muted-foreground">({mockMoves.length} moves)</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              // Export PGN functionality
              console.log('Export PGN');
            }}
            className="text-muted-foreground hover:text-card-foreground"
            title="Export PGN"
          >
            <Icon name="Download" size={14} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="text-muted-foreground hover:text-card-foreground"
          >
            <Icon name="ChevronUp" size={16} />
          </Button>
        </div>
      </div>

      {/* Game Info */}
      <div className="p-3 border-b border-border bg-background/50">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-3 h-3 bg-background border border-border rounded-sm"></div>
              <span className="font-medium text-card-foreground">You</span>
            </div>
            <div className="text-muted-foreground">Rating: 1450</div>
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-3 h-3 bg-foreground rounded-sm"></div>
              <span className="font-medium text-card-foreground">AI Coach</span>
            </div>
            <div className="text-muted-foreground">Level: Intermediate</div>
          </div>
        </div>
        
        <div className="mt-2 text-xs text-muted-foreground">
          <span>Opening: Italian Game</span>
          <span className="mx-2">•</span>
          <span>Time: 15+10</span>
        </div>
      </div>

      {/* Moves List */}
      <div className="max-h-64 overflow-y-auto">
        <div className="p-2 space-y-1">
          {mockMoves.map((move, index) => (
            <div key={index} className="grid grid-cols-12 gap-1 items-center text-sm hover:bg-muted/30 rounded px-2 py-1">
              {/* Move Number */}
              <div className="col-span-1 text-xs font-mono text-muted-foreground text-center">
                {move.moveNumber}.
              </div>

              {/* White Move */}
              <div className="col-span-4">
                <button
                  onClick={() => handleMoveClick(index, true)}
                  className={`
                    w-full text-left px-2 py-1 rounded font-mono text-sm transition-colors
                    ${selectedMoveIndex === index * 2
                      ? 'bg-primary text-primary-foreground'
                      : 'text-card-foreground hover:bg-accent/20'
                    }
                  `}
                >
                  {move.white}
                  <span className="text-xs ml-1 opacity-70">
                    {getMoveAnnotation(move.white)}
                  </span>
                </button>
              </div>

              {/* Black Move */}
              <div className="col-span-4">
                {move.black && (
                  <button
                    onClick={() => handleMoveClick(index, false)}
                    className={`
                      w-full text-left px-2 py-1 rounded font-mono text-sm transition-colors
                      ${selectedMoveIndex === index * 2 + 1
                        ? 'bg-primary text-primary-foreground'
                        : 'text-card-foreground hover:bg-accent/20'
                      }
                    `}
                  >
                    {move.black}
                    <span className="text-xs ml-1 opacity-70">
                      {getMoveAnnotation(move.black)}
                    </span>
                  </button>
                )}
              </div>

              {/* Evaluation */}
              <div className="col-span-2 text-right">
                <span className={`
                  text-xs font-mono px-1 py-0.5 rounded
                  ${getMoveEvaluation(move.moveNumber).startsWith('+')
                    ? 'text-success bg-success/10' : getMoveEvaluation(move.moveNumber).startsWith('-')
                    ? 'text-error bg-error/10' :'text-muted-foreground bg-muted/20'
                  }
                `}>
                  {getMoveEvaluation(move.moveNumber)}
                </span>
              </div>

              {/* Time (on hover or expanded view) */}
              <div className="col-span-1 text-xs text-muted-foreground text-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Icon name="Clock" size={10} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between p-3 border-t border-border bg-muted/20">
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleMoveClick(0, true)}
            className="text-muted-foreground hover:text-card-foreground"
            title="Go to start"
          >
            <Icon name="SkipBack" size={14} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const prevIndex = Math.max(0, selectedMoveIndex - 1);
              setSelectedMoveIndex(prevIndex);
            }}
            className="text-muted-foreground hover:text-card-foreground"
            title="Previous move"
          >
            <Icon name="ChevronLeft" size={14} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const nextIndex = Math.min(mockMoves.length * 2 - 1, selectedMoveIndex + 1);
              setSelectedMoveIndex(nextIndex);
            }}
            className="text-muted-foreground hover:text-card-foreground"
            title="Next move"
          >
            <Icon name="ChevronRight" size={14} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedMoveIndex(mockMoves.length * 2 - 1)}
            className="text-muted-foreground hover:text-card-foreground"
            title="Go to end"
          >
            <Icon name="SkipForward" size={14} />
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          Move {selectedMoveIndex + 1} of {mockMoves.length * 2}
        </div>
      </div>
    </div>
  );
};

export default MoveHistory;