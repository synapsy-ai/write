import OpenAI from "openai";
import { ChatMessage } from "./ai-completions";
export async function sendChatToGpt(
  model: string,
  functions: { setContent: Function },
  messages: ChatMessage[],
): Promise<any> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true, // defaults to process.env["OPENAI_API_KEY"]
  });
  const chatCompletion: OpenAI.Chat.Completions.ChatCompletion | any =
    await openai.chat.completions
      .create({
        messages: messages,
        model: model,
        stream: true,
      })
      .catch((err: any) => {
        return err;
      });

  let result = "";
  for await (const chunk of chatCompletion) {
    if (chunk.choices[0].delta.content)
      result += chunk.choices[0].delta.content;
    functions.setContent(result);
  }
  return result;
}
