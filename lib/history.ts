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
    history = JSON.parse(localStorage.getItem("synapsy_write_history") ?? "[]");
    history.push(item);
    localStorage.setItem("synapsy_write_history", JSON.stringify(history));
  }
}

export function removeFromHistory(index: number) {
  if (typeof window !== "undefined") {
    let history: HistoryItem[] = [];
    history = JSON.parse(localStorage.getItem("synapsy_write_history") ?? "[]");
    history.splice(index, 1);
    localStorage.setItem("synapsy_write_history", JSON.stringify(history));
  }
}
