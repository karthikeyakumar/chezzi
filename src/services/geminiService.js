import genAI from './geminiClient';

/**
 * Generates a text response based on user input for chess coaching.
 * @param {string} prompt - The user's input prompt.
 * @param {string} coachPersonality - The coaching personality type.
 * @param {Array} chatHistory - Previous conversation history for context.
 * @returns {Promise<string>} The generated coaching response.
 */
export async function generateCoachResponse(prompt, coachPersonality = 'encouraging', chatHistory = []) {
  try {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your environment variables.');
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        maxOutputTokens: 1024,
      }
    });

    // Create personality-based system prompt
    const personalityPrompts = {
      encouraging: "You are Coach Elena, an encouraging and supportive chess coach. Be positive, motivating, and focus on building confidence while providing helpful chess guidance. Use encouraging language and celebrate progress.",
      analytical: "You are Master Viktor, an analytical and detailed chess coach. Provide thorough analysis, detailed explanations, and precise tactical insights. Focus on the technical aspects of chess.",
      patient: "You are Coach Sarah, a patient and methodical chess coach. Take time to explain concepts step by step, be understanding of mistakes, and provide clear, easy-to-follow guidance.",
      challenging: "You are Grandmaster Alex, a challenging and direct chess coach. Push for excellence, point out weaknesses constructively, and set high standards while remaining helpful."
    };

    const systemPrompt = personalityPrompts[coachPersonality] || personalityPrompts.encouraging;
    
    // Build conversation context
    let contextualPrompt = `${systemPrompt}\n\nCurrent chess coaching conversation:\n`;
    
    // Add recent chat history for context (last 6 messages)
    const recentHistory = chatHistory.slice(-6);
    recentHistory.forEach(msg => {
      const role = msg.sender === 'user' ? 'Student' : 'Coach';
      contextualPrompt += `${role}: ${msg.content}\n`;
    });
    
    contextualPrompt += `Student: ${prompt}\nCoach:`;

    const result = await model.generateContent(contextualPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in Gemini coach response generation:', error);
    
    // Provide fallback responses based on error type
    if (error.message?.includes('API key')) {
      return "I'm having trouble connecting to my coaching system. Please check the API configuration and try again.";
    } else if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      return "I need a moment to process your request. Please try again in a few seconds.";
    } else {
      return "I apologize, but I'm having difficulty responding right now. Let me try to help you with a general chess tip: Always look for ways to improve your piece activity and control key squares.";
    }
  }
}

/**
 * Streams a coaching response chunk by chunk for real-time display.
 * @param {string} prompt - The user's input prompt.
 * @param {string} coachPersonality - The coaching personality type.
 * @param {Array} chatHistory - Previous conversation history for context.
 * @param {Function} onChunk - Callback to handle each streamed chunk.
 */
export async function streamCoachResponse(prompt, coachPersonality = 'encouraging', chatHistory = [], onChunk) {
  try {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        maxOutputTokens: 1024,
      }
    });

    const personalityPrompts = {
      encouraging: "You are Coach Elena, an encouraging and supportive chess coach. Be positive, motivating, and focus on building confidence while providing helpful chess guidance.",
      analytical: "You are Master Viktor, an analytical and detailed chess coach. Provide thorough analysis, detailed explanations, and precise tactical insights.",
      patient: "You are Coach Sarah, a patient and methodical chess coach. Take time to explain concepts step by step, be understanding of mistakes.",
      challenging: "You are Grandmaster Alex, a challenging and direct chess coach. Push for excellence, point out weaknesses constructively, and set high standards."
    };

    const systemPrompt = personalityPrompts[coachPersonality] || personalityPrompts.encouraging;
    
    let contextualPrompt = `${systemPrompt}\n\nCurrent chess coaching conversation:\n`;
    
    const recentHistory = chatHistory.slice(-6);
    recentHistory.forEach(msg => {
      const role = msg.sender === 'user' ? 'Student' : 'Coach';
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
  } catch (error) {
    console.error('Error in streaming Gemini coach response:', error);
    onChunk("I'm having difficulty responding right now. Please try again.");
  }
}

/**
 * Generates chess coaching tips based on game analysis.
 * @param {string} gameContext - Current game state or move context.
 * @param {string} playerLevel - Player's skill level (beginner, intermediate, advanced).
 * @returns {Promise<string>} Generated coaching tip.
 */
export async function generateCoachingTip(gameContext, playerLevel = 'intermediate') {
  try {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 200,
      }
    });

    const prompt = `As a chess coach, provide a concise coaching tip for a ${playerLevel} player based on this game context: ${gameContext}. 
    
    Format your response as:
    💡 **Coaching Tip**: [Brief, actionable advice]
    ✓ [Key point 1]
    ✓ [Key point 2]
    
    Keep it under 150 words and focus on practical improvement.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating coaching tip:', error);
    return "💡 **Coaching Tip**: Focus on controlling the center squares with your pawns and pieces. This gives you more mobility and attacking chances!\n✓ Control central squares\n✓ Develop pieces toward the center";
  }
}