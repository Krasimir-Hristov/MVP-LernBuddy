import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash-exp',
}); // Using 2.0 Flash as the latest/fastest stable for MVP
