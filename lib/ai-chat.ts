import { streamText } from "ai";
import { ChatMessage } from "./ai-completions";
import { createOpenAI } from "@ai-sdk/openai";
import { createMistral } from "@ai-sdk/mistral";
import { AiProviders } from "./models";

const openai = createOpenAI({
  // custom settings, e.g.
  apiKey: process.env["OPENAI_API_KEY"],
  compatibility: "strict",
});

const mistral = createMistral({
  apiKey: process.env["MISTRAL_API_KEY"],
});

export async function sendChatToGpt(
  model: string,
  functions: { setContent: Function },
  messages: ChatMessage[],
  system: string,
  provider: AiProviders,
): Promise<any> {
  const chatCompletion = streamText({
    // @ts-ignore
    model: provider === "openAI" ? openai(model) : mistral(model),
    system: system,
    messages: messages,
  });
  let result = "";
  for await (const chunk of chatCompletion.textStream) {
    if (chunk) result += chunk;
    functions.setContent(result);
  }
  return result;
}
