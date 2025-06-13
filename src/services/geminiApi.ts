
interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export class GeminiApiService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async analyzeScreenWithQuestion(imageBase64: string, question: string): Promise<string> {
    // Updated to use the correct gemini-1.5-flash model endpoint
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
    
    const requestBody = {
      contents: [
        {
          parts: [
            { text: question },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: imageBase64
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      const data: GeminiResponse = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response generated');
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }

  static getStoredApiKey(): string | null {
    try {
      const encoded = localStorage.getItem('gemini_api_key');
      return encoded ? atob(encoded) : null;
    } catch {
      return null;
    }
  }

  static clearStoredApiKey(): void {
    localStorage.removeItem('gemini_api_key');
  }

  static setApiKey(apiKey: string): void {
    const encodedKey = btoa(apiKey);
    localStorage.setItem('gemini_api_key', encodedKey);
  }
}
