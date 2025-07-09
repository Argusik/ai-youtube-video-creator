
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import type { ScriptResponse, ShortsResponse, Scene } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SCRIPT_GENERATION_MODEL = 'gemini-2.5-flash';
const IMAGE_GENERATION_MODEL = 'imagen-3.0-generate-002';

const scriptSchema = {
  type: Type.OBJECT,
  properties: {
    titles: {
      type: Type.ARRAY,
      description: "Generate 3 catchy, SEO-friendly YouTube titles for a video about the user's topic. Titles should be engaging and create curiosity.",
      items: { type: Type.STRING },
    },
    script: {
      type: Type.ARRAY,
      description: "A detailed video script. Break the video down into logical scenes (e.g., Intro, Part 1, Part 2, Conclusion).",
      items: {
        type: Type.OBJECT,
        properties: {
          scene: {
            type: Type.STRING,
            description: "A short, descriptive title for the scene (e.g., 'Introduction', 'The Core Problem').",
          },
          narration: {
            type: Type.STRING,
            description: "The complete narration text to be spoken by the host during this scene.",
          },
          visual_prompt: {
            type: Type.STRING,
            description: "A detailed, cinematic visual prompt for an AI image generator to create a background image for this scene. Describe the style, lighting, and subject matter for a 16:9 aspect ratio. For example: 'cinematic shot, epic fantasy landscape with a lone knight overlooking a valley, golden hour lighting, hyperrealistic'.",
          },
        },
        required: ["scene", "narration", "visual_prompt"],
      },
    },
  },
  required: ["titles", "script"],
};

const shortsSchema = {
    type: Type.OBJECT,
    properties: {
        shorts: {
            type: Type.ARRAY,
            description: "A list of 3-5 short-form video ideas based on the provided script.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: {
                        type: Type.STRING,
                        description: "A catchy, short title for the vertical video."
                    },
                    narration: {
                        type: Type.STRING,
                        description: "A concise and punchy narration for the short video (under 60 seconds)."
                    },
                    visual_prompt: {
                        type: Type.STRING,
                        description: "A detailed visual prompt for an AI image generator, optimized for a vertical 9:16 aspect ratio. For example: 'Dynamic close-up shot, a scientist looking at a glowing beaker, dramatic blue lighting, vertical composition'."
                    }
                },
                required: ["title", "narration", "visual_prompt"],
            }
        }
    },
    required: ["shorts"],
};

export const generateScriptAndTitles = async (topic: string): Promise<ScriptResponse | null> => {
    const prompt = `Create a complete YouTube video script and title suggestions for the following topic: "${topic}". Structure the output as a JSON object that strictly follows the provided schema. The script should be engaging and well-structured for a typical YouTube video format.`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: SCRIPT_GENERATION_MODEL,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: scriptSchema,
                temperature: 0.7,
            },
        });

        const jsonString = response.text;
        if (!jsonString) return null;

        const parsedJson = JSON.parse(jsonString);
        return parsedJson as ScriptResponse;
    } catch (error) {
        console.error("Error generating script:", error);
        throw new Error("Failed to generate script from AI.");
    }
};

export const generateShortsFromScript = async (script: Scene[]): Promise<ShortsResponse | null> => {
    const scriptText = script.map(s => `Scene: ${s.scene}\nNarration: ${s.narration}`).join('\n\n');
    const prompt = `Based on the following full video script, identify 3-5 key moments and repurpose them into engaging short-form vertical videos (like YouTube Shorts). For each short, provide a catchy title, a concise narration, and a new vertical-format visual prompt.\n\nFULL SCRIPT:\n${scriptText}`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: SCRIPT_GENERATION_MODEL,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: shortsSchema,
                temperature: 0.8,
            },
        });

        const jsonString = response.text;
        if(!jsonString) return null;

        const parsedJson = JSON.parse(jsonString);
        return parsedJson as ShortsResponse;
    } catch (error) {
        console.error("Error generating shorts:", error);
        throw new Error("Failed to generate shorts from AI.");
    }
};

export const generateImage = async (
    visualPrompt: string, 
    aspectRatio: '16:9' | '9:16' = '16:9'
): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: IMAGE_GENERATION_MODEL,
            prompt: visualPrompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: aspectRatio,
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        }
        throw new Error("No image was generated.");
    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("Failed to generate image from AI.");
    }
};
