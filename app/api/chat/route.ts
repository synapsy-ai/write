import { NextResponse } from "next/server";
import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const json = await req.json();
  const {
    messages,
    model,
    temperature,
    top_p,
    frequency_penalty,
    presence_penalty,
    previewToken,
  } = json;

  const res = await openai.chat.completions.create({
    model: model,
    messages,
    temperature: temperature,
    top_p: top_p,
    frequency_penalty: frequency_penalty,
    presence_penalty: presence_penalty,
    stream: true,
  });

  const stream = OpenAIStream(res, {
    // This function is called when the API returns a response
    async onCompletion(completion) {
      const title = json.messages[0].content.substring(0, 100);
      const id = json.id;
      const createdAt = Date.now();
      const path = `/chat/${id}`;
      const payload = {
        id,
        title,
        createdAt,
        path,
        messages: [
          ...messages,
          {
            content: completion,
            role: "assistant",
          },
        ],
      };
    },
  });

  return new StreamingTextResponse(stream);
}
