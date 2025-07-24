import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Chess } from "chess.js";
import AppHeader from "../../components/ui/AppHeader";
import ChessBoard from "./components/ChessBoard";
import AICoachChat from "./components/AICoachChat";
import MoveHistory from "./components/MoveHistory";
import GameControls from "./components/GameControls";
import CoachingTip from "./components/CoachingTip";
import VoiceControls from "./components/VoiceControls";
import Button from "../../components/ui/Button";
import Icon from "../../components/AppIcon";
import { generateCoachResponse } from "../../services/geminiService";
import aiService from "../../services/aiService";
import Select from "../../components/ui/Select";

const MainGameInterface = () => {
  const navigate = useNavigate();

  // Game state
  const [chess] = useState(() => new Chess());
  const [gamePosition, setGamePosition] = useState(chess.fen());
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameStatus, setGameStatus] = useState("playing");
  const [moveHistory, setMoveHistory] = useState([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);

  // UI state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activePanel, setActivePanel] = useState("chat");
  const [isHistoryCollapsed, setIsHistoryCollapsed] = useState(true);
  const [showCoachingTip, setShowCoachingTip] = useState(false);
  const [isAnalysisMode, setIsAnalysisMode] = useState(false);

  // Voice and coaching state
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [coachPersonality, setCoachPersonality] = useState("encouraging");
  const [selectedAIProvider, setSelectedAIProvider] = useState("perplexity");
  const [coachMessages, setCoachMessages] = useState([
    {
      id: 1,
      sender: "coach",
      content: `Hey, I'm Stockfish, your coach and opponent! You're White, so hit me with a bold move like 1. e4! Let’s fight!`,
      timestamp: new Date(Date.now() - 300000),
      type: "text",
    },
  ]);

  // Mock user data
  const [user] = useState({
    id: "1",
    name: "Chess Player",
    email: "player@chesstutor.com",
    preferences: {
      difficulty: "intermediate",
      coachStyle: "encouraging",
    },
  });

  // Stockfish state
  const [stockfish, setStockfish] = useState(null);
  const [isStockfishReady, setIsStockfishReady] = useState(false);
  const [stockfishError, setStockfishError] = useState(null);

  // Initialize Stockfish engine
  useEffect(() => {
    let stockfishInstance;
    let retryCount = 0;
    const maxRetries = 3;

    const initializeStockfish = () => {
      try {
        stockfishInstance = new Worker("/stockfish/stockfish.js");
        setStockfish(stockfishInstance);

        stockfishInstance.onmessage = (event) => {
          const message = event.data;
          console.debug("Stockfish message:", message);

          if (message === "uciok") {
            console.debug("Stockfish UCI initialized");
            stockfishInstance.postMessage("isready");
          } else if (message === "readyok") {
            console.debug("Stockfish is ready");
            setIsStockfishReady(true);
            setStockfishError(null);
            stockfishInstance.postMessage(`position fen ${chess.fen()}`);
          } else if (message.startsWith("bestmove")) {
            const move = message.split(" ")[1];
            console.debug("Stockfish best move:", move);
            if (move && move !== "(none)") {
              try {
                const chessMove = chess.move({
                  from: move.slice(0, 2),
                  to: move.slice(2, 4),
                  promotion: move.length > 4 ? move[4] : "q",
                });
                if (chessMove) {
                  setGamePosition(chess.fen());
                  setMoveHistory((prev) => {
                    const updated = [...prev];
                    if (updated[updated.length - 1]) {
                      updated[updated.length - 1].black = chessMove.san;
                    }
                    return updated;
                  });
                  setIsPlayerTurn(true);
                  setGameStatus(chess.isGameOver() ? "finished" : "playing");
                }
              } catch (error) {
                console.error("Invalid Stockfish move:", move, error);
                setStockfishError("Invalid move from Stockfish");
                setIsPlayerTurn(true);
              }
            } else {
              console.debug("No valid move from Stockfish, game may be over");
              setGameStatus("finished");
              setIsPlayerTurn(true);
            }
          }
        };

        stockfishInstance.onerror = (error) => {
          console.error("Stockfish Worker error:", error);
          setStockfishError("Failed to communicate with Stockfish");
          setIsStockfishReady(false);
          if (retryCount < maxRetries) {
            retryCount++;
            console.debug(`Retrying Stockfish initialization (${retryCount}/${maxRetries})`);
            stockfishInstance.terminate();
            initializeStockfish();
          } else {
            console.error("Max retries reached for Stockfish initialization");
            setStockfish(null);
          }
        };

        stockfishInstance.postMessage("uci");
      } catch (error) {
        console.error("Failed to initialize Stockfish:", error);
        setStockfishError("Failed to load Stockfish");
        setIsStockfishReady(false);
        if (retryCount < maxRetries) {
          retryCount++;
          console.debug(`Retrying Stockfish initialization (${retryCount}/${maxRetries})`);
          initializeStockfish();
        }
      }
    };

    initializeStockfish();

    return () => {
      if (stockfishInstance) {
        stockfishInstance.terminate();
      }
    };
  }, [chess]);

  // Initialize coaching tip
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCoachingTip(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Set AI service strategy
  useEffect(() => {
    aiService.setStrategy(selectedAIProvider);
  }, [selectedAIProvider]);

  // Handle chess move
  const handleMove = async (moveData) => {
    try {
      const chessMove = chess.move({
        from: moveData.from,
        to: moveData.to,
        promotion: moveData.promotion || "q",
      });
      if (!chessMove) {
        console.error("Invalid player move:", moveData);
        return;
      }

      setGamePosition(chess.fen());
      const newMove = {
        moveNumber: Math.floor(moveHistory.length / 2) + 1,
        white: chessMove.san,
        black: null,
        whiteTime: "14:30",
        blackTime: "14:25",
      };

      setMoveHistory((prev) => [...prev, newMove]);
      setIsPlayerTurn(false);

      // Stockfish evaluation, move, and suggestion (if not game over)
      let aiMove = null;
      let evaluation = "unknown";
      let suggestedMove = "develop your pieces";
      if (isStockfishReady && stockfish && !chess.isGameOver()) {
        // Get evaluation
        stockfish.postMessage(`position fen ${chess.fen()}`);
        stockfish.postMessage("eval");
        const evalResponse = await new Promise((resolve) => {
          const handler = (event) => {
            if (event.data.startsWith("info depth")) {
              const scoreMatch = event.data.match(/score cp (-?\d+)/);
              if (scoreMatch) {
                const score = parseInt(scoreMatch[1]) / 100; // Convert to pawns
                resolve(score);
              } else {
                resolve("unknown");
              }
              stockfish.removeEventListener("message", handler);
            }
          };
          stockfish.addEventListener("message", handler);
          setTimeout(() => resolve("unknown"), 1000); // 1-second timeout
        });
        evaluation = evalResponse;

        // Get Stockfish move
        await new Promise((resolve) => setTimeout(resolve, 1000));
        stockfish.postMessage(`position fen ${chess.fen()}`);
        stockfish.postMessage("go movetime 1000");
        aiMove = await new Promise((resolve) => {
          const handler = (event) => {
            if (event.data.startsWith("bestmove")) {
              const move = event.data.split(" ")[1];
              resolve(move && move !== "(none)" ? move : null);
              stockfish.removeEventListener("message", handler);
            }
          };
          stockfish.addEventListener("message", handler);
        });

        // Get suggested move for player
        if (aiMove) {
          const tempChess = new Chess(chess.fen());
          tempChess.move({
            from: aiMove.slice(0, 2),
            to: aiMove.slice(2, 4),
            promotion: aiMove.length > 4 ? aiMove[4] : "q",
          });
          stockfish.postMessage(`position fen ${tempChess.fen()}`);
          stockfish.postMessage("go movetime 500");
          const suggestedResponse = await new Promise((resolve) => {
            const handler = (event) => {
              if (event.data.startsWith("bestmove")) {
                const move = event.data.split(" ")[1];
                resolve(move && move !== "(none)" ? move : "develop your pieces");
                stockfish.removeEventListener("message", handler);
              }
            };
            stockfish.addEventListener("message", handler);
          });
          suggestedMove = suggestedResponse;
        }
      }

      // Coach feedback (single API call)
      const fen = chess.fen();
      const aiMoveNotation = aiMove ? `${aiMove.slice(0, 2)}-${aiMove.slice(2, 4)}` : "my counter";
      const suggestedMoveNotation = suggestedMove !== "develop your pieces" ? suggestedMove.slice(2, 4) : "develop your pieces";
      const prompt = `You are Stockfish, my coach and opponent. I played ${chessMove.san} in this position: ${fen}, evaluated at ${evaluation} pawns. Comment on my move, explain my move ${aiMoveNotation} and its intention, and suggest my next move (${suggestedMoveNotation} or a strategy). Keep it one line, ${coachPersonality} style, for text-to-speech.`;
      const response = await generateCoachResponse(
        prompt,
        coachPersonality,
        coachMessages
      );

      setCoachMessages((prev) => [
        ...prev,
        { sender: "coach", content: response, timestamp: new Date(), type: "text" },
      ]);

      if (isVoiceEnabled) {
        handleVoicePlay(response);
      }

      // Apply Stockfish move if available
      if (aiMove && isStockfishReady && stockfish && !chess.isGameOver()) {
        try {
          const chessMove = chess.move({
            from: aiMove.slice(0, 2),
            to: aiMove.slice(2, 4),
            promotion: aiMove.length > 4 ? aiMove[4] : "q",
          });
          if (chessMove) {
            setGamePosition(chess.fen());
            setMoveHistory((prev) => {
              const updated = [...prev];
              if (updated[updated.length - 1]) {
                updated[updated.length - 1].black = chessMove.san;
              }
              return updated;
            });
            setIsPlayerTurn(true);
            setGameStatus(chess.isGameOver() ? "finished" : "playing");
          }
        } catch (error) {
          console.error("Invalid Stockfish move:", aiMove, error);
          setStockfishError("Invalid move from Stockfish");
          setIsPlayerTurn(true);
        }
      } else {
        console.warn(
          `Skipping Stockfish move: ready=${isStockfishReady}, game_over=${chess.isGameOver()}, stockfish=${!!stockfish}`
        );
        if (!isStockfishReady) {
          setStockfishError("Stockfish not initialized");
          // Fallback to random move
          const moves = chess.moves({ verbose: true });
          if (moves.length > 0) {
            const randomMove = moves[Math.floor(Math.random() * moves.length)];
            const chessMove = chess.move(randomMove);
            setGamePosition(chess.fen());
            setMoveHistory((prev) => {
              const updated = [...prev];
              if (updated[updated.length - 1]) {
                updated[updated.length - 1].black = chessMove.san;
              }
              return updated;
            });
            setIsPlayerTurn(true);
            setGameStatus(chess.isGameOver() ? "finished" : "playing");
            setCoachMessages((prev) => [
              ...prev,
              {
                sender: "coach",
                content: "I’m having trouble, so I made a random move. Keep fighting!",
                timestamp: new Date(),
                type: "text",
              },
            ]);
            if (isVoiceEnabled) {
              handleVoicePlay("I’m having trouble, so I made a random move. Keep fighting!");
            }
          }
        }
        if (chess.isGameOver()) {
          setGameStatus("finished");
          setCoachMessages((prev) => [
            ...prev,
            {
              sender: "coach",
              content: `Game over! ${chess.isCheckmate() ? "Checkmate!" : chess.isStalemate() ? "Stalemate!" : "Game ended."} Ready for a rematch?`,
              timestamp: new Date(),
              type: "text",
            },
          ]);
          if (isVoiceEnabled) {
            handleVoicePlay(
              `Game over! ${chess.isCheckmate() ? "Checkmate!" : chess.isStalemate() ? "Stalemate!" : "Game ended."} Ready for a rematch?`
            );
          }
        }
        setIsPlayerTurn(true);
      }
    } catch (error) {
      console.error("Error processing move:", error);
      setStockfishError(`Error processing move: ${error.message}`);
      setIsPlayerTurn(true);
    }
  };

  // Handle coaching actions
  const handleHint = async () => {
    if (isStockfishReady && stockfish && !chess.isGameOver()) {
      stockfish.postMessage(`position fen ${chess.fen()}`);
      stockfish.postMessage("go movetime 500");
      const hintResponse = await new Promise((resolve) => {
        const handler = (event) => {
          if (event.data.startsWith("bestmove")) {
            const move = event.data.split(" ")[1];
            stockfish.removeEventListener("message", handler);
            resolve(move && move !== "(none)" ? move : "No hint available");
          }
        };
        stockfish.addEventListener("message", handler);
      });
      const hintMessage = `Hint: Try ${hintResponse.slice(2, 4)} to hit back!`;
      setCoachMessages((prev) => [
        ...prev,
        { sender: "coach", content: hintMessage, timestamp: new Date(), type: "text" },
      ]);
      if (isVoiceEnabled) {
        handleVoicePlay(hintMessage);
      }
    } else {
      setCoachMessages((prev) => [
        ...prev,
        {
          sender: "coach",
          content: "No hints right now, make your move and let’s keep the fight going!",
          timestamp: new Date(),
          type: "text",
        },
      ]);
      if (isVoiceEnabled) {
        handleVoicePlay("No hints right now, make your move and let’s keep the fight going!");
      }
    }
    setShowCoachingTip(true);
  };

  const handleUndo = () => {
    if (moveHistory.length > 0) {
      chess.undo();
      setGamePosition(chess.fen());
      setMoveHistory((prev) => prev.slice(0, -1));
      setIsPlayerTurn(true);
      setGameStatus("playing");
      if (stockfish && isStockfishReady) {
        stockfish.postMessage(`position fen ${chess.fen()}`);
      }
      setCoachMessages((prev) => [
        ...prev,
        {
          sender: "coach",
          content: "Move undone! Hit me with a better one!",
          timestamp: new Date(),
          type: "text",
        },
      ]);
      if (isVoiceEnabled) {
        handleVoicePlay("Move undone! Hit me with a better one!");
      }
    }
  };

  const handleAnalysis = () => {
    setIsAnalysisMode(!isAnalysisMode);
    setCoachMessages((prev) => [
      ...prev,
      {
        sender: "coach",
        content: `Analysis mode ${isAnalysisMode ? "off" : "on"}! Let’s break down the board!`,
        timestamp: new Date(),
        type: "text",
      },
    ]);
    if (isVoiceEnabled) {
      handleVoicePlay(`Analysis mode ${isAnalysisMode ? "off" : "on"}! Let’s break down the board!`);
    }
  };

  const handleNewGame = () => {
    chess.reset();
    setGamePosition(chess.fen());
    setMoveHistory([]);
    setCurrentMoveIndex(-1);
    setIsPlayerTurn(true);
    setGameStatus("playing");
    setIsAnalysisMode(false);
    setStockfishError(null);
    if (stockfish && isStockfishReady) {
      stockfish.postMessage("ucinewgame");
      stockfish.postMessage(`position fen ${chess.fen()}`);
    }
    setCoachMessages((prev) => [
      ...prev,
      {
        sender: "coach",
        content: "New game, new fight! You’re White, so bring it on with 1. e4 or 1. d4!",
        timestamp: new Date(),
        type: "text",
      },
    ]);
    if (isVoiceEnabled) {
      handleVoicePlay("New game, new fight! You’re White, so bring it on with 1. e4 or 1. d4!");
    }
  };

  const handleResign = () => {
    setGameStatus("finished");
    setIsPlayerTurn(false);
    setCoachMessages((prev) => [
      ...prev,
      {
        sender: "coach",
        content: "You resigned? Ha, I win this round! Ready to fight again?",
        timestamp: new Date(),
        type: "text",
      },
    ]);
    if (isVoiceEnabled) {
      handleVoicePlay("You resigned? Ha, I win this round! Ready to fight again?");
    }
  };

  // Handle voice controls
  const handleVoiceToggle = () => {
    setIsVoiceEnabled(!isVoiceEnabled);
    setCoachMessages((prev) => [
      ...prev,
      {
        sender: "coach",
        content: `Voice is now ${!isVoiceEnabled ? "on" : "off"}! Let’s keep this battle rocking!`,
        timestamp: new Date(),
        type: "text",
      },
    ]);
    if (!isVoiceEnabled) {
      handleVoicePlay("Voice is now on! Let’s keep this battle rocking!");
    }
  };

  const handleVoicePlay = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsVoicePlaying(true);
      utterance.onend = () => setIsVoicePlaying(false);
      utterance.onerror = (event) => {
        console.error("SpeechSynthesisUtterance error:", event);
        setIsVoicePlaying(false);
      };
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Web Speech API not supported in this browser.");
      setIsVoicePlaying(false);
    }
  };

  const handleVoicePause = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.pause();
      setIsVoicePlaying(false);
    }
  };

  const handleVoiceStop = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsVoicePlaying(false);
    }
  };

  // Handle chat message
  const handleSendMessage = async (message) => {
    setCoachMessages((prev) => [
      ...prev,
      { sender: "user", content: message, timestamp: new Date(), type: "text" },
    ]);
    const response = await generateCoachResponse(
      message,
      coachPersonality,
      coachMessages
    );
    setCoachMessages((prev) => [
      ...prev,
      { sender: "coach", content: response, timestamp: new Date(), type: "text" },
    ]);
    if (isVoiceEnabled) {
      handleVoicePlay(response);
    }
  };

  // Handle move history click
  const handleMoveClick = (moveIndex, move, isWhite) => {
    setCurrentMoveIndex(moveIndex);
    const history = chess.history({ verbose: true }).slice(0, moveIndex + 1);
    chess.reset();
    history.forEach((m) => chess.move(m));
    setGamePosition(chess.fen());
    setIsPlayerTurn(!isWhite);
    if (stockfish && isStockfishReady) {
      stockfish.postMessage(`position fen ${chess.fen()}`);
    }
    setCoachMessages((prev) => [
      ...prev,
      {
        sender: "coach",
        content: `Jumped to move ${moveIndex + 1}! Your turn to hit me back!`,
        timestamp: new Date(),
        type: "text",
      },
    ]);
    if (isVoiceEnabled) {
      handleVoicePlay(`Jumped to move ${moveIndex + 1}! Your turn to hit me back!`);
    }
  };

  // Handle settings
  const handleOpenSettings = () => {
    navigate("/settings-preferences");
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <AppHeader
        user={user}
        onLogout={handleLogout}
        onOpenSettings={handleOpenSettings}
      />

      {/* Stockfish Error Display */}
      {stockfishError && (
        <div className="fixed top-20 left-0 right-0 mx-auto max-w-md bg-red-500 text-white p-4 rounded-lg shadow-lg z-50">
          {stockfishError}. Please try starting a new game.
        </div>
      )}

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
                variant={activePanel === "chat" ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  setActivePanel("chat");
                  setIsMobileMenuOpen(false);
                }}
                className="justify-start"
              >
                <Icon name="MessageCircle" size={16} className="mr-2" />
                Coach Chat
              </Button>
              <Button
                variant={activePanel === "history" ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  setActivePanel("history");
                  setIsMobileMenuOpen(false);
                }}
                className="justify-start"
              >
                <Icon name="History" size={16} className="mr-2" />
                Move History
              </Button>
              <Button
                variant={activePanel === "controls" ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  setActivePanel("controls");
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
                      <div
                        className={`
                        w-3 h-3 rounded-full
                        ${
                          gameStatus === "playing"
                            ? "bg-success animate-pulse"
                            : "bg-muted-foreground"
                        }
                      `}
                      ></div>
                      <div>
                        <h2 className="font-heading font-semibold text-card-foreground">
                          {gameStatus === "playing"
                            ? "Game in Progress"
                            : "Game Finished"}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {isPlayerTurn
                            ? "Your turn to move"
                            : "Stockfish is thinking..."}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <div className="text-sm font-medium text-card-foreground">
                          15:42
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Time remaining
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate("/ai-coach-selection")}
                        className="text-muted-foreground hover:text-card-foreground"
                        title="Change AI coach"
                      >
                        <Icon name="Bot" size={16} />
                      </Button>

                      <Select
                        value={selectedAIProvider}
                        onValueChange={setSelectedAIProvider}
                        options={[
                          { value: "gemini", label: "Gemini" },
                          { value: "openai", label: "OpenAI" },
                          { value: "openrouter", label: "OpenRouter" },
                          { value: "perplexity", label: "Perplexity" },
                        ]}
                        className="w-[120px]"
                      />
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
                <MoveHistory
                  moves={moveHistory}
                  currentMoveIndex={currentMoveIndex}
                  onMoveClick={handleMoveClick}
                  isCollapsed={isHistoryCollapsed}
                  onToggleCollapse={() =>
                    setIsHistoryCollapsed(!isHistoryCollapsed)
                  }
                />

                <div className="h-96">
                  <AICoachChat
                    coachPersonality={coachPersonality}
                    onSendMessage={handleSendMessage}
                    isVoiceEnabled={isVoiceEnabled}
                    onToggleVoice={handleVoiceToggle}
                    messages={coachMessages}
                    setMessages={setCoachMessages}
                  />
                </div>

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
              {activePanel === "chat" && (
                <div className="h-96">
                  <AICoachChat
                    coachPersonality={coachPersonality}
                    onSendMessage={handleSendMessage}
                    isVoiceEnabled={isVoiceEnabled}
                    onToggleVoice={handleVoiceToggle}
                    messages={coachMessages}
                    setMessages={setCoachMessages}
                  />
                </div>
              )}

              {activePanel === "history" && (
                <MoveHistory
                  moves={moveHistory}
                  currentMoveIndex={currentMoveIndex}
                  onMoveClick={handleMoveClick}
                  isCollapsed={false}
                  onToggleCollapse={() =>
                    setIsHistoryCollapsed(!isHistoryCollapsed)
                  }
                />
              )}

              {activePanel === "controls" && (
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

      <CoachingTip
        isVisible={showCoachingTip}
        onDismiss={() => setShowCoachingTip(false)}
        onNext={() => setShowCoachingTip(false)}
        position="center"
        type="tip"
      />

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