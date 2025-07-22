import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { generateCoachResponse, streamCoachResponse } from '../../../services/geminiService';

const AICoachChat = ({
  coachPersonality = 'encouraging',
  onSendMessage,
  isVoiceEnabled = false,
  onToggleVoice,
  messages, // Add messages prop
  setMessages, // Add setMessages prop
  meta
}) => {
  // Remove local messages state, it will be managed by parent
  // const [messages, setMessages] = useState([
  // {
  //   id: 1,
  //   sender: 'coach',
  //   content: `Hello! I'm your AI chess coach powered by Gemini. I'm here to help you improve your game with personalized guidance and explanations. Let's start with the opening moves - what's your preferred opening style?`,
  //   timestamp: new Date(Date.now() - 300000),
  //   type: 'text'
  // }]
  // );

  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const coachPersonalities = {
    encouraging: {
      name: 'Coach Elena',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      style: 'Encouraging & Supportive'
    },
    analytical: {
      name: 'Master Viktor',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      style: 'Analytical & Detailed'
    },
    patient: {
      name: 'Coach Sarah',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      style: 'Patient & Methodical'
    },
    challenging: {
      name: 'Grandmaster Alex',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      style: 'Challenging & Direct'
    }
  };

  const currentCoach = coachPersonalities[coachPersonality] || coachPersonalities.encouraging;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isTyping || isStreaming) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      content: newMessage.trim(),
      timestamp: new Date(),
      type: 'text'
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = newMessage.trim();
    setNewMessage('');
    setIsTyping(true);

    if (onSendMessage) {
      onSendMessage(currentInput);
    }

    try {
      // Use streaming for better user experience
      setIsStreaming(true);
      setStreamingMessage('');

      let accumulatedResponse = '';

      await streamCoachResponse(
        currentInput,
        coachPersonality,
        messages,
        (chunk) => {
          accumulatedResponse += chunk;
          setStreamingMessage(accumulatedResponse);
        },
        isVoiceEnabled,
        handleVoicePlay
      );

      // Create the final AI message
      const aiMessage = {
        id: Date.now() + 1,
        sender: 'coach',
        content: accumulatedResponse || "I apologize, but I couldn't generate a proper response. Please try again.",
        timestamp: new Date(),
        type: 'text'
      };

      setMessages((prev) => [...prev, aiMessage]);
      setStreamingMessage('');
      setIsStreaming(false);
      setIsTyping(false);

    } catch (error) {
      console.error('Error sending message:', error);

      // Fallback to non-streaming response
      try {
        const response = await generateCoachResponse(currentInput, coachPersonality, messages);
 
        const aiMessage = {
          id: Date.now() + 1,
          sender: 'coach',
          content: response,
          timestamp: new Date(),
          type: 'text'
        };

        setMessages((prev) => [...prev, aiMessage]);
      } catch (fallbackError) {
        console.error('Fallback response failed:', fallbackError);

        const errorMessage = {
          id: Date.now() + 1,
          sender: 'coach',
          content: "I'm experiencing technical difficulties right now. Please check your internet connection and try again. In the meantime, remember to focus on controlling the center and developing your pieces!",
          timestamp: new Date(),
          type: 'text'
        };

        setMessages((prev) => [...prev, errorMessage]);
      }

      setStreamingMessage('');
      setIsStreaming(false);
      setIsTyping(false);
    }
  };

  const handleQuickAction = (action) => {
    const quickMessages = {
      hint: "Can you give me a hint for my next move?",
      explain: "Can you explain the current position?",
      analyze: "What\'s the best move in this position?",
      opening: "Tell me about this opening."
    };

    if (quickMessages[action]) {
      setNewMessage(quickMessages[action]);
      inputRef.current?.focus();
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-lg shadow-subtle">
      {/* Coach Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={currentCoach.avatar}
              alt={currentCoach.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-primary/20"
              onError={(e) => {
                e.target.src = '/assets/images/no_image.png';
              }} />

            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-card"></div>
          </div>
          <div>
            <h3 className="font-heading font-medium text-card-foreground">
              {currentCoach.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {currentCoach.style} • Powered by Gemini
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleVoice}
            className={`${isVoiceEnabled ? 'text-primary' : 'text-muted-foreground'}`}
            title={isVoiceEnabled ? 'Disable voice' : 'Enable voice'}>

            <Icon name={isVoiceEnabled ? 'Volume2' : 'VolumeX'} size={16} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground"
            title="Coach settings">

            <Icon name="Settings" size={16} />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.map((message) =>
        <div
          key={message.id}
          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>

            <div
            className={`
                max-w-[80%] rounded-lg px-3 py-2 text-sm
                ${message.sender === 'user' ? 'bg-primary text-primary-foreground ml-4' :
            message.type === 'tip' ? 'bg-accent/10 border border-accent/20 text-accent-foreground' : 'bg-muted text-muted-foreground mr-4'}
              `
            }>

              {message.type === 'tip' &&
            <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Lightbulb" size={14} className="text-accent" />
                  <span className="font-medium text-accent">Coaching Tip</span>
                </div>
            }
              
              <div className="whitespace-pre-wrap">{message.content}</div>
              
              <div className={`
                text-xs mt-1 opacity-70
                ${message.sender === 'user' ? 'text-right' : 'text-left'}
              `}>
                {formatTimestamp(message.timestamp)}
              </div>
            </div>
          </div>
        )}

        {/* Streaming Message Display */}
        {isStreaming && streamingMessage &&
        <div className="flex justify-start">
            <div className="bg-muted text-muted-foreground rounded-lg px-3 py-2 mr-4 max-w-[80%]">
              <div className="whitespace-pre-wrap">{streamingMessage}</div>
              <div className="text-xs mt-1 opacity-70 text-left">
                <Icon name="Loader" size={12} className="inline animate-spin mr-1" />
                Generating...
              </div>
            </div>
          </div>
        }

        {isTyping && !isStreaming &&
        <div className="flex justify-start">
            <div className="bg-muted text-muted-foreground rounded-lg px-3 py-2 mr-4">
              <div className="flex items-center space-x-1">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <span className="text-xs ml-2">Coach is thinking...</span>
              </div>
            </div>
          </div>
        }
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 border-t border-border bg-muted/20">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleQuickAction('hint')}
            disabled={isTyping || isStreaming}
            className="flex items-center space-x-1 px-2 py-1 bg-background hover:bg-muted rounded text-xs font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed">

            <Icon name="HelpCircle" size={12} />
            <span>Hint</span>
          </button>
          
          <button
            onClick={() => handleQuickAction('explain')}
            disabled={isTyping || isStreaming}
            className="flex items-center space-x-1 px-2 py-1 bg-background hover:bg-muted rounded text-xs font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed">

            <Icon name="MessageCircle" size={12} />
            <span>Explain</span>
          </button>
          
          <button
            onClick={() => handleQuickAction('analyze')}
            disabled={isTyping || isStreaming}
            className="flex items-center space-x-1 px-2 py-1 bg-background hover:bg-muted rounded text-xs font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed">

            <Icon name="Search" size={12} />
            <span>Analyze</span>
          </button>
        </div>
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-border">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ask your coach anything..."
              className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              rows="2"
              disabled={isTyping || isStreaming}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }} />

          </div>
          
          <Button
            type="submit"
            variant="default"
            size="icon"
            disabled={!newMessage.trim() || isTyping || isStreaming}
            className="shrink-0">

            <Icon name="Send" size={16} />
          </Button>
        </div>
        
        {/* API Key Warning */}
        {!import.meta.env.VITE_GEMINI_API_KEY &&
        <div className="mt-2 p-2 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="flex items-center space-x-2 text-xs text-warning-foreground">
              <Icon name="AlertTriangle" size={12} />
              <span>Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your environment variables.</span>
            </div>
          </div>
        }
      </form>
    </div>);

};

export default AICoachChat;