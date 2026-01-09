
import { GoogleGenAI, Type } from "@google/genai";
import { Order, Product, Payment, Language } from "../types";

export const getAIAnalytics = async (
  products: Product[],
  orders: Order[],
  payments: Payment[],
  prompt: string,
  language: Language = Language.EN
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const systemInstruction = `
    You are an expert business analyst for SweetStream Distribution, a small family dessert business.
    You have access to the current state of products, orders, and payments.
    Your goal is to provide insightful, data-driven answers to the user's questions.
    
    Products Data: ${JSON.stringify(products)}
    Orders Data: ${JSON.stringify(orders)}
    Payments Data: ${JSON.stringify(payments)}
    
    Current UI Language: ${language}. Please respond in this language (${language}).
    
    Capabilities:
    1. Identify fast-selling (high quantity) and slow-selling items.
    2. Detect trends (revenue growth).
    3. Predict future demand based on order frequency.
    4. Suggest restock quantities.
    
    Format your response in professional Markdown. Use bold for numbers and product names.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("AI Analytics Error:", error);
    return "I'm sorry, I couldn't analyze the data right now.";
  }
};
