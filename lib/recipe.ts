export type StepType = "dynamic" | "static" | "utility";

export type Step = {
  name: string;
  userPrompt: string;
  systemPrompt?: string;
  outputVar: string;
  hide?: boolean;
  type?: StepType;
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

export function migrateRecipes(recipes: Recipe[]) {
  if (typeof window !== "undefined") {
    if (localStorage.getItem("synapsy_write_migration")) return;
    for (let i = 0; i < recipes.length; i++) {
      for (let j = 0; j < recipes[i].steps.length; j++) {
        if (!recipes[i].steps[j].type) {
          if (recipes[i].steps[j].hide) {
            recipes[i].steps[j].type = "utility";
          } else {
            recipes[i].steps[j].type = "dynamic";
          }
        }
      }
    }
    localStorage.setItem("synapsy_write_templates", JSON.stringify(recipes));
    localStorage.setItem("synapsy_write_migration", "true");
  }
}
