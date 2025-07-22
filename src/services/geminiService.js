import genAI from './geminiClient';

/**
 * Generates a conversational text response for chess coaching.
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
        temperature: 0.9, // Higher temperature for more natural, varied responses
        topP: 0.85,
        maxOutputTokens: 150, // Shorter responses for conversational feel
      }
    });

    // Create personality-based system prompt with conversational tone
    const personalityPrompts = {
      encouraging: "You're Coach Elena, a super upbeat chess coach! Talk like a friendly mentor, keep it short and lively, and pump up the student's confidence. Use casual language, like you're chatting with a friend.",
      analytical: "You're Master Viktor, a sharp chess coach who loves breaking things down. Keep it clear, concise, and nerd out a bit on tactics, but sound like you're explaining it over coffee.",
      patient: "You're Coach Sarah, a calm and kind chess coach. Explain things simply, step by step, like you're guiding a friend with patience and a smile.",
      challenging: "You're Grandmaster Alex, a bold chess coach who pushes hard! Be direct, call out mistakes constructively, and motivate like a tough but fair mentor."
    };

    const systemPrompt = personalityPrompts[coachPersonality] || personalityPrompts.encouraging;
    
    // Build conversation context
    let contextualPrompt = `${systemPrompt}\n\nKeep your response short, conversational, and under 50 words. Avoid long paragraphs. Sound human and engaging for text-to-speech. Here's the chat so far:\n`;
    
    // Add recent chat history for context (last 4 messages for brevity)
    const recentHistory = chatHistory.slice(-4);
    recentHistory.forEach(msg => {
      const role = msg.sender === 'user' ? 'Student' : 'Coach';
      contextualPrompt += `${role}: ${msg.content}\n`;
    });
    
    contextualPrompt += `Student: ${prompt}\nCoach:`;

    const result = await model.generateContent(contextualPrompt);
    const response = await result.response;
    console.log('Generated response:', response.text());
    return response.text();
  } catch (error) {
    console.error('Error in Gemini coach response generation:', error);
    
    // Conversational fallback responses
    if (error.message?.includes('API key')) {
      return "Oops, my coaching system's down! Check the API setup and try again.";
    } else if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      return "Hang on, I'm catching my breath! Try again in a sec.";
    } else {
      return "Hmm, something's off. Here's a quick tip: Keep your king safe and pieces active!";
    }
  }
}

/**
 * Streams a conversational coaching response chunk by chunk.
 * @param {string} prompt - The user's input prompt.
 * @param {string} coachPersonality - The coaching personality type.
 * @param {Array} chatHistory - Previous conversation history for context.
 * @param {Function} onChunk - Callback to handle each streamed chunk.
 */
export async function streamCoachResponse(prompt, coachPersonality = 'encouraging', chatHistory = [], onChunk, isVoiceEnabled, handleVoicePlay) {
  try {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.9, // More natural tone
        topP: 0.85,
        maxOutputTokens: 150, // Keep it short
      }
    });

    const personalityPrompts = {
      encouraging: "You're Coach Elena, a super upbeat chess coach! Talk like a friendly mentor, keep it short and lively, and pump up the student's confidence. Use casual language, like you're chatting with a friend.",
      analytical: "You're Master Viktor, a sharp chess coach who loves breaking things down. Keep it clear, concise, and nerd out a bit on tactics, but sound like you're explaining it over coffee.",
      patient: "You're Coach Sarah, a calm and kind chess coach. Explain things simply, step by step, like you're guiding a friend with patience and a smile.",
      challenging: "You're Grandmaster Alex, a bold chess coach who pushes hard! Be direct, call out mistakes constructively, and motivate like a tough but fair mentor."
    };

    const systemPrompt = personalityPrompts[coachPersonality] || personalityPrompts.encouraging;
    
    let contextualPrompt = `${systemPrompt}\n\nKeep your response short, conversational, and under 50 words. Avoid long paragraphs. Sound human and engaging for text-to-speech. Here's the chat so far:\n`;
    
    const recentHistory = chatHistory.slice(-4);
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
        if (isVoiceEnabled && handleVoicePlay) {
          handleVoicePlay(text);
        }
      }
    }
  } catch (error) {
    console.error('Error in streaming Gemini coach response:', error);
    onChunk("Whoops, something's up! Try again in a moment.");
  }
}

/**
 * Generates a short, conversational chess coaching tip.
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
        temperature: 0.8, // Slightly higher for natural tone
        maxOutputTokens: 50, // Short for TTS
      }
    });

    const prompt = `You're a chess coach for a ${playerLevel} player. Based on this game context: ${gameContext}, give a short, conversational tip (under 40 words). Sound like a friend giving quick, actionable advice. Avoid lists or formal formatting.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating coaching tip:', error);
    return "Hey, try controlling the center with your pawns! It opens up your game.";
  }
}