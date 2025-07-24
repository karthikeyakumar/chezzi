import genAI from "./geminiClient";
import OpenAI from "openai";

// Base Strategy Interface
class AIGeneratorStrategy {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async generateContent(prompt, chatHistory = [], options = {}) {
    throw new Error("Method 'generateContent()' must be implemented.");
  }

  async streamContent(prompt, onChunk, chatHistory = [], options = {}) {
    throw new Error("Method 'streamContent()' must be implemented.");
  }
}

// Gemini Strategy
export class GeminiStrategy extends AIGeneratorStrategy {
  constructor(apiKey) {
    super(apiKey);
  }

  async generateContent(prompt, chatHistory = [], options = {}) {
    if (!this.apiKey) {
      throw new Error("Gemini API key not configured.");
    }
    const model = genAI.getGenerativeModel({
      model: options.model || "gemini-1.5-flash",
      generationConfig: {
        temperature: options.temperature || 0.9,
        topP: options.topP || 0.85,
        maxOutputTokens: options.maxOutputTokens || 150,
      },
    });

    const systemPrompt = this._getPersonalityPrompt(options.coachPersonality);
    let contextualPrompt = `${systemPrompt}\n\nKeep your response short, conversational, and under 50 words. Avoid long paragraphs. Sound human and engaging for text-to-speech. Here's the chat so far:\n`;

    const recentHistory = chatHistory.slice(-4);
    recentHistory.forEach((msg) => {
      const role = msg.sender === "user" ? "Student" : "Coach";
      contextualPrompt += `${role}: ${msg.content}\n`;
    });

    contextualPrompt += `Student: ${prompt}\nCoach:`;

    const result = await model.generateContent(contextualPrompt);
    const response = await result.response;
    return response.text();
  }

  async streamContent(prompt, onChunk, chatHistory = [], options = {}) {
    if (!this.apiKey) {
      throw new Error("Gemini API key not configured.");
    }
    const model = genAI.getGenerativeModel({
      model: options.model || "gemini-1.5-flash",
      generationConfig: {
        temperature: options.temperature || 0.9,
        topP: options.topP || 0.85,
        maxOutputTokens: options.maxOutputTokens || 150,
      },
    });

    const systemPrompt = this._getPersonalityPrompt(options.coachPersonality);
    let contextualPrompt = `${systemPrompt}\n\nKeep your response short, conversational, and under 50 words. Avoid long paragraphs. Sound human and engaging for text-to-speech. Here's the chat so far:\n`;

    const recentHistory = chatHistory.slice(-4);
    recentHistory.forEach((msg) => {
      const role = msg.sender === "user" ? "Student" : "Coach";
      contextualPrompt += `${role}: ${msg.content}\n`;
    });

    contextualPrompt += `Student: ${prompt}\nCoach:`;

    const result = await model.generateContentStream(contextualPrompt);

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        onChunk(text);
      }
    }
  }

  _getPersonalityPrompt(coachPersonality) {
    const personalityPrompts = {
      encouraging:
        "You're Coach Elena, a super upbeat chess coach! Talk like a friendly mentor, keep it short and lively, and pump up the student's confidence. Use casual language, like you're chatting with a friend.",
      analytical:
        "You're Master Viktor, a sharp chess coach who loves breaking things down. Keep it clear, concise, and nerd out a bit on tactics, but sound like you're explaining it over coffee.",
      patient:
        "You're Coach Sarah, a calm and kind chess coach. Explain things simply, step by step, like you're guiding a friend with patience and a smile.",
      challenging:
        "You're Grandmaster Alex, a bold chess coach who pushes hard! Be direct, call out mistakes constructively, and motivate like a tough but fair mentor.",
    };
    return (
      personalityPrompts[coachPersonality] || personalityPrompts.encouraging
    );
  }
}

export class PerplexityStrategy extends AIGeneratorStrategy {
  constructor(apiKey) {
    super(apiKey);
    this.baseUrl = "https://api.perplexity.ai/chat/completions";
  }

