import { GoogleGenAI, Type } from "@google/genai";
import { MessageType } from "../types";
import { MODERATORS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Schema for structured output
const gameContentSchema = {
  type: Type.OBJECT,
  properties: {
    chatMessages: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          username: { type: Type.STRING },
          content: { type: Type.STRING },
          type: { type: Type.STRING, enum: Object.values(MessageType) },
          isMod: { type: Type.BOOLEAN }
        }
      }
    },
    discordAlerts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          user: { type: Type.STRING },
          channel: { type: Type.STRING },
          issue: { type: Type.STRING },
          severity: { type: Type.STRING, enum: ["LOW", "MEDIUM", "HIGH"] }
        }
      }
    },
    socialPosts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          username: { type: Type.STRING },
          handle: { type: Type.STRING },
          content: { type: Type.STRING },
          isNegative: { type: Type.BOOLEAN }
        }
      }
    }
  },
  required: ["chatMessages", "discordAlerts", "socialPosts"]
};

export const fetchGameContent = async (currentHype: number) => {
  const modNames = MODERATORS.join(", ");
  
  const prompt = `
    Gere conteúdo para um jogo de simulação de moderador da live do streamer LGGJ.
    Contexto: A live está acontecendo agora. Hype atual: ${currentHype}/100.
    
    Moderadores conhecidos: ${modNames}.
    
    Gere:
    1. 8 Mensagens de Chat: Misture fãs normais, haters (spam/ataques), perguntas bobas, e mensagens dos moderadores conhecidos (use os nomes da lista para eles). Mensagens devem ser curtas, gírias de internet, pt-BR.
    2. 2 Alertas do Discord: Usuários causando problemas nos canais de voz ou texto.
    3. 2 Posts de Redes Sociais (estilo Twitter/X): Opiniões sobre a live, clipes, ou polêmicas inventadas.

    Seja criativo e caótico. Use emojis.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: gameContentSchema,
        temperature: 0.8
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};
