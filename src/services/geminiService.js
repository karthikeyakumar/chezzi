import aiService from "./aiService";

/**
 * Generates a conversational text response for chess coaching.
 * @param {string} prompt - The user's input prompt.
 * @param {string} coachPersonality - The coaching personality type.
 * @param {Array} chatHistory - Previous conversation history for context.
 * @returns {Promise<string>} The generated coaching response.
 */
export async function generateCoachResponse(
  prompt,
  coachPersonality = "encouraging",
  chatHistory = []
) {
  try {
    const response = await aiService.generateContent(prompt, chatHistory, {
      coachPersonality,
    });
    console.log("Generated response:", response);
    return response;
  } catch (error) {
    console.error("Error in coach response generation:", error);
    // Conversational fallback responses
    if (error.message?.includes("API key")) {
      return "Oops, my coaching system's down! Check the API setup and try again.";
    } else if (
      error.message?.includes("quota") ||
      error.message?.includes("rate limit")
    ) {
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
 * @param {boolean} isVoiceEnabled - Whether voice playback is enabled.
 * @param {Function} handleVoicePlay - Callback to play voice.
 */
export async function streamCoachResponse(
  prompt,
  coachPersonality = "encouraging",
  chatHistory = [],
  onChunk,
  isVoiceEnabled,
  handleVoicePlay
) {
  try {
    await aiService.streamContent(
      prompt,
      (chunk) => {
        onChunk(chunk);
        if (isVoiceEnabled && handleVoicePlay) {
          handleVoicePlay(chunk);
        }
      },
      chatHistory,
      { coachPersonality }
    );
  } catch (error) {
    console.error("Error in streaming coach response:", error);
    onChunk("Whoops, something's up! Try again in a moment.");
  }
}

/**
 * Generates a short, conversational chess coaching tip.
 * @param {string} gameContext - Current game state or move context.
 * @param {string} playerLevel - Player's skill level (beginner, intermediate, advanced).
 * @returns {Promise<string>} Generated coaching tip.
 */
export async function generateCoachingTip(
  gameContext,
  playerLevel = "intermediate"
) {
  try {
    const prompt = `You're a chess coach for a ${playerLevel} player. Based on this game context: ${gameContext}, give a short, conversational tip (under 40 words). Sound like a friend giving quick, actionable advice. Avoid lists or formal formatting.`;
    const response = await aiService.generateContent(
      prompt,
      [], // No chat history needed for a single tip
      { model: "gemini-1.5-flash" } // Can specify model if needed for tips
    );
    return response;
  } catch (error) {
    console.error("Error generating coaching tip:", error);
    return "Hey, try controlling the center with your pawns! It opens up your game.";
  }
}

/**
 * Generates a chess move for the AI coach.
 * @param {string} fen - The current FEN string of the chessboard.
 * @param {string} coachPersonality - The coaching personality type.
 * @returns {Promise<string>} The generated chess move in SAN format.
 */
export async function generateAIMove(pgn, coachPersonality = "encouraging") {
  // Early fallback if PGN is missing or empty
  if (!pgn.trim()) {
    console.warn("PGN is empty — returning default move: e4.");
    return "e4";
  }

  const prompt = `You are a strict chess move generator.

Given this PGN:
${pgn}

Return ONLY a JSON object with a single "move" field containing the best next move in Standard Algebraic Notation (SAN), like {"move": "e4"}.

⚠️ DO NOT include any commentary, encouragement, greetings, or extra text. Do NOT prefix or suffix with anything. This will be parsed directly. Example response: {"move": "Nf3"}

If no legal move exists, respond with: {"move": "none"}
`;

  try {
    const response = await aiService.generateContent(prompt, [], {
      maxOutputTokens: 20,
      temperature: 0.1, // makes output more deterministic
    });

    const trimmed = typeof response === "string" ? response.trim() : "";
    const jsonMatch = trimmed.match(/\{[^}]+\}/);

    if (!jsonMatch) {
      throw new Error(`No valid JSON object found in response: "${trimmed}"`);
    }

    const json = JSON.parse(jsonMatch[0]);
    const move = json?.move;

    if (!move || typeof move !== "string") {
      throw new Error(`Missing or invalid "move" field in response: ${JSON.stringify(json)}`);
    }

    if (move === "none") {
      throw new Error("No legal move available for this position");
    }

    // Validate SAN (standard algebraic notation) using simple regex
    const sanRegex = /^(O-O(-O)?|[NBKRQ]?[a-h]?[1-8]?x?[a-h][1-8](=[NBRQ])?[+#]?)$/;
    if (!sanRegex.test(move)) {
      throw new Error(`Invalid SAN move format: "${move}"`);
    }

    console.log("Generated move:", move);
    return move;
  } catch (error) {
    console.error("Error generating AI move:", error.message);
    return null;
  }
}


