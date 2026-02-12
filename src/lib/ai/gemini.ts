import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
}); // Using gemini-2.5-flash as the latest/fastest stable for MVP