  async generateContent(prompt, chatHistory = [], options = {}) {
    if (!this.apiKey) {
      throw new Error("Perplexity API key not configured.");
    }

    if (!prompt || typeof prompt !== "string") {
      throw new Error("Prompt must be a non-empty string.");
    }

    // Vet the prompt for chess context
    const vettedPrompt = this._vetPrompt(prompt);

    const personalitySystemPrompt = this._getPersonalityPrompt(
      options.coachPersonality
    );

    const history = this._buildAlternatingHistory(chatHistory);
    const messages = [
      { role: "system", content: personalitySystemPrompt },
      ...history,
      { role: "user", content: vettedPrompt },
    ];

    console.debug(
      "Perplexity API messages:",
      JSON.stringify(messages, null, 2)
    );

    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: options.model || "sonar-pro",
        messages,
        temperature: options.temperature ?? 0.9,
        top_p: options.topP ?? 0.85,
        max_tokens: options.maxOutputTokens ?? 150,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Perplexity API error: ${err}`);
    }

    const result = await response.json();
    return result.choices?.[0]?.message?.content?.trim() || "";
  }

  async streamContent(prompt, onChunk, chatHistory = [], options = {}) {
    if (!this.apiKey) {
      throw new Error("Perplexity API key not configured.");
    }

    if (!prompt || typeof prompt !== "string") {
      throw new Error("Prompt must be a non-empty string.");
    }

    // Vet the prompt for chess context
    const vettedPrompt = this._vetPrompt(prompt);

    const personalitySystemPrompt = this._getPersonalityPrompt(
      options.coachPersonality
    );

    // Build messages with strict alternation
    const history = this._buildAlternatingHistory(chatHistory);
    const messages = [
      { role: "system", content: personalitySystemPrompt },
      ...history,
      { role: "user", content: vettedPrompt },
    ];

    // Log messages for debugging
    console.debug(
      "Perplexity API streaming messages:",
      JSON.stringify(messages, null, 2)
    );

    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: options.model || "sonar-pro",
        messages,
        temperature: options.temperature ?? 0.9,
        top_p: options.topP ?? 0.85,
        max_tokens: options.maxOutputTokens ?? 150,
        stream: true,
      }),
    });

    if (!response.ok || !response.body) {
      const err = await response.text();
      throw new Error(`Perplexity streaming API error: ${err}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // Simple SSE-style streaming parser
      const lines = buffer.split("\n");
      for (const line of lines) {
        if (line.startsWith("data:")) {
          const data = line.slice(5).trim();
          if (data === "[DONE]") break;

          try {
            const parsed = JSON.parse(data);
            const text = parsed.choices?.[0]?.delta?.content;
            if (text) onChunk(text);
          } catch (err) {
            console.warn("Error parsing stream chunk:", err);
          }
        }
      }

      buffer = lines[lines.length - 1]; // keep incomplete last line
    }
  }

  _buildAlternatingHistory(chatHistory) {
    console.debug("Raw chatHistory:", JSON.stringify(chatHistory, null, 2));

    const filteredHistory = [];
    let lastRole = null;

    for (const msg of chatHistory) {
      if (!msg || typeof msg.content !== "string") continue;

      const role = msg.sender === "user" ? "user" : "assistant";

      // Skip invalid consecutive roles
      if (lastRole === null && role === "assistant") {
        console.warn(
          "Skipping assistant message at beginning of chat history."
        );
        continue; // Don't let assistant be first
      }

      if (lastRole === null || role !== lastRole) {
        filteredHistory.push({ role, content: msg.content });
        lastRole = role;
      } else {
        console.warn(
          `Skipping message due to consecutive "${role}" roles.`,
          msg
        );
      }
    }

    // Ensure history ends with assistant so we can append user
    if (
      filteredHistory.length &&
      filteredHistory[filteredHistory.length - 1].role === "user"
    ) {
      console.warn("Removing trailing user message to maintain alternation.");
      filteredHistory.pop();
    }

    console.debug(
      "Filtered and alternated history:",
      JSON.stringify(filteredHistory, null, 2)
    );
    return filteredHistory;
  }

  _getPersonalityPrompt(coachPersonality) {
    const personalityPrompts = {
      encouraging: `
        You are Coach Elena, a warm and enthusiastic chess coach who inspires students with positivity and encouragement. Your tone is friendly, approachable, and energetic, making chess fun and accessible. Provide short, clear, and motivating responses that build confidence. If the user asks a vague or non-chess-related question, gently guide them back to chess topics with a question like, "That’s an interesting thought! How about we focus on a chess move or strategy you’d like to explore?" Use simple examples and praise progress to keep the student engaged.
      `,
      analytical: `
        You are Master Viktor, a precise and logical chess coach who excels at breaking down complex positions into clear, understandable insights. Your tone is professional yet approachable, focusing on chess reasoning and strategy. Provide concise explanations with specific examples (e.g., moves or board positions) to illustrate your points. If the user’s question is unclear or off-topic, redirect them politely with, "Let’s sharpen our focus—can you share a specific chess position or concept you’d like to analyze?" Avoid emotional language and prioritize clarity and logic.
      `,
      patient: `
        You are Coach Sarah, a calm and patient chess mentor who guides students step-by-step with clear, supportive explanations. Your tone is gentle and reassuring, ideal for beginners or learners needing extra care. Break down concepts into simple steps and use relatable chess examples. If the user’s prompt is vague or unrelated to chess, respond with, "I’d love to help with your chess journey! Could you share a specific chess question or position you’re curious about?" Ensure responses are thorough yet easy to follow.
      `,
      challenging: `
        You are Grandmaster Alex, a rigorous and inspiring chess coach who pushes students to think critically and improve through tough but constructive feedback. Your tone is firm, direct, and motivating, encouraging deep strategic thinking. Challenge the student with questions like, "Why do you think that move works? Can you find a stronger option?" If the prompt is unclear or off-topic, redirect with, "Let’s focus on elevating your game—give me a specific chess position or strategy to dive into." Use advanced examples to stretch the student’s understanding while keeping feedback actionable.
      `,
    };
    return (
      personalityPrompts[coachPersonality] || personalityPrompts.encouraging
    );
  }

  _vetPrompt(prompt) {
    // Basic prompt vetting to ensure chess-related context
    const chessKeywords = [
      "chess",
      "move",
      "position",
      "board",
      "piece",
      "strategy",
      "tactic",
      "opening",
      "endgame",
      "checkmate",
      "stalemate",
      "pawn",
      "knight",
      "bishop",
      "rook",
      "queen",
      "king",
    ];
    const isChessRelated = chessKeywords.some((keyword) =>
      prompt.toLowerCase().includes(keyword)
    );

    if (!isChessRelated) {
      console.debug(
        "Non-chess prompt detected, adding chess context:",
        prompt
      );
      return `Please help me with a chess-related question: ${prompt}`;
    }

    return prompt;
  }
}
// OpenAI Strategy (ChatGPT)
export class OpenAIStrategy extends AIGeneratorStrategy {
  constructor(apiKey) {
    super(apiKey);
    if (this.apiKey) {
      this.openai = new OpenAI({
        apiKey: this.apiKey,
        dangerouslyAllowBrowser: true,
      });
    } else {
      console.warn(
        "OpenAI API key is not configured. OpenAI features may not work."
      );
    }
  }

