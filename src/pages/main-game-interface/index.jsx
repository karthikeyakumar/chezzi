import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chess } from 'chess.js';
import AppHeader from '../../components/ui/AppHeader';
import ChessBoard from './components/ChessBoard';
import AICoachChat from './components/AICoachChat';
import MoveHistory from './components/MoveHistory';
import GameControls from './components/GameControls';
import CoachingTip from './components/CoachingTip';
import VoiceControls from './components/VoiceControls';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { generateCoachResponse } from '../../services/geminiService'; // Add this import

const MainGameInterface = () => {
  const navigate = useNavigate();
  
  // Game state
  const [chess] = useState(() => new Chess());
  const [gamePosition, setGamePosition] = useState(chess.fen());
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameStatus, setGameStatus] = useState('playing');
  const [moveHistory, setMoveHistory] = useState([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  
  // UI state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activePanel, setActivePanel] = useState('chat'); // 'chat', 'history', 'controls'
  const [isHistoryCollapsed, setIsHistoryCollapsed] = useState(true);
  const [showCoachingTip, setShowCoachingTip] = useState(false);
  const [isAnalysisMode, setIsAnalysisMode] = useState(false);
  
  // Voice and coaching state
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [coachPersonality, setCoachPersonality] = useState('encouraging');
  const [coachMessages, setCoachMessages] = useState([]); // Add this state
  
  // Mock user data
  const [user] = useState({
    id: '1',
    name: 'Chess Player',
    email: 'player@chesstutor.com',
    preferences: {
      difficulty: 'intermediate',
      coachStyle: 'encouraging'
    }
  });

  // Initialize coaching tip on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCoachingTip(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Handle chess move
  const handleMove = async (moveData) => {
    chess.move({ from: moveData.from, to: moveData.to, promotion: moveData.promotion || 'q' });
    setGamePosition(chess.fen());
    const newMove = {
      moveNumber: Math.floor(moveHistory.length / 2) + 1,
      white: moveData.from + '-' + moveData.to,
      black: null,
      whiteTime: '14:30',
      blackTime: '14:25'
    };
    
    setMoveHistory(prev => [...prev, newMove]);
    setIsPlayerTurn(false);

    // --- COACH FEEDBACK LOGIC ---
    const fen = chess.fen();
    const prompt = `I just played ${moveData.san || (moveData.from + '-' + moveData.to)}. Give me feedback on this move and advice for the next one.`;
    const coachPersonalityType = coachPersonality || 'encouraging';

    // Generate coach response
    const response = await generateCoachResponse(prompt, coachPersonalityType, coachMessages);

    // Add to coach chat
    setCoachMessages(prev => [
      ...prev,
      { sender: 'coach', content: response, timestamp: new Date() }
    ]);

    // Optionally play voice
    if (isVoiceEnabled) {
      handleVoicePlay(response);
    }

    // --- AI MOVE LOGIC ---
    setTimeout(() => {
      const aiMove = chess.moves({ verbose: true })[0];
      if (aiMove) {
        chess.move(aiMove);
        setGamePosition(chess.fen());
        setMoveHistory(prev => {
          const updated = [...prev];
          if (updated[updated.length - 1]) {
            updated[updated.length - 1].black = aiMove.from + '-' + aiMove.to;
          }
          return updated;
        });
      }
      setIsPlayerTurn(true);
    }, 2000);
  };

  // Handle coaching actions
  const handleHint = () => {
    setShowCoachingTip(true);
  };

  const handleUndo = () => {
    if (moveHistory.length > 0) {
      setMoveHistory(prev => prev.slice(0, -1));
    }
  };

  const handleAnalysis = () => {
    setIsAnalysisMode(!isAnalysisMode);
  };

  const handleNewGame = () => {
    setGamePosition(null);
    setMoveHistory([]);
    setCurrentMoveIndex(-1);
    setIsPlayerTurn(true);
    setGameStatus('playing');
    setIsAnalysisMode(false);
  };

  const handleResign = () => {
    setGameStatus('finished');
    setIsPlayerTurn(false);
  };

  // Handle voice controls
  const handleVoiceToggle = () => {
    setIsVoiceEnabled(!isVoiceEnabled);
  };

  const handleVoicePlay = (text, options) => {
    setIsVoicePlaying(true);
    console.log('Playing voice:', text, options);
    // Mock voice playback
    setTimeout(() => {
      setIsVoicePlaying(false);
    }, 5000);
  };

  const handleVoicePause = () => {
    setIsVoicePlaying(false);
  };

  const handleVoiceStop = () => {
    setIsVoicePlaying(false);
  };

  // Handle chat message
  const handleSendMessage = (message) => {
    console.log('Sending message to AI coach:', message);
  };

  // Handle move history click
  const handleMoveClick = (moveIndex, move, isWhite) => {
    setCurrentMoveIndex(moveIndex);
    console.log('Navigate to move:', moveIndex, move, isWhite);
  };

  // Handle settings
  const handleOpenSettings = () => {
    navigate('/settings-preferences');
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <AppHeader 
        user={user}
        onLogout={handleLogout}
        onOpenSettings={handleOpenSettings}
      />

      {/* Main Content */}
      <div className="pt-16">
        {/* Mobile Menu Toggle */}
        <div className="lg:hidden fixed bottom-4 right-4 z-30">
          <Button
            variant="default"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-12 h-12 rounded-full shadow-prominent"
          >
            <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
          </Button>
        </div>

        {/* Mobile Panel Selector */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed bottom-20 right-4 z-30 bg-card border border-border rounded-lg shadow-moderate p-2">
            <div className="flex flex-col space-y-1">
              <Button
                variant={activePanel === 'chat' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => {
                  setActivePanel('chat');
                  setIsMobileMenuOpen(false);
                }}
                className="justify-start"
              >
                <Icon name="MessageCircle" size={16} className="mr-2" />
                Coach Chat
              </Button>
              <Button
                variant={activePanel === 'history' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => {
                  setActivePanel('history');
                  setIsMobileMenuOpen(false);
                }}
                className="justify-start"
              >
                <Icon name="History" size={16} className="mr-2" />
                Move History
              </Button>
              <Button
                variant={activePanel === 'controls' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => {
                  setActivePanel('controls');
                  setIsMobileMenuOpen(false);
                }}
                className="justify-start"
              >
                <Icon name="Settings" size={16} className="mr-2" />
                Game Controls
              </Button>
            </div>
          </div>
        )}

        {/* Game Layout */}
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Chess Board - Central Focus */}
            <div className="lg:col-span-7">
              <div className="space-y-4">
                {/* Game Status Bar */}
                <div className="bg-card border border-border rounded-lg p-4 shadow-subtle">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`
                        w-3 h-3 rounded-full
                        ${gameStatus === 'playing' ? 'bg-success animate-pulse' : 'bg-muted-foreground'}
                      `}></div>
                      <div>
                        <h2 className="font-heading font-semibold text-card-foreground">
                          {gameStatus === 'playing' ? 'Game in Progress' : 'Game Finished'}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {isPlayerTurn ? 'Your turn to move' : 'AI is thinking...'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <div className="text-sm font-medium text-card-foreground">15:42</div>
                        <div className="text-xs text-muted-foreground">Time remaining</div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate('/ai-coach-selection')}
                        className="text-muted-foreground hover:text-card-foreground"
                        title="Change AI coach"
                      >
                        <Icon name="Bot" size={16} />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Chess Board */}
                <ChessBoard
                  position={gamePosition}
                  onMove={handleMove}
                  isPlayerTurn={isPlayerTurn}
                  showCoordinates={true}
                  animateMovements={true}
                />

                {/* Voice Controls (Desktop) */}
                <div className="hidden lg:block">
                  <VoiceControls
                    isEnabled={isVoiceEnabled}
                    onToggle={handleVoiceToggle}
                    isPlaying={isVoicePlaying}
                    onPlay={handleVoicePlay}
                    onPause={handleVoicePause}
                    onStop={handleVoiceStop}
                  />
                </div>
              </div>
            </div>

            {/* Right Panel - Desktop */}
            <div className="hidden lg:block lg:col-span-5">
              <div className="space-y-4">
                {/* Move History */}
                <MoveHistory
                  moves={moveHistory}
                  currentMoveIndex={currentMoveIndex}
                  onMoveClick={handleMoveClick}
                  isCollapsed={isHistoryCollapsed}
                  onToggleCollapse={() => setIsHistoryCollapsed(!isHistoryCollapsed)}
                />

                {/* AI Coach Chat */}
                <div className="h-96">
                  <AICoachChat
                    coachPersonality={coachPersonality}
                    onSendMessage={handleSendMessage}
                    isVoiceEnabled={isVoiceEnabled}
                    onToggleVoice={handleVoiceToggle}
                  />
                </div>

                {/* Game Controls */}
                <GameControls
                  onHint={handleHint}
                  onUndo={handleUndo}
                  onAnalysis={handleAnalysis}
                  onNewGame={handleNewGame}
                  onResign={handleResign}
                  canUndo={moveHistory.length > 0}
                  isAnalysisMode={isAnalysisMode}
                  gameStatus={gameStatus}
                />
              </div>
            </div>

            {/* Mobile Panel */}
            <div className="lg:hidden">
              {activePanel === 'chat' && (
                <div className="h-96">
                  <AICoachChat
                    coachPersonality={coachPersonality}
                    onSendMessage={handleSendMessage}
                    isVoiceEnabled={isVoiceEnabled}
                    onToggleVoice={handleVoiceToggle}
                  />
                </div>
              )}

              {activePanel === 'history' && (
                <MoveHistory
                  moves={moveHistory}
                  currentMoveIndex={currentMoveIndex}
                  onMoveClick={handleMoveClick}
                  isCollapsed={false}
                  onToggleCollapse={() => setIsHistoryCollapsed(!isHistoryCollapsed)}
                />
              )}

              {activePanel === 'controls' && (
                <div className="space-y-4">
                  <GameControls
                    onHint={handleHint}
                    onUndo={handleUndo}
                    onAnalysis={handleAnalysis}
                    onNewGame={handleNewGame}
                    onResign={handleResign}
                    canUndo={moveHistory.length > 0}
                    isAnalysisMode={isAnalysisMode}
                    gameStatus={gameStatus}
                  />
                  
                  <VoiceControls
                    isEnabled={isVoiceEnabled}
                    onToggle={handleVoiceToggle}
                    isPlaying={isVoicePlaying}
                    onPlay={handleVoicePlay}
                    onPause={handleVoicePause}
                    onStop={handleVoiceStop}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Coaching Tip Overlay */}
      <CoachingTip
        isVisible={showCoachingTip}
        onDismiss={() => setShowCoachingTip(false)}
        onNext={() => setShowCoachingTip(false)}
        position="center"
        type="tip"
      />

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 z-20"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default MainGameInterface;