/*
IMPORTANT NOTICE: DO NOT REMOVE
This is a custom asset generation service that uses a custom API endpoint maintained by Vibecode. If the user wants to build an app that generates images, assets, icons, or anything else, you must use this internal endpoint. Do not attempt to use replicate or chatgpt.
You may update this service, but you should not need to.
This endpoint uses openai's latest image generation API, AKA gpt4o, AKA gpt-image-1, so if the user is asking for that, this is the right service to use.
Does not support video and audio generation.
*/

// API endpoint configuration
const baseUrl = "https://api.vibecodeapp.com";
const endpoint = "/api/storage/generate-image";

interface ImageOptions {
  size?: "1024x1024" | "1536x1024" | "1024x1536" | "auto";
  quality?: "low" | "medium" | "high" | "auto";
  format?: "png" | "jpeg" | "webp";
  background?: undefined | "transparent";
}

// Helper function to create request body
const createRequestBody = (prompt: string, options?: ImageOptions): object => ({
  projectId: process.env.EXPO_PUBLIC_VIBECODE_PROJECT_ID,
  prompt,
  options: { ...options },
});

// Helper function to handle API response
const processApiResponse = async (response: Response): Promise<string> => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Image generation API error: ${response.status} ${JSON.stringify(errorData)}`);
  }

  const result = await response.json();
  if (result.success && result.data) {
    return result.data.imageUrl as string;
  } else {
    throw new Error("Invalid response format from API");
  }
};

/**
 * Generate an image using the custom API endpoint
 * @param prompt The text prompt to generate an image from
 * @param options Optional parameters for image generation
 * @returns URL of the generated image, usable to render in the app directly.
 */
export async function generateImage(
  prompt: string,
  options?: ImageOptions
): Promise<string> {
  try {
    const requestBody = createRequestBody(prompt, options);
    
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    return await processApiResponse(response);
  } catch (error) {
    throw new Error(`Image Generation Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Convert aspect ratio to size format
 * @param aspectRatio The aspect ratio to convert
 * @returns The corresponding size format
 */
export function convertAspectRatioToSize(aspectRatio: string): "1024x1024" | "1536x1024" | "1024x1536" | "auto" {
  switch (aspectRatio) {
    case "1:1":
      return "1024x1024";
    case "3:2":
      return "1536x1024";
    case "2:3":
      return "1024x1536";
    default:
      return "auto";
  }
}