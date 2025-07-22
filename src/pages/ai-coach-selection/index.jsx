import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/ui/AppHeader';
import FilterBar from './components/FilterBar';
import CoachGrid from './components/CoachGrid';
import StickyActionBar from './components/StickyActionBar';
import Icon from '../../components/AppIcon';

const AICoachSelection = () => {
  const navigate = useNavigate();
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [filteredCoaches, setFilteredCoaches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter states
  const [selectedStyle, setSelectedStyle] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock coaches data
  const allCoaches = [
    {
      id: 'patient-teacher',
      name: 'Patient Teacher',
      specialty: 'Beginner-Friendly Guidance',
      description: `Perfect for chess newcomers, I provide gentle guidance with clear explanations. I break down complex concepts into simple steps and celebrate every small victory along your chess journey.`,
      sampleDialogue: "Great move! You're thinking like a chess player. Let me explain why that knight move creates a beautiful fork...",
      sampleText: "Hello! I'm your patient chess teacher, ready to guide you step by step through this wonderful game.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      tags: ['Beginner', 'Patient', 'Clear'],
      studentsCount: '2.1k',
      rating: '4.9',
      experience: '5+ years',
      style: 'beginner-friendly',
      difficulty: 'beginner',
      isNew: false
    },
    {
      id: 'witty-strategist',
      name: 'Witty Strategist',
      specialty: 'Humorous Strategic Analysis',
      description: `I make chess fun with clever jokes and witty observations while teaching deep strategic concepts. Learning chess doesn't have to be serious - let's have some laughs while we checkmate!`,
      sampleDialogue: "Ah, moving that pawn is like wearing socks with sandals - technically legal, but questionable fashion sense!",
      sampleText: "Welcome to chess comedy hour! I'm here to make you laugh while you learn to dominate the board.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      tags: ['Funny', 'Strategic', 'Engaging'],
      studentsCount: '1.8k',
      rating: '4.8',
      experience: '4+ years',
      style: 'humorous',
      difficulty: 'intermediate',
      isNew: true
    },
    {
      id: 'encouraging-mentor',
      name: 'Encouraging Mentor',
      specialty: 'Motivational Chess Coaching',
      description: `Your biggest chess cheerleader! I focus on building confidence and maintaining motivation. Every mistake is a learning opportunity, and every good move deserves celebration.`,
      sampleDialogue: "You\'re improving so much! That tactical sequence shows real chess understanding. Keep up the excellent work!",
      sampleText: "I believe in you! Together, we'll unlock your chess potential and build unshakeable confidence.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      tags: ['Motivating', 'Positive', 'Supportive'],
      studentsCount: '3.2k',
      rating: '4.9',
      experience: '6+ years',
      style: 'encouraging',
      difficulty: 'beginner',
      isNew: false
    },
    {
      id: 'analytical-master',
      name: 'Analytical Master',
      specialty: 'Deep Position Analysis',
      description: `For serious students who want comprehensive analysis. I provide detailed evaluations, calculate variations deeply, and explain the subtle nuances that separate good moves from great ones.`,
      sampleDialogue: "This position offers three candidate moves. Let's analyze each: 1.Nf5 creates pressure but allows counterplay, while 1.Bd4 maintains central control...",
      sampleText: "Precision and analysis are the keys to chess mastery. Let\'s dive deep into the complexities of this royal game.",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
      tags: ['Analytical', 'Detailed', 'Advanced'],
      studentsCount: '1.5k',
      rating: '4.7',
      experience: '8+ years',
      style: 'analytical',
      difficulty: 'advanced',
      isNew: false
    },
    {
      id: 'tactical-trainer',
      name: 'Tactical Trainer',
      specialty: 'Pattern Recognition Expert',
      description: `Specializing in tactical patterns and combinations. I'll help you spot forks, pins, skewers, and discovered attacks. Your tactical vision will improve dramatically with my focused training.`,
      sampleDialogue: "Look for the pattern! The enemy king and queen are on the same diagonal - perfect for a discovered check!",
      sampleText: "Tactics are the foundation of chess. Let\'s sharpen your pattern recognition and calculation skills.",
      avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
      tags: ['Tactical', 'Patterns', 'Sharp'],
      studentsCount: '2.7k',rating: '4.8',experience: '7+ years',style: 'analytical',
      difficulty: 'intermediate',
      isNew: false
    },
    {
      id: 'endgame-expert',name: 'Endgame Expert',specialty: 'Endgame Mastery',
      description: `The endgame is where games are won and lost. I specialize in teaching essential endgame patterns, pawn structures, and the precise techniques needed for endgame excellence.`,
      sampleDialogue: "In king and pawn endgames, the key is opposition. Control the critical squares and your pawn will promote!",
      sampleText: "Endgames are pure chess logic. Master these patterns and you\'ll win many more games.",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
      tags: ['Endgame', 'Precise', 'Technical'],
      studentsCount: '1.9k',rating: '4.9',experience: '9+ years',style: 'analytical',
      difficulty: 'advanced',
      isNew: false
    },
    {
      id: 'opening-guru',name: 'Opening Guru',specialty: 'Opening Theory & Principles',
      description: `Master the opening phase with solid principles and practical repertoires. I teach both classical openings and modern systems, helping you choose what fits your style.`,
      sampleDialogue: "The Italian Game leads to rich middlegame positions. Develop pieces toward the center and castle early for safety!",
      sampleText: "A good opening sets the foundation for the entire game. Let\'s build your opening repertoire together.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      tags: ['Openings', 'Theory', 'Repertoire'],
      studentsCount: '2.4k',rating: '4.7',experience: '6+ years',style: 'strategic',
      difficulty: 'intermediate',
      isNew: true
    },
    {
      id: 'blitz-coach',name: 'Blitz Coach',specialty: 'Fast-Paced Game Training',description: `Speed chess requires quick decision-making and intuitive play. I'll help you develop rapid pattern recognition and time management skills for blitz and bullet games.`,
      sampleDialogue: "Trust your instincts! In blitz, the first good move you see is often the right one. Don't overthink it!",
      sampleText: "Fast chess, sharp decisions! Let's develop your speed and intuition for rapid-fire games.",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
      tags: ['Speed', 'Intuitive', 'Quick'],
      studentsCount: '1.6k',
      rating: '4.6',
      experience: '4+ years',
      style: 'challenging',
      difficulty: 'intermediate',
      isNew: false
    }
  ];

  // Filter coaches based on current filters
  useEffect(() => {
    let filtered = allCoaches;

    // Filter by style
    if (selectedStyle !== 'all') {
      filtered = filtered.filter(coach => coach.style === selectedStyle);
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(coach => coach.difficulty === selectedDifficulty);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(coach => 
        coach.name.toLowerCase().includes(query) ||
        coach.specialty.toLowerCase().includes(query) ||
        coach.description.toLowerCase().includes(query) ||
        coach.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    setFilteredCoaches(filtered);
  }, [selectedStyle, selectedDifficulty, searchQuery]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSelectCoach = (coach) => {
    setSelectedCoach(coach);
  };

  const handlePreviewAudio = (coachId, sampleText) => {
    // Mock audio preview - in real app, this would use text-to-speech
    console.log(`Playing audio preview for ${coachId}: ${sampleText}`);
    
    // Simulate speech synthesis
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(sampleText);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const handleContinue = () => {
    if (selectedCoach) {
      // Save selected coach to localStorage or context
      localStorage.setItem('selectedCoach', JSON.stringify(selectedCoach));
      navigate('/main-game-interface');
    }
  };

  const handleBack = () => {
    navigate('/main-game-interface');
  };

  const handleClearFilters = () => {
    setSelectedStyle('all');
    setSelectedDifficulty('all');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedStyle !== 'all' || selectedDifficulty !== 'all' || searchQuery.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      {/* Main Content */}
      <main className="pt-16 pb-32">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-xl mx-auto mb-4">
              <Icon name="Bot" size={32} className="text-primary" />
            </div>
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
              Choose Your AI Chess Coach
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Select a coaching personality that matches your learning style. Each coach offers unique guidance approaches to help you improve your chess skills.
            </p>
          </div>

          {/* Filter Bar */}
          <FilterBar
            selectedStyle={selectedStyle}
            onStyleChange={setSelectedStyle}
            selectedDifficulty={selectedDifficulty}
            onDifficultyChange={setSelectedDifficulty}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClearFilters={handleClearFilters}
          />

          {/* Results Summary */}
          {!isLoading && (
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                {filteredCoaches.length} coach{filteredCoaches.length !== 1 ? 'es' : ''} available
                {hasActiveFilters && ' (filtered)'}
              </p>
              
              {selectedCoach && (
                <div className="hidden lg:flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                  <Icon name="Check" size={14} />
                  <span>{selectedCoach.name} selected</span>
                </div>
              )}
            </div>
          )}

          {/* Coach Grid */}
          <CoachGrid
            coaches={filteredCoaches}
            selectedCoach={selectedCoach}
            onSelectCoach={handleSelectCoach}
            onPreviewAudio={handlePreviewAudio}
            isLoading={isLoading}
            hasFilters={hasActiveFilters}
          />

          {/* Help Section */}
          {!isLoading && filteredCoaches.length > 0 && (
            <div className="mt-12 bg-card border border-border rounded-xl p-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="HelpCircle" size={20} className="text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-heading font-medium text-card-foreground mb-2">
                    Need help choosing?
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Not sure which coach is right for you? Here are some quick recommendations:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start space-x-2">
                      <Icon name="Users" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-card-foreground">New to chess?</span>
                        <p className="text-muted-foreground">Try Patient Teacher or Encouraging Mentor</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Icon name="Zap" size={16} className="text-warning mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-card-foreground">Want to improve tactics?</span>
                        <p className="text-muted-foreground">Choose Tactical Trainer or Analytical Master</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Icon name="Smile" size={16} className="text-success mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-card-foreground">Prefer fun learning?</span>
                        <p className="text-muted-foreground">Go with Witty Strategist for humor</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Icon name="Clock" size={16} className="text-accent mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-card-foreground">Play fast games?</span>
                        <p className="text-muted-foreground">Blitz Coach will help with speed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Sticky Action Bar */}
      <StickyActionBar
        selectedCoach={selectedCoach}
        onContinue={handleContinue}
        onBack={handleBack}
      />
    </div>
  );
};

export default AICoachSelection;