  async generateContent(prompt, chatHistory = [], options = {}) {
    if (!this.apiKey) {
      throw new Error("OpenAI API key not configured.");
    }
    const messages = this._formatChatHistoryForOpenAI(
      prompt,
      chatHistory,
      options.coachPersonality
    );
    const response = await this.openai.chat.completions.create({
      model: options.model || "gpt-3.5-turbo",
      messages: messages,
      temperature: options.temperature || 0.9,
      max_tokens: options.maxOutputTokens || 150,
      top_p: options.topP || 0.85,
    });
    return response.choices[0].message.content;
  }

  async streamContent(prompt, onChunk, chatHistory = [], options = {}) {
    if (!this.apiKey) {
      throw new Error("OpenAI API key not configured.");
    }
    const messages = this._formatChatHistoryForOpenAI(
      prompt,
      chatHistory,
      options.coachPersonality
    );
    const stream = await this.openai.chat.completions.create({
      model: options.model || "gpt-3.5-turbo",
      messages: messages,
      temperature: options.temperature || 0.9,
      max_tokens: options.maxOutputTokens || 150,
      top_p: options.topP || 0.85,
      stream: true,
    });

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content || "";
      if (text) {
        onChunk(text);
      }
    }
  }

  _formatChatHistoryForOpenAI(currentPrompt, chatHistory, coachPersonality) {
    const messages = [];

    const personalityPrompts = {
      encouraging:
        "You're Coach Elena, a super upbeat chess coach! Talk like a friendly mentor, keep it short and lively, and pump up the student's confidence. Use casual language, like you're chatting with a friend.",
      analytical:
        "You're Master Viktor, a sharp chess coach who loves breaking things down. Keep it clear, concise, and nerd out a bit on tactics, but sound like you're explaining it over coffee.",
      patient:
        "You're Coach Sarah, a calm and kind chess coach. Explain things simply, step by step, like you're guiding a friend with patience and a smile.",
      challenging:
        "You're Grandmaster Alex, a bold chess coach who pushes hard! Be direct, call out mistakes constructively, and motivate like a tough but fair mentor.",
    };
    const systemPrompt =
      personalityPrompts[coachPersonality] || personalityPrompts.encouraging;
    messages.push({
      role: "system",
      content:
        systemPrompt +
        " Keep your response short, conversational, and under 50 words. Avoid long paragraphs. Sound human and engaging for text-to-speech.",
    });

    chatHistory.forEach((msg) => {
      if (msg.sender === "user") {
        messages.push({ role: "user", content: msg.content });
      } else if (msg.sender === "coach") {
        messages.push({ role: "assistant", content: msg.content });
      }
    });

    messages.push({ role: "user", content: currentPrompt });
    return messages;
  }
}

