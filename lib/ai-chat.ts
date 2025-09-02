import { LanguageModel, streamText } from "ai";
import { ChatMessage } from "./ai-completions";
import { createOpenAI } from "@ai-sdk/openai";
import { createMistral } from "@ai-sdk/mistral";
import { AiProvider } from "./models";
import { createAnthropic } from "@ai-sdk/anthropic";

const openai = createOpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

const mistral = createMistral({
  apiKey: process.env["MISTRAL_API_KEY"],
});

const anthropic = createAnthropic({
  apiKey: process.env["ANTHROPIC_API_KEY"],
  headers: { "anthropic-dangerous-direct-browser-access": "true" },
});

export async function sendChatToGpt(
  model: string,
  functions: { setContent: Function },
  messages: ChatMessage[],
  system: string,
  provider: AiProvider,
): Promise<any> {
  const chatCompletion = streamText({
    model: getLanguageModel(provider, model),
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
function getLanguageModel(provider: AiProvider, model: string): LanguageModel {
  switch (provider) {
    case "mistral":
      return mistral(model);
    case "anthropic":
      return anthropic(model);
    default:
      return openai(model);
  }
}
