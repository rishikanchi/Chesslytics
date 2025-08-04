import axios from "axios";
import 'react-native-url-polyfill/auto';

interface AnalysisRequest {
  pgn: string;
  currentMove: string; 
  category: string;
  line: string;
}

interface CerebrasResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function makeRequestWithRetry(prompt: string, retries = 3, baseDelay = 1000): Promise<CerebrasResponse> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.post<CerebrasResponse>(
        "https://api.cerebras.ai/v1/chat/completions",
        {
          model: "llama3.1-8b",
          messages: [
            {
              role: "user",
              content: prompt
            }
          ],
          max_completion_tokens: 20,
          temperature: 0.7
        },
        {
          headers: {
            "Authorization": `Bearer ${process.env.EXPO_PUBLIC_CEREBRAS_API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 429 && i < retries - 1) {
        const waitTime = baseDelay * Math.pow(2, i); // Exponential backoff
        console.log(`Rate limited. Retrying in ${waitTime}ms...`);
        await delay(waitTime);
        continue;
      }
      throw error;
    }
  }
  throw new Error("Max retries reached");
}

export async function getAIAnalysis({pgn, currentMove, category, line}: AnalysisRequest): Promise<string> {
  try {
    console.log("process.env.EXPO_PUBLIC_CEREBRAS_API_KEY", process.env.EXPO_PUBLIC_CEREBRAS_API_KEY);
    const prompt = `As a chess master, explain in 5 words or less why this line "${line}" is good after the ${category} move "${currentMove}" in this game: ${pgn}`;
    console.log("prompt", prompt);

    const response = await makeRequestWithRetry(prompt);

    // Extract and clean up the response text
    const explanation = response.choices[0].message.content.trim();
    
    // Ensure response is 5 words or less
    const words = explanation.split(" ");
    if (words.length > 5) {
      return words.slice(0, 5).join(" ");
    }

    return explanation;

  } catch (error) {
    console.log("Error getting AI analysis:", error);
    return "Analysis unavailable at this time";
  }
}
