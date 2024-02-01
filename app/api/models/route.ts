import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(req: Request) {
  let models = await openai.models.list();
  return new NextResponse(JSON.stringify(models.data));
}
