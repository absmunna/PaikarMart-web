import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

export class GeminiService {
  static async verifyProductWithSearch(query: string) {
    const ai = getAI();

    try {
      const interaction = await ai.interactions.create({
        model: "gemini-3.5-flash",
        system_instruction: "You are a market analyst for Paikar Mart. Verify the provided product details or wholesale pricing by fetching real-time market data from the web. Provide a concise summary and comparison.",
        tools: [{ type: 'google_search' }],
        input: query
      });

      // Combine text from all model_output steps
      let fullOutput = "";
      let sources: any[] = [];

      for (const step of interaction.steps) {
        if (step.type === 'model_output') {
          const textContent = step.content?.find(c => c.type === 'text');
          if (textContent && textContent.text) {
            fullOutput += textContent.text;
          }
        }
        if (step.type === 'google_search_result') {
           // Grounding sources extraction logic if needed
        }
      }

      return {
        text: fullOutput || interaction.output_text,
        sources
      };
    } catch (error) {
      console.error("[Gemini Service Search] Error:", error);
      throw error;
    }
  }

  static async generateChatResponse(messages: { role: string, content: string }[], systemInstruction?: string) {
    const ai = getAI();

    try {
      // In Interactions API, we can use previous_interaction_id or just send the prompt.
      // For a simple chat, we'll just send the last message but provide history if possible.
      const lastMessage = messages[messages.length - 1];
      
      const interaction = await ai.interactions.create({
        model: "gemini-3.5-flash",
        system_instruction: systemInstruction || "You are a helpful assistant for Paikar Mart, a social commerce super app in Bangladesh. Help users with product questions, order tracking, and business advice.",
        input: lastMessage.content
      });

      return interaction.output_text;
    } catch (error) {
      console.error("[Gemini Service] Error:", error);
      throw error;
    }
  }

  /**
   * Generates a streaming chat response
   */
  static async generateStreamingChatResponse(
    messages: { role: string, content: string }[], 
    systemInstruction?: string,
    tools?: any[]
  ) {
    const ai = getAI();

    const lastMessage = messages[messages.length - 1];

    return await ai.interactions.create({
      model: "gemini-3.5-flash",
      system_instruction: systemInstruction || "You are a helpful assistant for Paikar Mart in Bangladesh.",
      input: lastMessage.content,
      tools: tools,
      stream: true
    });
  }
}
