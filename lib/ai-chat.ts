import { streamText } from "ai";
import { ChatMessage } from "./ai-completions";
import { createOpenAI } from "@ai-sdk/openai";

const openai = createOpenAI({
  // custom settings, e.g.
  apiKey: process.env["OPENAI_API_KEY"],
  compatibility: "strict",
});
export async function sendChatToGpt(
  model: string,
  functions: { setContent: Function },
  messages: ChatMessage[],
  system: string,
): Promise<any> {
  const chatCompletion = await streamText({
    model: openai(model),
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
