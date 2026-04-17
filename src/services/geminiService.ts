import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function* generateTestCasesStream(code: string) {
  if (!code.trim()) return;

  try {
    const stream = await ai.models.generateContentStream({
      model: "gemini-3-flash-preview",
      contents: [
        {
          text: `Generate comprehensive unit test cases for the following code. 
          Use Vitest/Jest or React Testing Library.
          Output ONLY the markdown test suite. Skip explanations.
          
          CODE:
          ${code}`
        }
      ],
      config: {
        systemInstruction: "You are an expert software engineer. You write high-quality, robust unit tests. You provide output instantly and concisely, focusing purely on the test code in Markdown.",
        temperature: 0.1,
      }
    });

    for await (const chunk of stream) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error) {
    console.error("Error generating test cases:", error);
    yield "An error occurred while generating test cases.";
  }
}
