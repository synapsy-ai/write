import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  const json = await req.json();
  const {
    messages,
    model,
    temperature,
    top_p,
    frequency_penalty,
    presence_penalty,
  } = json;

  const res = streamText({
    model: openai(model),
    messages: messages,
    temperature: temperature,
    topP: top_p,
    frequencyPenalty: frequency_penalty,
    presencePenalty: presence_penalty,
  });

  return res.toTextStreamResponse();
}
