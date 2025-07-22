import React, { useState, useEffect, useCallback } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import Icon from '../../../components/AppIcon';

const ChessBoard = ({ 
  position, 
  onMove, 
  highlightedSquares = [], 
  lastMove = null,
  isPlayerTurn = true,
  showCoordinates = true,
  animateMovements = true 
}) => {
  const [game, setGame] = useState(() => new Chess());
  const [gamePosition, setGamePosition] = useState(game.fen());
  const [moveFrom, setMoveFrom] = useState('');
  const [moveTo, setMoveTo] = useState(null);
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [optionSquares, setOptionSquares] = useState({});
  const [rightClickedSquares, setRightClickedSquares] = useState({});

  // Initialize position if provided
  useEffect(() => {
    if (position) {
      try {
        const newGame = new Chess(position);
        setGame(newGame);
        setGamePosition(newGame.fen());
      } catch (error) {
        console.error('Invalid position provided:', error);
      }
    }
  }, [position]);

  // Get move options for a square
  const getMoveOptions = useCallback((square) => {
    const moves = game.moves({
      square,
      verbose: true,
    });
    if (moves.length === 0) {
      setOptionSquares({});
      return false;
    }

    const newSquares = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background: game.get(move.to) && game.get(move.to).color !== game.get(square).color
          ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)'
          : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
        borderRadius: '50%'
      };
      return move;
    });
    newSquares[square] = {
      background: 'rgba(255, 255, 0, 0.4)'
    };
    setOptionSquares(newSquares);
    return true;
  }, [game]);

  // Handle square click
  const onSquareClick = useCallback((square) => {
    if (!isPlayerTurn) return;

    // Reset right-clicked squares
    setRightClickedSquares({});

    function resetFirstMove(square) {
      const hasOptions = getMoveOptions(square);
      if (hasOptions) setMoveFrom(square);
    }

    // If no piece is selected
    if (!moveFrom) {
      resetFirstMove(square);
      return;
    }

    // Check if clicking on the same square (deselect)
    if (square === moveFrom) {
      setMoveFrom('');
      setOptionSquares({});
      return;
    }

    // Attempt to make the move
    const gameCopy = new Chess(game.fen());
    const move = gameCopy.moves({ square: moveFrom, to: square, verbose: true })[0];
    
    if (move) {
      // Check for pawn promotion
      if ((move.piece === 'p' && move.to[1] === '8') || (move.piece === 'p' && move.to[1] === '1')) {
        setMoveTo(square);
        setShowPromotionDialog(true);
        return;
      }

      // Make the move
      const moveResult = makeMove(moveFrom, square);
      
      // If move was successful, reset selection
      if (moveResult) {
        setMoveFrom('');
        setOptionSquares({});
      } else {
        // If move failed, try selecting the new square
        resetFirstMove(square);
      }
    } else {
      // Invalid move, try selecting the new square
      resetFirstMove(square);
    }
  }, [game, getMoveOptions, isPlayerTurn, moveFrom]);

  // Make a move
  const makeMove = useCallback((sourceSquare, targetSquare, promotion = 'q') => {
    const gameCopy = new Chess(game.fen());
    let move = null;

    try {
      move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: promotion,
      });
    } catch (error) {
      return null;
    }

    // If move is illegal, return null
    if (move === null) return null;

    setGame(gameCopy);
    setGamePosition(gameCopy.fen());

    // Call the onMove callback with move details
    if (onMove) {
      onMove({
        from: sourceSquare,
        to: targetSquare,
        piece: move.piece,
        captured: move.captured,
        promotion: move.promotion,
        san: move.san,
        fen: gameCopy.fen(),
        isCheck: gameCopy.inCheck(),
        isCheckmate: gameCopy.isCheckmate(),
        isDraw: gameCopy.isDraw(),
        isStalemate: gameCopy.isStalemate(),
        isGameOver: gameCopy.isGameOver()
      });
    }

    return move;
  }, [game, onMove]);

  // Handle piece drop (for drag and drop)
  const onDrop = useCallback((sourceSquare, targetSquare, piece) => {
    if (!isPlayerTurn) return false;

    // Check for pawn promotion
    if ((piece === 'wP' && targetSquare[1] === '8') || (piece === 'bP' && targetSquare[1] === '1')) {
      setMoveFrom(sourceSquare);
      setMoveTo(targetSquare);
      setShowPromotionDialog(true);
      return false;
    }

    const move = makeMove(sourceSquare, targetSquare);
    if (move === null) return false;

    setMoveFrom('');
    setOptionSquares({});
    return true;
  }, [isPlayerTurn, makeMove]);

  // Handle promotion selection
  const handlePromotion = useCallback((piece) => {
    const move = makeMove(moveFrom, moveTo, piece);
    if (move) {
      setShowPromotionDialog(false);
      setMoveFrom('');
      setMoveTo(null);
      setOptionSquares({});
    }
  }, [makeMove, moveFrom, moveTo]);

  // Handle right click on square
  const onSquareRightClick = useCallback((square) => {
    const colour = 'rgba(0, 0, 255, 0.4)';
    setRightClickedSquares({
      ...rightClickedSquares,
      [square]:
        rightClickedSquares[square] && rightClickedSquares[square].backgroundColor === colour
          ? undefined
          : { backgroundColor: colour }
    });
  }, [rightClickedSquares]);

  // Custom square styles
  const customSquareStyles = useCallback(() => {
    const styles = {
      ...optionSquares,
      ...rightClickedSquares
    };

    // Add last move highlighting
    if (lastMove) {
      styles[lastMove.from] = { backgroundColor: 'rgba(255, 255, 0, 0.4)' };
      styles[lastMove.to] = { backgroundColor: 'rgba(255, 255, 0, 0.4)' };
    }

    // Add highlighted squares
    highlightedSquares.forEach(square => {
      styles[square] = { backgroundColor: 'rgba(0, 255, 0, 0.4)' };
    });

    return styles;
  }, [optionSquares, rightClickedSquares, lastMove, highlightedSquares]);

  // Reset game
  const resetGame = useCallback(() => {
    const newGame = new Chess();
    setGame(newGame);
    setGamePosition(newGame.fen());
    setMoveFrom('');
    setMoveTo(null);
    setOptionSquares({});
    setRightClickedSquares({});
    setShowPromotionDialog(false);
  }, []);

  // Clear selection
  const clearSelection = useCallback(() => {
    setMoveFrom('');
    setOptionSquares({});
    setRightClickedSquares({});
  }, []);

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Board Container */}
      <div className="relative bg-card border-2 border-border rounded-lg shadow-moderate p-4">
        <div className="w-full max-w-3xl mx-auto" style={{ minWidth: 350, maxWidth: 700 }}>
          <Chessboard
            position={gamePosition}
            onSquareClick={onSquareClick}
            onSquareRightClick={onSquareRightClick}
            onPieceDrop={onDrop}
            customBoardStyle={{
              borderRadius: '4px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
            }}
            customSquareStyles={customSquareStyles()}
            promotionToSquare={moveTo}
            boardOrientation="white"
            arePiecesDraggable={isPlayerTurn}
            animationDuration={animateMovements ? 200 : 0}
            showBoardNotation={showCoordinates}
            customDarkSquareStyle={{ backgroundColor: '#b58863' }}
            customLightSquareStyle={{ backgroundColor: '#f0d9b5' }}
            customDropSquareStyle={{
              boxShadow: 'inset 0 0 1px 6px rgba(255,255,255,0.75)'
            }}
          />
        </div>

        {/* Game Status */}
        <div className="flex items-center justify-center mt-3">
          <div className={`
            flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium
            ${isPlayerTurn ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'}
          `}>
            <div className={`w-2 h-2 rounded-full ${isPlayerTurn ? 'bg-success' : 'bg-muted-foreground'}`}></div>
            <span>
              {game.isCheckmate() ? 'Checkmate!' : game.isDraw() ?'Draw!': game.inCheck() ?'Check!': isPlayerTurn ?'Your Turn' : 'AI Thinking...'}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center space-x-2">
        <button
          onClick={clearSelection}
          className="flex items-center space-x-1 px-3 py-1 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          disabled={!moveFrom && Object.keys(rightClickedSquares).length === 0}
        >
          <Icon name="X" size={14} />
          <span>Clear</span>
        </button>
        
        <button
          onClick={resetGame}
          className="flex items-center space-x-1 px-3 py-1 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <Icon name="RotateCcw" size={14} />
          <span>Reset</span>
        </button>
      </div>

      {/* Promotion Dialog */}
      {showPromotionDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 shadow-moderate">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Choose Promotion Piece</h3>
            <div className="flex space-x-2">
              {['q', 'r', 'b', 'n'].map((piece) => (
                <button
                  key={piece}
                  onClick={() => handlePromotion(piece)}
                  className="p-3 bg-muted hover:bg-muted/80 rounded-lg text-2xl font-bold transition-colors"
                >
                  {piece === 'q' ? '♛' : piece === 'r' ? '♜' : piece === 'b' ? '♝' : '♞'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChessBoard;