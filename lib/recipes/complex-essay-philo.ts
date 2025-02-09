import {
  getPrompt,
  getComplexEssayPrompts,
  getSystem,
} from "../ai-completions";
import { Language } from "../languages";
import { Recipe } from "../recipe";

export function getComplexEssayPhiloRecipe(
  lng: Language,
  tone: string,
): Recipe {
  return {
    name: "philosophy",
    systemPrompt: getSystem("ph_complex_outline", lng, tone),
    steps: [
      {
        name: "essay-outline",
        userPrompt: getPrompt("ph_outline", lng),
        systemPrompt: getSystem("ph_visual_outline", lng, tone),
        outputVar: "outline",
        type: "utility",
      },
      {
        name: "introduction",
        userPrompt: getPrompt("ph_intro", lng),
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
        userPrompt: getPrompt("ph_conclusion", lng),
        outputVar: "conclusion",
        type: "dynamic",
      },
    ],
  };
}
