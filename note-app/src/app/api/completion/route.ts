import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

// Replace with the env variable holding your GitHub Models API token
const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1";

const client = ModelClient(
  endpoint,
  new AzureKeyCredential(token!),
);

// Edge function export: POST handler
export async function POST(req: Request) {
  // Extract prompt from incoming POST body
  const { prompt } = await req.json();

  const response = await client.path("/chat/completions").post({
    body: {
      messages: [
        {
          role: "system",
          content: `You are a helpful AI embedded in a notion text editor app that is used to autocomplete sentences.
            The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
            AI is a well-behaved and well-mannered individual.
            AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.`,
        },
        {
          role: "user",
          content: `
            I am writing a piece of text in a notion text editor app.
            Help me complete my train of thought here: ##${prompt}##
            keep the tone of the text consistent with the rest of the text.
            keep the response short and sweet.
          `,
        },
      ],
      model: model,
      temperature: 1.0,
      top_p: 1.0,
      // stream: true, // streaming is not currently supported with this SDK
    },
  });

  if (isUnexpected(response)) {
    return new Response(JSON.stringify({ error: response.body.error }), { status: 500 });
  }

  // Return JSON as Next.js API/Edge route
  const content = response.body.choices?.[0]?.message?.content || "";
  return new Response(JSON.stringify({ content }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}