import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CoachingTip = ({ 
  tip, 
  isVisible = false, 
  onDismiss, 
  onNext, 
  position = 'center',
  type = 'tip' // 'tip', 'warning', 'success', 'analysis'
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // Mock coaching tips data
  const mockTips = [
    {
      id: 1,
      type: 'tip',
      title: 'Great Opening Choice!',
      content: `Excellent! You played 1.e4, which is one of the most popular and effective opening moves. This move:\n\n• Controls the center squares d5 and f5\n• Opens diagonals for your bishop and queen\n• Follows the opening principle of rapid development\n\nNext, consider developing your knight to f3 to support the center and prepare for castling.`,
      icon: 'Lightbulb',
      priority: 'high'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Watch Your King Safety',
      content: `Your king is still in the center and vulnerable to attack. Consider castling soon to:\n\n• Move your king to safety\n• Connect your rooks\n• Complete your development\n\nCastling kingside (O-O) is usually safer than queenside in this position.`,
      icon: 'Shield',
      priority: 'urgent'
    },
    {
      id: 3,
      type: 'analysis',
      title: 'Tactical Opportunity',
      content: `There's a tactical pattern available! Look for:\n\n• A fork with your knight\n• A pin along the diagonal\n• A discovered attack possibility\n\nTake your time to calculate the consequences before moving.`,
      icon: 'Target',priority: 'medium'
    },
    {
      id: 4,
      type: 'success',title: 'Perfect Timing!',content: `Brilliant move! You found the best continuation. This move:\n\n• Improves your piece coordination\n• Maintains pressure on the opponent\n• Follows sound strategic principles\n\nYou're developing excellent chess intuition!`,
      icon: 'CheckCircle',
      priority: 'low'
    }
  ];

  const currentTip = tip || mockTips[currentTipIndex];

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
    }
  }, [isVisible]);

  const handleDismiss = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onDismiss && onDismiss();
    }, 200);
  };

  const handleNext = () => {
    if (currentTipIndex < mockTips.length - 1) {
      setCurrentTipIndex(prev => prev + 1);
    }
    onNext && onNext();
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'warning':
        return {
          container: 'bg-warning/10 border-warning/30 shadow-warning/20',
          header: 'text-warning',
          icon: 'text-warning'
        };
      case 'success':
        return {
          container: 'bg-success/10 border-success/30 shadow-success/20',
          header: 'text-success',
          icon: 'text-success'
        };
      case 'analysis':
        return {
          container: 'bg-accent/10 border-accent/30 shadow-accent/20',
          header: 'text-accent',
          icon: 'text-accent'
        };
      default:
        return {
          container: 'bg-card border-border shadow-moderate',
          header: 'text-primary',
          icon: 'text-primary'
        };
    }
  };

  const getPositionStyles = () => {
    switch (position) {
      case 'top':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'bottom':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      case 'left':
        return 'left-4 top-1/2 transform -translate-y-1/2';
      case 'right':
        return 'right-4 top-1/2 transform -translate-y-1/2';
      default:
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
    }
  };

  if (!isVisible) return null;

  const styles = getTypeStyles();

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-200"
        onClick={handleDismiss}
      />

      {/* Tip Container */}
      <div 
        className={`
          fixed z-50 max-w-sm w-full mx-4 p-4 rounded-xl border-2 transition-all duration-300
          ${styles.container}
          ${getPositionStyles()}
          ${isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        `}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-lg bg-background/50 ${styles.icon}`}>
              <Icon name={currentTip.icon} size={20} />
            </div>
            <div>
              <h3 className={`font-heading font-semibold text-sm ${styles.header}`}>
                {currentTip.title}
              </h3>
              <p className="text-xs text-muted-foreground capitalize">
                {currentTip.type} • {currentTip.priority} priority
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground -mt-1 -mr-1"
          >
            <Icon name="X" size={16} />
          </Button>
        </div>

        {/* Content */}
        <div className="mb-4">
          <p className="text-sm text-card-foreground whitespace-pre-line leading-relaxed">
            {currentTip.content}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {mockTips.map((_, index) => (
              <div
                key={index}
                className={`
                  w-2 h-2 rounded-full transition-colors
                  ${index === currentTipIndex ? 'bg-primary' : 'bg-muted'}
                `}
              />
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-muted-foreground hover:text-foreground"
            >
              Got it
            </Button>
            
            {currentTipIndex < mockTips.length - 1 && (
              <Button
                variant="default"
                size="sm"
                onClick={handleNext}
                className="text-xs"
              >
                Next Tip
                <Icon name="ChevronRight" size={14} className="ml-1" />
              </Button>
            )}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-3 pt-3 border-t border-border/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Tip {currentTipIndex + 1} of {mockTips.length}</span>
            <span>Press ESC to close</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default CoachingTip;