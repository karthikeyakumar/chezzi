import {
  GeminiStrategy,
  OpenAIStrategy,
  OpenRouterStrategy,
  PerplexityStrategy,
} from "./aiStrategies";

class AIService {
  constructor() {
    this._strategies = {}; // Use a private map for strategies
    this._activeStrategy = null;

    // Initialize default strategy (Gemini) immediately
    this.setStrategy("perplexity");
  }

  _getStrategy(strategyName) {
    if (!this._strategies[strategyName]) {
      try {
        switch (strategyName) {
          case "gemini":
            this._strategies.gemini = new GeminiStrategy(
              import.meta.env.VITE_GEMINI_API_KEY
            );
            break;
          case "openai":
            this._strategies.openai = new OpenAIStrategy(
              import.meta.env.VITE_OPENAI_API_KEY
            );
            break;
          case "openrouter":
            this._strategies.openrouter = new OpenRouterStrategy(
              import.meta.env.VITE_OPENROUTER_API_KEY
            );
            break;
          case "perplexity":
            this._strategies.perplexity = new PerplexityStrategy(
              import.meta.env.VITE_PERPLEXITY_API_KEY
            );
            break;
          default:
            console.warn(`Unknown AI strategy: ${strategyName}`);
            return null;
        }
      } catch (error) {
        console.error(`Error initializing strategy ${strategyName}:`, error);
        return null;
      }
    }
    return this._strategies[strategyName];
  }

  setStrategy(strategyName) {
    const strategy = this._getStrategy(strategyName);
    if (strategy) {
      this._activeStrategy = strategy;
      console.log(`AI strategy set to: ${strategyName}`);
    } else {
      console.warn(
        `Could not set AI strategy to '${strategyName}'. Falling back to default or previous strategy.`
      );
      // Optionally, set a fallback strategy if _activeStrategy is null
      if (!this._activeStrategy) {
        this._activeStrategy = this._getStrategy("gemini"); // Fallback to Gemini if nothing else works
      }
    }
  }

  async generateContent(prompt, chatHistory = [], options = {}) {
    if (!this._activeStrategy) {
      throw new Error("No active AI strategy set.");
    }
    return this._activeStrategy.generateContent(prompt, chatHistory, options);
  }

  async streamContent(prompt, onChunk, chatHistory = [], options = {}) {
    if (!this._activeStrategy) {
      throw new Error("No active AI strategy set.");
    }
    return this._activeStrategy.streamContent(
      prompt,
      onChunk,
      chatHistory,
      options
    );
  }
}

const aiService = new AIService();
export default aiService;
