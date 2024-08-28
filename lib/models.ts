export function getModelString(id: string) {
  switch (id) {
    case "gpt-3.5-turbo":
      return "GPT-3.5 Turbo";
    case "gpt-4":
      return "GPT-4";
    case "gpt-4o":
      return "GPT-4o";
    case "gpt-4o-2024-05-13":
      return "GPT-4o (05/2024)";
    case "gpt-4-0613":
      return "GPT-4 (06/2023)";
    case "gpt-4-0314":
      return "GPT-4 (03/2023)";
    case "gpt-4-1106":
      return "GPT-4 (11/2023)";
    case "gpt-4-1106-preview":
      return "GPT-4 Preview (11/2023)";
    case "gpt-4-32k":
      return "GPT-4 (32k)";
    case "gpt-4-vision":
      return "GPT-4V";
    case "gpt-4-vision-preview":
      return "GPT-4V Preview";
    case "gpt-4-1106-vision-preview":
      return "GPT-4V Preview (11/2023)";
    case "gpt-4-0125-preview":
      return "GPT-4 Preview (01/2024)";
    case "gpt-4-turbo-preview":
      return "GPT-4 Turbo (Preview)";
    case "gpt-4-turbo-2024-04-09":
      return "GPT-4 Turbo (April 2024)";
    case "gpt-4-turbo":
      return "GPT-4 Turbo";
    case "gpt-4o-mini":
      return "GPT-4o Mini";
    case "gpt-4o-mini-2024-07-18":
      return "GPT-4o Mini (07/2024)";
    case "gpt-4o-mini-2024-08-06":
      return "GPT-4o Mini (08/2024)";
    case "gpt-3.5-turbo-16k":
      return "GPT-3.5 Turbo (16k)";
    case "gpt-3.5-turbo-0613":
      return "GPT-3.5 Turbo (06/2023)";
    case "gpt-3.5-turbo-16k-0613":
      return "GPT-3.5 Turbo (16k - 06/2023)";
    case "gpt-3.5-turbo-0301":
      return "GPT-3.5 Turbo (03/2023)";
    case "gpt-3.5-turbo-1106":
      return "GPT-3.5 Turbo (11/2023)";
    case "gpt-3.5-turbo-0125":
      return "GPT-3.5 Turbo (01/2024)";
    case "gpt-3.5-turbo-instruct":
      return "GPT-3.5 Turbo Instruct";
    case "gpt-3.5-turbo-instruct-0914":
      return "GPT-3.5 Turbo Instruct (09/2023)";
    default:
      return id;
  }
}
