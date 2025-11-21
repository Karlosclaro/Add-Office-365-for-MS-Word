import { GoogleGenAI, Type, Schema } from "@google/genai";
import { TableData } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const tableSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A short, descriptive title for the table.",
    },
    headers: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "The column headers for the table.",
    },
    rows: {
      type: Type.ARRAY,
      items: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
      description: "The data rows. Each row must have the same number of items as headers.",
    },
    summary: {
      type: Type.STRING,
      description: "A brief summary or insight about the data generated.",
    },
  },
  required: ["title", "headers", "rows"],
};

export const generateTableFromPrompt = async (userPrompt: string): Promise<TableData> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Create a detailed data table based on this request: "${userPrompt}". 
      Ensure the data is realistic and formatted correctly. 
      If specific numbers aren't provided, generate realistic estimates.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: tableSchema,
        systemInstruction: "You are a data expert assistant for Microsoft Word. Your goal is to generate structured table data for the user to insert into documents.",
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No data received from Gemini.");
    }

    const data = JSON.parse(text) as TableData;
    return data;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate table. Please check your prompt and try again.");
  }
};
