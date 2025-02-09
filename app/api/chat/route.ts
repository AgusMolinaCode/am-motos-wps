import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const result = streamText({
    model: openai("gpt-3.5-turbo"),
    system:
      "Eres un experto en repuestos de motos. Proporciona una descripción muy breve y concisa.",
    prompt,
    temperature: 0.7,
    maxTokens: 300,
  });

  return result.toDataStreamResponse();
}
