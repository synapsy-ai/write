import { Template } from "./ai-completions";

export interface HistoryItem {
  prompt: string;
  template: Template | string;
  content: string;
  date: Date;
  index?: number;
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

export function getHistory(): HistoryItem[] {
  if (typeof window !== "undefined") {
    let history: HistoryItem[] = [];
    history = JSON.parse(localStorage.getItem("synapsy_write_history") ?? "[]");
    return history;
  }
  return [];
}
export function groupAndSortHistoryItems(
  items: HistoryItem[],
  sortByDate: boolean,
): { template: string; items: HistoryItem[] }[] {
  // Sort the items by date
  items.sort((a, b) => {
    if (sortByDate) {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    } else {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  // Group items by template
  const groupedItems: { [key: string]: HistoryItem[] } = {};

  items.forEach((item, i) => {
    const templateKey = item.template as string;
    if (!groupedItems[templateKey]) {
      groupedItems[templateKey] = [];
    }
    item.index = i;
    groupedItems[templateKey].push(item);
  });

  // Convert the grouped items object into an array
  const result: { template: string; items: HistoryItem[] }[] = [];
  for (const template in groupedItems) {
    if (groupedItems.hasOwnProperty(template)) {
      result.push({ template, items: groupedItems[template] });
    }
  }

  return result;
}
