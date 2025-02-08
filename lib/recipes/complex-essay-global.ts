import {
  getPrompt,
  getComplexEssayPrompts,
  getSystem,
} from "../ai-completions";
import { Language } from "../languages";
import { Recipe } from "../recipe";

export function getComplexEssayGlobalRecipe(
  lng: Language,
  tone: string,
): Recipe {
  return {
    name: "essay-global",
    systemPrompt: getSystem("g_es_complex_outline", lng, tone),
    steps: [
      {
        name: "essay-outline",
        userPrompt: getPrompt("g_es_outline", lng),
        outputVar: "outline",
        type: "utility",
      },
      {
        name: "introduction",
        userPrompt: getPrompt("g_es_intro", lng),
        outputVar: "introduction",
        type: "dynamic",
      },
      {
        name: "part-1",
        userPrompt: getComplexEssayPrompts(1, lng),
        outputVar: "part1",
        type: "dynamic",
      },
      {
        name: "part-2",
        userPrompt: getComplexEssayPrompts(2, lng),
        outputVar: "part2",
        type: "dynamic",
      },
      {
        name: "part-3",
        userPrompt: getComplexEssayPrompts(3, lng),
        outputVar: "part3",
        type: "dynamic",
      },
      {
        name: "conclusion",
        userPrompt: getPrompt("g_es_conclusion", lng),
        outputVar: "conclusion",
        type: "dynamic",
      },
    ],
  };
}
