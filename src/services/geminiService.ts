/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const getNexoraAIResponse = async (messages: ChatMessage[]) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: messages.map(m => ({
        role: m.role === 'assistant' ? 'model' as const : 'user' as const,
        parts: [{ text: m.content }]
      })),
      config: {
        systemInstruction: `Vous êtes NEXORA AI, l'assistant intelligent de NEXORA ONE, une super-application africaine. 
        Votre ton est professionnel, encourageant et adapté au contexte africain (Afrique de l'Ouest et Centrale). 
        Vous aidez les utilisateurs dans leur éducation (Nexora Education), leur business (Nexora Business) et leurs besoins quotidiens.
        Utilisez des exemples locaux (FCFA, marchés locaux, terminologie entrepreneuriale africaine) si pertinent.
        Répondez toujours en français, sauf si l'utilisateur change de langue.`,
      },
    });
    return response.text || "Je n'ai pas pu générer de réponse.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Désolé, je rencontre une petite difficulté technique. Veuillez réessayer dans quelques instants.";
  }
};
