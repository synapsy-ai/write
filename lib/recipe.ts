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

export function addToTemplates(item: Recipe) {
  if (typeof window !== "undefined") {
    let templates: Recipe[] = [];
    templates = JSON.parse(
      localStorage.getItem("synapsy_write_templates") ?? "[]",
    );
    templates.push(item);
    localStorage.setItem("synapsy_write_templates", JSON.stringify(templates));
  }
}

export function removeFromTemplates(index: number) {
  if (typeof window !== "undefined") {
    let templates: Recipe[] = [];
    templates = JSON.parse(
      localStorage.getItem("synapsy_write_templates") ?? "[]",
    );
    templates.splice(index, 1);
    localStorage.setItem("synapsy_write_templates", JSON.stringify(templates));
  }
}

export function getTemplates(): Recipe[] {
  if (typeof window !== "undefined") {
    let templates: Recipe[] = [];
    templates = JSON.parse(
      localStorage.getItem("synapsy_write_templates") ?? "[]",
    );
    return templates;
  }
  return [];
}

export function saveTemplates(recipes: Recipe[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("synapsy_write_templates", JSON.stringify(recipes));
  }
}
