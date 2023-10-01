import { Template } from "./ai-completions";

export interface HistoryItem {
  prompt: string;
  template: Template | string;
  content: string;
  date: Date;
}
