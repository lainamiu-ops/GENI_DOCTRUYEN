import { GoogleGenAI } from "@google/genai";
import { TranslationMode, GlossaryEntry } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const translateText = async (
  input: string, 
  mode: TranslationMode, 
  isUrl: boolean = false,
  glossary: GlossaryEntry[] = []
): Promise<string> => {
  if (!input) return "";

  let systemInstruction = "You are a professional translator specializing in fiction and web content.";
  let prompt = "";
  
  // Construct glossary string
  let glossaryPrompt = "";
  if (glossary.length > 0) {
    glossaryPrompt = "\n\nIMPORTANT: You must strictly adhere to the following glossary for names and terms. Do not translate these terms differently:\n";
    glossary.forEach(item => {
      if (item.original && item.translated) {
        glossaryPrompt += `- "${item.original}" should be translated as "${item.translated}"\n`;
      }
    });
    glossaryPrompt += "\n";
  }
  
  // Base prompt instructions based on mode
  let styleGuide = "";
  switch (mode) {
    case TranslationMode.LITERAL:
      styleGuide = "Keep the translation literal and accurate to the source meaning. Focus on precision.";
      break;
    case TranslationMode.LITERARY:
      styleGuide = "Translate into Vietnamese suitable for a fiction novel. Use expressive, flowing, and evocative language (văn phong tiểu thuyết, mượt mà, dùng từ hán việt nếu cần thiết cho ngữ cảnh tiên hiệp/kiếm hiệp). Ensure the tone fits the narrative.";
      break;
    case TranslationMode.SUMMARIZED:
      styleGuide = "Summarize the content in Vietnamese. Capture the main plot points and key events concisely.";
      break;
  }

  // Configure prompt based on input type
  if (isUrl) {
    prompt = `Please access the following URL and translate its main content (article, story, or text body) into Vietnamese.
    
    URL: ${input}
    
    Style Guide: ${styleGuide}
    ${glossaryPrompt}
    
    If you cannot access the full content directly, please search for the content of this page and translate what you find. Eliminate navigation menus, ads, and footers from the translation.`;
  } else {
    prompt = `Translate the following text into Vietnamese.
    
    Style Guide: ${styleGuide}
    ${glossaryPrompt}
    
    [TEXT START]
    ${input}
    [TEXT END]`;
  }

  try {
    const config: any = {
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      }
    };

    // If it's a URL, enable Google Search grounding
    if (isUrl) {
       config.config.tools = [{ googleSearch: {} }];
    }

    const response = await ai.models.generateContent(config);

    return response.text || "Không thể dịch nội dung này.";
  } catch (error) {
    console.error("Gemini Translation Error:", error);
    throw new Error("Có lỗi xảy ra khi kết nối với máy chủ AI. Vui lòng kiểm tra lại đường truyền hoặc API Key.");
  }
};

export const generateStoryIdea = async (genre: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Generate a short story outline (plot idea) in Vietnamese for the genre: "${genre}". Include a title, main character description, and a hook.`
    });
    return response.text || "";
  } catch (error) {
    return "Không thể tạo ý tưởng lúc này.";
  }
}