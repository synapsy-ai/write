import {
  getPromptText,
  getComplexEssayPrompts,
  getSystem,
} from "../ai-completions";
import { Recipe } from "../recipe";

export function getComplexEssayPhiloRecipe(
  lng: "fr" | "en",
  tone: string,
): Recipe {
  return {
    name: "philosophy",
    systemPrompt: getSystem("ph_complex_outline", lng, tone),
    steps: [
      {
        name: "essay-outline",
        userPrompt: getPromptText("ph_outline", lng),
        systemPrompt: getSystem("ph_visual_outline", lng, tone),
        outputVar: "outline",
        hide: true,
      },
      {
        name: "introduction",
        userPrompt: getPromptText("ph_intro", lng),
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
        userPrompt: getPromptText("ph_conclusion", lng),
        outputVar: "conclusion",
      },
    ],
  };
}
