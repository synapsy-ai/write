import { NextResponse } from "next/server";
import OpenAI from "openai";
import { Mistral } from "@mistralai/mistralai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const mistral = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

export async function GET(req: Request) {
  let models = await openai.models.list();
  let mistralModels = await mistral.models.list();
  let response = {
    openAiModels: models.data.map((model) => model.id).sort(),
    mistralModels: mistralModels.data?.map((model) => model.id).sort(),
  };
  return new NextResponse(JSON.stringify(response));
}
