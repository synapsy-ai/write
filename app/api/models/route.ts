import { NextResponse } from "next/server";
import OpenAI from "openai";
import { Mistral } from "@mistralai/mistralai";
import { Anthropic } from "@anthropic-ai/sdk";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const mistral = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function GET(req: Request) {
  let models = await openai.models.list();
  let mistralModels = await mistral.models.list();
  let anthropicModels = await anthropic.models.list();
  let response = {
    openAiModels: models.data.map((model) => model.id).sort(),
    mistralModels: mistralModels.data?.map((model) => model.id).sort(),
    anthropicModels: anthropicModels.data.map((model) => model.id).sort(),
  };
  return new NextResponse(JSON.stringify(response));
}
