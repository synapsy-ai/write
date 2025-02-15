import { systemPrompts } from "./prompts/system";
import { userPrompts } from "./prompts/user";
import { Language } from "./languages";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText, LanguageModelV1, streamText } from "ai";
import { AiProvider } from "./models";
import { createMistral } from "@ai-sdk/mistral";
import { createAnthropic } from "@ai-sdk/anthropic";

const openai = createOpenAI({
  // custom settings, e.g.
  apiKey: process.env["OPENAI_API_KEY"],
  compatibility: "strict",
});

const mistral = createMistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export function getLanguageModel(
  provider: AiProvider,
  model: string,
): LanguageModelV1 {
  switch (provider) {
    case "mistral":
      return mistral(model);
    case "anthropic":
      return anthropic(model);
    default:
      return openai(model);
  }
}

export async function getDynamicAiGeneration(
  prompt: string,
  key: string,
  template: Template | string,
  lng: Language,
  model: string,
  options: OpenAiOptions,
  functions: { setContent: Function; setLoading: Function },
  tone: string,
  provider: AiProvider,
): Promise<any> {
  functions.setLoading(true);
  let loading = true;
  const chatCompletion = streamText({
    model: getLanguageModel(provider, model),
    system: getSystem(template, lng, tone),
    prompt: getPrompt(template, lng, prompt),
    temperature: options.temp,
    topP: options.topP,
    frequencyPenalty: options.freqP,
    presencePenalty: options.presP,
  });

  let result = "";
  for await (const chunk of chatCompletion.textStream) {
    if (chunk) result += chunk;
    functions.setContent(result);
    if (loading) {
      functions.setLoading(false);
      loading = false;
    }
  }
  return result;
}

export async function getDynamicAiGenerationCustom(
  system: string,
  prompt: string,
  key: string,
  model: string,
  options: OpenAiOptions,
  content: string,
  functions: { setContent: Function },
  provider: AiProvider,
): Promise<any> {
  let result = content;
  let c = "";
  console.log(result);
  const chatCompletion = streamText({
    model: getLanguageModel(provider, model),
    system: system,
    prompt: prompt,
    temperature: options.temp,
    topP: options.topP,
    frequencyPenalty: options.freqP,
    presencePenalty: options.presP,
  });

  for await (const chunk of chatCompletion.textStream) {
    if (chunk) {
      result += chunk;
      c += chunk;
    }
    functions.setContent(result);
  }
  return c;
}

export async function getStaticAiGeneration(
  system: string,
  prompt: string,
  key: string,
  model: string,
  options: OpenAiOptions,
  provider: AiProvider,
) {
  const chatCompletion = await generateText({
    model: getLanguageModel(provider, model),
    system: system,
    prompt: prompt,
    temperature: options.temp,
    topP: options.topP,
    frequencyPenalty: options.freqP,
    presencePenalty: options.presP,
  });

  return chatCompletion.text;
}

export function getSystem(
  template: Template | string,
  lng: Language,
  tone: string,
): string {
  const type = template.length > 3 ? template.substring(0, 3) : template;
  const prompts = systemPrompts[lng];

  return (
    prompts.templates[template] + prompts.toneSeparator + tone ||
    prompts.specialTypes[type] + prompts.toneSeparator + tone ||
    prompts.fallback + prompts.toneSeparator + tone
  );
}

export function getPrompt(
  type: Template | string,
  language: Language,
  prompt: string = "[[PROMPT]]",
): string {
  if (userPrompts[language] && userPrompts[language][type]) {
    // Retrieve the prompt template from the prompts object
    const promptTemplate = userPrompts[language][type];
    // Replace the placeholder with the provided prompt
    return promptTemplate.replace("[[PROMPT]]", prompt);
  } else {
    // Return a default error message if the language/type is not found
    return `Prompt type "${type}" for language "${language}" is not defined.`;
  }
}

export function usingPlan(lng: Language) {
  if (lng === "en") {
    return " utilizando este esquema: ";
  } else if (lng === "es") {
    return "  ";
  } else {
    return " en utilisant ce plan : ";
  }
}

export function getComplexEssayPrompts(part: number, lng: Language): string {
  switch (lng) {
    case "en":
      switch (part) {
        case 1:
          return `ONLY write part 1 (I) using this outline (no intro nor conclusion): [[outline]]`;
        case 2:
          return `ONLY write part 2 (II) using this outline (no intro nor conclusion): [[outline]]`;
        case 3:
          return `ONLY write part 3 (III) using this outline (no intro nor conclusion): [[outline]]`;
        default:
          return `ONLY write part ${part} using this outline (no intro nor conclusion): [[outline]]`;
      }

    case "fr":
      switch (part) {
        case 1:
          return `Rédige SEULEMENT la première grande partie (I) du plan (sans intro ni conclusion et avec des phrases complètes) [[outline]]`;
        case 2:
          return `Rédige SEULEMENT la deuxième grande partie (II) du plan (sans intro ni conclusion et avec des phrases complètes) [[outline]]`;
        case 3:
          return `Rédige SEULEMENT la troisième grande partie (III) du plan (sans intro ni conclusion et avec des phrases complètes) [[outline]]`;
        default:
          return `Rédige SEULEMENT la partie ${part} du plan [[outline]]`;
      }

    case "es":
      switch (part) {
        case 1:
          return `REDACCIÓN SOLAMENTE de la primera gran parte (I) del esquema (sin introducción ni conclusión y con oraciones completas) [[outline]]`;
        case 2:
          return `REDACCIÓN SOLAMENTE de la segunda gran parte (II) del esquema (sin introducción ni conclusión y con oraciones completas) [[outline]]`;
        case 3:
          return `REDACCIÓN SOLAMENTE de la tercera gran parte (III) del esquema (sin introducción ni conclusión y con oraciones completas) [[outline]]`;
        default:
          return `REDACCIÓN SOLAMENTE de la parte ${part} del esquema [[outline]]`;
      }

    default:
      return `Language not supported.`;
  }
}

export async function getModels() {
  return (
    await fetch("/api/models", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
  ).json();
}

export type Template = "para" | "email" | "blog" | "ideas";

export interface OpenAiOptions {
  topP: number;
  freqP: number;
  presP: number;
  temp: number;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatConversation {
  messages: ChatMessage[];
  name: string;
}