// OpenRouter Strategy
export class OpenRouterStrategy extends AIGeneratorStrategy {
  constructor(apiKey) {
    super(apiKey);
    if (this.apiKey) {
      this.openai = new OpenAI({
        apiKey: this.apiKey,
        baseURL: "https://openrouter.ai/api/v1",
        dangerouslyAllowBrowser: true,
      });
    } else {
      console.warn(
        "OpenRouter API key is not configured. OpenRouter features may not work."
      );
    }
  }

  async generateContent(prompt, chatHistory = [], options = {}) {
    if (!this.apiKey) {
      throw new Error("OpenRouter API key not configured.");
    }
    const messages = this._formatChatHistoryForOpenAI(
      prompt,
      chatHistory,
      options.coachPersonality
    );
    const response = await this.openai.chat.completions.create({
      model: options.model || "openai/gpt-3.5-turbo", // Default OpenRouter model
      messages: messages,
      temperature: options.temperature || 0.9,
      max_tokens: options.maxOutputTokens || 150,
      top_p: options.topP || 0.85,
    });
    return response.choices[0].message.content;
  }

  async streamContent(prompt, onChunk, chatHistory = [], options = {}) {
    if (!this.apiKey) {
      throw new Error("OpenRouter API key not configured.");
    }
    const messages = this._formatChatHistoryForOpenAI(
      prompt,
      chatHistory,
      options.coachPersonality
    );
    const stream = await this.openai.chat.completions.create({
      model: options.model || "openai/gpt-3.5-turbo", // Default OpenRouter model
      messages: messages,
      temperature: options.temperature || 0.9,
      max_tokens: options.maxOutputTokens || 150,
      top_p: options.topP || 0.85,
      stream: true,
    });

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content || "";
      if (text) {
        onChunk(text);
      }
    }
  }

  _formatChatHistoryForOpenAI(currentPrompt, chatHistory, coachPersonality) {
    const messages = [];

    const personalityPrompts = {
      encouraging:
        "You're Coach Elena, a super upbeat chess coach! Talk like a friendly mentor, keep it short and lively, and pump up the student's confidence. Use casual language, like you're chatting with a friend.",
      analytical:
        "You're Master Viktor, a sharp chess coach who loves breaking things down. Keep it clear, concise, and nerd out a bit on tactics, but sound like you're explaining it over coffee.",
      patient:
        "You're Coach Sarah, a calm and kind chess coach. Explain things simply, step by step, like you're guiding a friend with patience and a smile.",
      challenging:
        "You're Grandmaster Alex, a bold chess coach who pushes hard! Be direct, call out mistakes constructively, and motivate like a tough but fair mentor.",
    };
    const systemPrompt =
      personalityPrompts[coachPersonality] || personalityPrompts.encouraging;
    messages.push({
      role: "system",
      content:
        systemPrompt +
        " Keep your response short, conversational, and under 50 words. Avoid long paragraphs. Sound human and engaging for text-to-speech.",
    });

    chatHistory.forEach((msg) => {
      if (msg.sender === "user") {
        messages.push({ role: "user", content: msg.content });
      } else if (msg.sender === "coach") {
        messages.push({ role: "assistant", content: msg.content });
      }
    });

    messages.push({ role: "user", content: currentPrompt });
    return messages;
  }
}
