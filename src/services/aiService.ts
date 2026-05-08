/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const aiService = {
  getLearningPathAdvice: async (userName: string, xp: number, level: number) => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `L'étudiant ${userName} a ${xp} XP et est au niveau ${level}. Suggère-lui un parcours d'apprentissage parmi ces domaines : Programmation Python, Design UI/UX (Figma), Anglais (SpeakFlow) ou IA. Sois motivant et donne une recommandation précise en 2 phrases max.`,
        config: {
          systemInstruction: "Tu es un conseiller expert chez Nexora. Ton but est de recommander des cours spécifiques parmi nos domaines phares : SpeakFlow, Design, Dev et IA."
        }
      });
      return response.text;
    } catch (error) {
      console.error("AI Recommendation Error:", error);
      return "Continuez à apprendre pour débloquer votre plein potentiel !";
    }
  },

  getCourseSummary: async (courseTitle: string, description: string) => {
     try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Cours: ${courseTitle}. Description: ${description}`,
        config: {
          systemInstruction: "Résume ce cours de manière attractive pour un étudiant africain en une phrase."
        }
      });
      return response.text;
    } catch (error) {
      return description;
    }
  }
};
