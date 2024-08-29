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
  "gpt-3.5-turbo-16k": "GPT-3.5 Turbo (16k)",
  "gpt-3.5-turbo-0613": "GPT-3.5 Turbo (06/2023)",
  "gpt-3.5-turbo-16k-0613": "GPT-3.5 Turbo (16k - 06/2023)",
  "gpt-3.5-turbo-0301": "GPT-3.5 Turbo (03/2023)",
  "gpt-3.5-turbo-1106": "GPT-3.5 Turbo (11/2023)",
  "gpt-3.5-turbo-0125": "GPT-3.5 Turbo (01/2024)",
  "gpt-3.5-turbo-instruct": "GPT-3.5 Turbo Instruct",
  "gpt-3.5-turbo-instruct-0914": "GPT-3.5 Turbo Instruct (09/2023)",
};

export function getModelString(id: string): string {
  return modelStrings[id] || id;
}

export function getModelProvider(id: string, models: ModelList): AiProviders {
  if (models.mistralModels.includes(id)) return "mistral";
  return "openAI";
}

export interface ModelList {
  openAiModels: string[];
  mistralModels: string[];
}

export type AiProviders = "mistral" | "openAI";
