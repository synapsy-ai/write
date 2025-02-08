import { getPrompt, getSystem } from "../ai-completions";
import { Language } from "../languages";
import { Recipe } from "../recipe";

export function getPhiloAnalysisRecipe(lng: Language, tone: string): Recipe {
  return {
    name: "text-philosophy",
    systemPrompt: getSystem("ph_analysis_outline", lng, tone),
    steps: [
      {
        name: "essay-outline",
        userPrompt: getPrompt("ph_analysis_outline", lng),
        outputVar: "outline",
        type: "utility",
      },
      {
        name: "introduction",
        userPrompt: getPrompt("ph_analysis_intro", lng),
        outputVar: "introduction",
        type: "dynamic",
      },
      {
        name: "main-content",
        userPrompt: getPrompt("ph_analysis_dev", lng),
        outputVar: "mainContent",
        type: "dynamic",
      },
      {
        name: "conclusion",
        userPrompt: getPrompt("ph_analysis_conclusion", lng),
        outputVar: "conclusion",
        type: "dynamic",
      },
    ],
  };
}
