const modelStrings: { [key: string]: string } = {
  "gpt-3.5-turbo": "GPT-3.5 Turbo",
  "gpt-4": "GPT-4",
  "gpt-4o": "GPT-4o",
  "gpt-4o-2024-05-13": "GPT-4o (05/2024)",
  "gpt-4-0613": "GPT-4 (06/2023)",
  "gpt-4-0314": "GPT-4 (03/2023)",
  "gpt-4-1106": "GPT-4 (11/2023)",
  "gpt-4-1106-preview": "GPT-4 Preview (11/2023)",
  "gpt-4-32k": "GPT-4 (32k)",
  "gpt-4-vision": "GPT-4V",
  "gpt-4-vision-preview": "GPT-4V Preview",
  "gpt-4-1106-vision-preview": "GPT-4V Preview (11/2023)",
  "gpt-4-0125-preview": "GPT-4 Preview (01/2024)",
  "gpt-4-turbo-preview": "GPT-4 Turbo (Preview)",
  "gpt-4-turbo-2024-04-09": "GPT-4 Turbo (April 2024)",
  "gpt-4-turbo": "GPT-4 Turbo",
  "gpt-4o-mini": "GPT-4o Mini",
  "gpt-4o-mini-2024-07-18": "GPT-4o Mini (07/2024)",
  "gpt-4o-mini-2024-08-06": "GPT-4o Mini (08/2024)",
  "gpt-4o-2024-08-06": "GPT-4o (08/2024)",
  "gpt-4o-2024-11-20": "GPT-4o (11/2024)",
  "gpt-4o-audio-preview-2024-10-01": "GPT-4o Audio Preview (10/2024)",
  "gpt-4o-audio-preview": "GPT-4o Audio Preview",
  "gpt-4o-mini-audio-preview-2024-12-17": "GPT-4o Mini Audio Preview (12/2024)",
  "gpt-4o-mini-audio-preview": "GPT-4o Mini Audio Preview",
  "gpt-4o-realtime-preview-2024-10-01": "GPT-4o Realtime Preview (10/2024)",
  "gpt-4o-realtime-preview": "GPT-4o Realtime Preview",
  "gpt-4o-mini-realtime-preview-2024-12-17":
    "GPT-4o Mini Realtime Preview (12/2024)",
  "gpt-4o-mini-realtime-preview": "GPT-4o Mini Realtime Preview",
  "o1-mini-2024-09-12": "o1 Mini (09/2024)",
  "o1-mini": "o1 Mini",
  "o1-preview-2024-09-12": "o1 Preview (09/2024)",
  "o1-preview": "o1 Preview",
  "gpt-3.5-turbo-16k": "GPT-3.5 Turbo (16k)",
  "gpt-3.5-turbo-0613": "GPT-3.5 Turbo (06/2023)",
  "gpt-3.5-turbo-16k-0613": "GPT-3.5 Turbo (16k - 06/2023)",
  "gpt-3.5-turbo-0301": "GPT-3.5 Turbo (03/2023)",
  "gpt-3.5-turbo-1106": "GPT-3.5 Turbo (11/2023)",
  "gpt-3.5-turbo-0125": "GPT-3.5 Turbo (01/2024)",
  "gpt-3.5-turbo-instruct": "GPT-3.5 Turbo Instruct",
  "gpt-3.5-turbo-instruct-0914": "GPT-3.5 Turbo Instruct (09/2023)",

  // Mistral Models
  "codestral-2405": "Codestral (2405)",
  "codestral-latest": "Codestral (Latest)",
  "codestral-mamba-2407": "Codestral Mamba (2407)",
  "codestral-mamba-latest": "Codestral Mamba (Latest)",
  "mistral-embed": "Mistral Embed",
  "mistral-large-2402": "Mistral Large (2402)",
  "mistral-large-2407": "Mistral Large (2407)",
  "mistral-large-2411": "Mistral Large (2411)",
  "mistral-large-latest": "Mistral Large (Latest)",
  "mistral-medium": "Mistral Medium",
  "mistral-medium-2312": "Mistral Medium (2312)",
  "mistral-medium-latest": "Mistral Medium (Latest)",
  "mistral-small": "Mistral Small",
  "mistral-small-2312": "Mistral Small (2312)",
  "mistral-small-2402": "Mistral Small (2402)",
  "mistral-small-2409": "Mistral Small (2409)",
  "mistral-small-latest": "Mistral Small (Latest)",
  "mistral-tiny": "Mistral Tiny",
  "mistral-tiny-2312": "Mistral Tiny (2312)",
  "mistral-tiny-2407": "Mistral Tiny (2407)",
  "mistral-tiny-latest": "Mistral Tiny (Latest)",
  "open-codestral-mamba": "Open Codestral Mamba",
  "open-mistral-7b": "Open Mistral 7B",
  "open-mistral-nemo": "Open Mistral Nemo",
  "open-mistral-nemo-2407": "Open Mistral Nemo (2407)",
  "open-mixtral-8x22b": "Open Mixtral 8x22B",
  "open-mixtral-8x22b-2404": "Open Mixtral 8x22B (2404)",
  "open-mixtral-8x7b": "Open Mixtral 8x7B",
  "ministral-3b-2410": "Ministral 3B (2410)",
  "ministral-3b-latest": "Ministral 3B (Latest)",
  "ministral-8b-2410": "Ministral 8B (2410)",
  "ministral-8b-latest": "Ministral 8B (Latest)",
  "mistral-moderation-2411": "Mistral Moderation (2411)",
  "mistral-moderation-latest": "Mistral Moderation (Latest)",

  // Anthropic Models
  "claude-2.0": "Claude 2.0",
  "claude-2.1": "Claude 2.1",
  "claude-3-5-sonnet-20240620": "Claude 3.5 Sonnet (06/2024)",
  "claude-3-5-sonnet-20241022": "Claude 3.5 Sonnet (10/2024)",
  "claude-3-sonnet-20240229": "Claude 3 Sonnet (02/2024)",
  "claude-3-opus-20240229": "Claude 3 Opus (02/2024)",
  "claude-3-5-haiku-20241022": "Claude 3.5 Haiku (10/2024)",
  "claude-3-haiku-20240307": "Claude 3 Haiku (03/2024)",
};

export function getModelString(id: string): string {
  return modelStrings[id] || id;
}

export function getModelProvider(id: string, models: ModelList): AiProvider {
  if (models.mistralModels.includes(id)) return "mistral";
  if (models.anthropicModels.includes(id)) return "anthropic";
  return "openAI";
}

export interface ModelList {
  openAiModels: string[];
  mistralModels: string[];
  anthropicModels: string[];
}

export type AiProvider = "mistral" | "openAI" | "anthropic";
