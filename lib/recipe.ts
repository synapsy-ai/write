export type Step = {
  name: string;
  userPrompt: string;
  systemPrompt?: string;
  outputVar: string;
  hide?: boolean;
};

export type Recipe = {
  name: string;
  systemPrompt: string;
  steps: Step[];
};
