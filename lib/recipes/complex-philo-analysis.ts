import {
  getPromptText,
  getPromptComplexAnalysis,
  getSystem,
} from "../ai-completions";
import { Recipe } from "../recipe";

export function getPhiloAnalysisRecipe(lng: "fr" | "en", tone: string): Recipe {
  return {
    name: "text-philosophy",
    systemPrompt: getSystem("ph_analysis_outline", lng, tone),
    steps: [
      {
        name: "essay-outline",
        userPrompt: getPromptText("ph_analysis_outline", lng),
        outputVar: "outline",
        hide: true,
      },
      {
        name: "introduction",
        userPrompt: getPromptComplexAnalysis("ph_analysis_intro", lng),
        outputVar: "introduction",
      },
      {
        name: "main-content",
        userPrompt: getPromptComplexAnalysis("ph_analysis_dev", lng),
        outputVar: "mainContent",
      },
      {
        name: "conclusion",
        userPrompt: getPromptComplexAnalysis("ph_analysis_conclusion", lng),
        outputVar: "conclusion",
      },
    ],
  };
}
