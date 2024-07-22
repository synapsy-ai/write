import {
  getPromptText,
  getComplexEssayPrompts,
  getSystem,
} from "../ai-completions";
import { Recipe } from "../recipe";

export function getComplexEssayGlobalRecipe(
  lng: "fr" | "en",
  tone: string,
): Recipe {
  return {
    name: "essay-global",
    systemPrompt: getSystem("g_es_complex_outline", lng, tone),
    steps: [
      {
        name: "essay-outline",
        userPrompt: getPromptText("g_es_outline", lng),
        outputVar: "outline",
        hide: true,
      },
      {
        name: "introduction",
        userPrompt: getPromptText("g_es_intro", lng),
        outputVar: "introduction",
      },
      {
        name: "part-1",
        userPrompt: getComplexEssayPrompts(1, lng),
        outputVar: "part1",
      },
      {
        name: "part-2",
        userPrompt: getComplexEssayPrompts(2, lng),
        outputVar: "part2",
      },
      {
        name: "part-3",
        userPrompt: getComplexEssayPrompts(3, lng),
        outputVar: "part3",
      },
      {
        name: "conclusion",
        userPrompt: getPromptText("g_es_conclusion", lng),
        outputVar: "conclusion",
      },
    ],
  };
}
