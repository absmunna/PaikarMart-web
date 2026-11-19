import { GoogleGenAI } from '@google/genai';
import { backendEnv } from '../../config/env.js';

// Server-side initialized GoogleGenAI instance
export const ai = new GoogleGenAI({
  apiKey: backendEnv.geminiApiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});
