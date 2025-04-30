import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

// Ensure that your GitHub token or Azure API key is set in environment variables
const token = process.env.GITHUB_TOKEN;
const endpoint = "https://models.github.ai/inference"; // Use the GitHub AI Inference endpoint or Azure endpoint
const model = "openai/gpt-4.1"; // Specify the OpenAI model you want to use

// Function to generate the image description prompt for the notebook
export async function generateImagePrompt(name: string) {
  try {
    if (!token) {
      throw new Error('API key not set'); // Ensure the token is set in the environment
    }

    // Create a client instance for the Azure Inference API
    const client = ModelClient(endpoint, new AzureKeyCredential(token));

    // Send the request to the model API
    const response = await client.path("/chat/completions").post({
      body: {
        messages: [
          { role: "system", content: "You are a creative and helpful AI assistant designed to generate compelling thumbnail prompts for my notes. Your output will be used with the DALL·E API to create thumbnails. The descriptions should be minimalistic and follow a flat design style." },
          { role: "user", content: `Please generate a thumbnail description for my notebook titled "${name}".` }
        ],
        temperature: 1,
        top_p: 1,
        model: model
      }
    });

    // Check if the response is unexpected (i.e., an error occurred)
    if (isUnexpected(response)) {
      throw response.body.error;
    }

    // Extract the description from the response body
    const image_description = response.body.choices[0].message.content;
    return image_description;
  } catch (error) {
    console.error("❌ Error generating image prompt:", error);
    // Fallback if the API fails
    return `Flat illustration of a notebook titled "${name}" on a pastel background.`;
  }
}


export async function generateImage(image_description: string) {
  try {
    const CLIPDROP_API_KEY = process.env.CLIPDROP_API_KEY;
    if (!CLIPDROP_API_KEY) {
      throw new Error("Clipdrop API key is not set.");
    }

    const formData = new FormData();
    formData.append('prompt', image_description);

    const response = await fetch("https://clipdrop-api.co/text-to-image/v1", {
      method: "POST",
      headers: {
        'x-api-key': CLIPDROP_API_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(`Failed to generate image: ${err.error}`);
    }

    // The response body is an image (PNG)
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const image_url = `data:image/png;base64,${base64}`;
    
    return image_url;
  } catch (error) {
    console.error("❌ Error generating image:", error);
    return null;
  }
}
