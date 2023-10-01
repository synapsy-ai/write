import { Template } from "./ai-completions";

export interface HistoryItem {
  prompt: string;
  template: Template | string;
  content: string;
  date: Date;
}

export function addToHistory(item: HistoryItem) {
  if (typeof window !== "undefined") {
    let history: HistoryItem[] = [];
    history = JSON.parse(
      localStorage.getItem("rativegen_write_history") ?? "[]"
    );
    history.push(item);
    localStorage.setItem("rativegen_write_history", JSON.stringify(history));
  }
}
