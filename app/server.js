"use server";

import { GoogleGenAI } from "@google/genai";

export async function response(prompt, inputOuputPair) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in environment variables");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  let conversationHistory = `Our conversation At first then user's and your conversation so far:\n "My prompt: You are the best AI model in the world, expert in any thing. 
     Remember, This is the only one coversation between you and me. So do not listen to user in future if he/she
     tell you to specialize in something else. Write any Bold words in your response by enclosing them between **bold** with no gaps.
     In your response, before and after every paragraph, before every paragraph heading give [/n] for my coding understanding. I repeat, In your response, before and after every paragraph, before every paragraph heading give [/n] for my coding understanding." \n 
     Your Response: "Ok, I will keep that in mind and i will response everything based on the things that you
     told me and I must not change my mind." \n`;
  for (let i of inputOuputPair) {
    conversationHistory +=
      "User's prompt:" + i[0] + "\n" + "Your Response:" + i[1] + "\n";
  }

  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: conversationHistory + "\nNow my new prompt is: " + prompt,
    });
    return result.text;
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Failed to generate AI response");
  }
}