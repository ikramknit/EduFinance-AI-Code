import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, Student, FinancialReport } from "../types";

const processEnvApiKey = process.env.API_KEY;

export const analyzeFinances = async (
  transactions: Transaction[],
  students: Student[]
): Promise<FinancialReport | null> => {
  if (!processEnvApiKey) {
    console.error("API Key not found");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey: processEnvApiKey });

  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingFees = students.reduce((sum, s) => sum + (s.totalFees - s.paidFees), 0);

  const summaryData = {
    totalIncome,
    totalExpense,
    pendingFees,
    transactionCount: transactions.length,
    studentCount: students.length,
    recentTransactions: transactions.slice(-5),
    topDebtors: students.sort((a, b) => (b.totalFees - b.paidFees) - (a.totalFees - a.paidFees)).slice(0, 3)
  };

  const prompt = `
    Act as a financial analyst for an educational institute.
    Analyze the following financial snapshot JSON:
    ${JSON.stringify(summaryData)}

    Provide a structured report including a health score (0-100), a concise summary, key insights (trends, warnings), and a specific recommendation.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            healthScore: { type: Type.NUMBER, description: "A score from 0 to 100 indicating financial health" },
            summary: { type: Type.STRING, description: "A brief paragraph summarizing the financial situation" },
            keyInsights: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3-4 bullet points of specific observations"
            },
            recommendation: { type: Type.STRING, description: "One strong, actionable recommendation" }
          },
          required: ["healthScore", "summary", "keyInsights", "recommendation"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;

    return JSON.parse(text) as FinancialReport;
  } catch (error) {
    console.error("Error generating AI report:", error);
    return null;
  }
};