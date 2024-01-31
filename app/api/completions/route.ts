import { NextResponse } from "next/server";
import OpenAI from "openai";

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
  });

  return new NextResponse(res.choices[0].message.content);
}
