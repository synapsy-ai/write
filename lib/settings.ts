import SystemTemplate from "./system-template";

export interface Settings {
  key: string;
  models?: string[];
  system_templates?: SystemTemplate[];
}
