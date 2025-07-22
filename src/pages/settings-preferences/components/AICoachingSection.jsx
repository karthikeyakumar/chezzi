import React, { useState } from 'react';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const AICoachingSection = ({ settings, onSettingChange }) => {
  const [showPersonalityPreview, setShowPersonalityPreview] = useState(false);

  const coachingFrequencyOptions = [
    { 
      value: 'every-move', 
      label: 'Every Move',
      description: 'Continuous guidance and feedback after each move'
    },
    { 
      value: 'major-decisions', 
      label: 'Major Decisions',
      description: 'Coaching during critical moments and key positions'
    },
    { 
      value: 'mistakes-only', 
      label: 'Mistakes Only',
      description: 'Intervention only when errors are detected'
    },
    { 
      value: 'on-request', 
      label: 'On Request',
      description: 'Coaching available when you ask for help'
    }
  ];

  const explanationComplexityOptions = [
    { 
      value: 'beginner', 
      label: 'Beginner',
      description: 'Simple explanations with basic chess concepts'
    },
    { 
      value: 'intermediate', 
      label: 'Intermediate',
      description: 'Balanced explanations with strategic insights'
    },
    { 
      value: 'advanced', 
      label: 'Advanced',
      description: 'Detailed analysis with complex tactical concepts'
    },
    { 
      value: 'master', 
      label: 'Master Level',
      description: 'Professional-level analysis and terminology'
    }
  ];

  const personalityOptions = [
    { 
      value: 'encouraging-mentor', 
      label: 'Encouraging Mentor',
      description: 'Positive, supportive, and motivational coaching style'
    },
    { 
      value: 'analytical-professor', 
      label: 'Analytical Professor',
      description: 'Detailed, methodical, and educational approach'
    },
    { 
      value: 'friendly-companion', 
      label: 'Friendly Companion',
      description: 'Casual, humorous, and conversational style'
    },
    { 
      value: 'strict-trainer', 
      label: 'Strict Trainer',
      description: 'Direct, challenging, and performance-focused'
    }
  ];

  const humorLevelOptions = [
    { value: 'none', label: 'None', description: 'Serious and professional tone' },
    { value: 'light', label: 'Light', description: 'Occasional gentle humor' },
    { value: 'moderate', label: 'Moderate', description: 'Regular funny comments and jokes' },
    { value: 'high', label: 'High', description: 'Frequent humor and entertaining commentary' }
  ];

  const encouragementStyleOptions = [
    { value: 'gentle', label: 'Gentle', description: 'Soft and understanding approach' },
    { value: 'motivational', label: 'Motivational', description: 'Inspiring and energetic feedback' },
    { value: 'challenging', label: 'Challenging', description: 'Pushes you to improve faster' },
    { value: 'balanced', label: 'Balanced', description: 'Mix of support and challenge' }
  ];

  const personalityPreviews = {
    'encouraging-mentor': "Great move! You\'re really starting to understand chess strategy. Keep thinking about piece development and you\'ll improve quickly!",
    'analytical-professor': "This move demonstrates a solid understanding of central control. The knight on f3 supports the e5 square while maintaining flexibility for future development.",
    'friendly-companion': "Nice one! That knight jump was pretty slick. Your opponent probably didn't see that coming. Chess is like a puzzle, and you're getting good at solving it!",
    'strict-trainer': "Acceptable move, but you missed a stronger option. Focus on calculating deeper before moving. Champions don't settle for 'good enough' moves."
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6 space-y-6">
      <div>
        <h3 className="text-lg font-heading font-semibold text-card-foreground">
          AI Coaching Settings
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Customize your AI coach's behavior and teaching style
        </p>
      </div>

      {/* Coaching Frequency & Complexity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Select
          label="Coaching Frequency"
          description="How often should your AI coach provide guidance"
          options={coachingFrequencyOptions}
          value={settings.coachingFrequency}
          onChange={(value) => onSettingChange('coachingFrequency', value)}
        />

        <Select
          label="Explanation Complexity"
          description="Choose the depth of chess explanations"
          options={explanationComplexityOptions}
          value={settings.explanationComplexity}
          onChange={(value) => onSettingChange('explanationComplexity', value)}
        />
      </div>

      {/* AI Personality */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-md font-heading font-medium text-card-foreground">
              Coach Personality
            </h4>
            <p className="text-sm text-muted-foreground">
              Select your preferred coaching personality and style
            </p>
          </div>
          <button
            onClick={() => setShowPersonalityPreview(!showPersonalityPreview)}
            className="flex items-center space-x-2 px-3 py-2 text-sm bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-colors duration-200"
          >
            <Icon name="MessageCircle" size={16} />
            <span>{showPersonalityPreview ? 'Hide' : 'Show'} Preview</span>
          </button>
        </div>

        <Select
          label="Personality Type"
          description="Choose your AI coach's overall personality"
          options={personalityOptions}
          value={settings.personalityType}
          onChange={(value) => onSettingChange('personalityType', value)}
          className="mb-4"
        />

        {/* Personality Preview */}
        {showPersonalityPreview && (
          <div className="bg-muted/30 rounded-lg p-4 border border-border mb-6">
            <div className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-full flex-shrink-0">
                <Icon name="Bot" size={16} className="text-primary-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-card-foreground italic">
                  "{personalityPreviews[settings.personalityType] || personalityPreviews['encouraging-mentor']}"
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Sample coaching message in {settings.personalityType.replace('-', ' ')} style
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Personality Traits */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Select
            label="Humor Level"
            description="How much humor should be included"
            options={humorLevelOptions}
            value={settings.humorLevel}
            onChange={(value) => onSettingChange('humorLevel', value)}
          />

          <Select
            label="Encouragement Style"
            description="Type of motivational approach"
            options={encouragementStyleOptions}
            value={settings.encouragementStyle}
            onChange={(value) => onSettingChange('encouragementStyle', value)}
          />
        </div>
      </div>

      {/* Technical Depth */}
      <div>
        <h4 className="text-md font-heading font-medium text-card-foreground mb-4">
          Technical Analysis Depth
        </h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Analysis Depth: {settings.technicalDepth}%
            </label>
            <input
              type="range"
              min="10"
              max="100"
              step="10"
              value={settings.technicalDepth}
              onChange={(e) => onSettingChange('technicalDepth', parseInt(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Basic</span>
              <span>Moderate</span>
              <span>Deep Analysis</span>
            </div>
          </div>
        </div>
      </div>

      {/* Coaching Features */}
      <div>
        <h4 className="text-md font-heading font-medium text-card-foreground mb-4">
          Coaching Features
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Checkbox
            label="Opening book guidance"
            description="Receive coaching on opening principles"
            checked={settings.openingGuidance}
            onChange={(e) => onSettingChange('openingGuidance', e.target.checked)}
          />
          
          <Checkbox
            label="Tactical alerts"
            description="Get notified about tactical opportunities"
            checked={settings.tacticalAlerts}
            onChange={(e) => onSettingChange('tacticalAlerts', e.target.checked)}
          />
          
          <Checkbox
            label="Endgame coaching"
            description="Specialized guidance in endgame positions"
            checked={settings.endgameCoaching}
            onChange={(e) => onSettingChange('endgameCoaching', e.target.checked)}
          />
          
          <Checkbox
            label="Blunder prevention"
            description="Warning before making serious mistakes"
            checked={settings.blunderPrevention}
            onChange={(e) => onSettingChange('blunderPrevention', e.target.checked)}
          />
          
          <Checkbox
            label="Position evaluation"
            description="Show numerical evaluation of positions"
            checked={settings.positionEvaluation}
            onChange={(e) => onSettingChange('positionEvaluation', e.target.checked)}
          />
          
          <Checkbox
            label="Move suggestions"
            description="Offer alternative move suggestions"
            checked={settings.moveSuggestions}
            onChange={(e) => onSettingChange('moveSuggestions', e.target.checked)}
          />
        </div>
      </div>

      {/* Learning Goals */}
      <div>
        <h4 className="text-md font-heading font-medium text-card-foreground mb-4">
          Learning Focus Areas
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Checkbox
            label="Opening theory"
            checked={settings.focusOpening}
            onChange={(e) => onSettingChange('focusOpening', e.target.checked)}
          />
          
          <Checkbox
            label="Middle game strategy"
            checked={settings.focusMiddlegame}
            onChange={(e) => onSettingChange('focusMiddlegame', e.target.checked)}
          />
          
          <Checkbox
            label="Endgame technique"
            checked={settings.focusEndgame}
            onChange={(e) => onSettingChange('focusEndgame', e.target.checked)}
          />
          
          <Checkbox
            label="Tactical patterns"
            checked={settings.focusTactics}
            onChange={(e) => onSettingChange('focusTactics', e.target.checked)}
          />
          
          <Checkbox
            label="Positional play"
            checked={settings.focusPositional}
            onChange={(e) => onSettingChange('focusPositional', e.target.checked)}
          />
          
          <Checkbox
            label="Time management"
            checked={settings.focusTimeManagement}
            onChange={(e) => onSettingChange('focusTimeManagement', e.target.checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default AICoachingSection;