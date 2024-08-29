import { ModelList } from "./models";
import SystemTemplate from "./system-template";

export interface Settings {
  key: string;
  models?: string[];
  aiModels?: ModelList;
  system_templates?: SystemTemplate[];
  gen_font?: FontType;
}
export type FontType = "default" | "serif" | "sans" | "mono";
