import OpenAI from "openai";
export async function sendToGpt(
  prompt: string,
  key: string,
  template: Template | string,
  lng: "fr" | "en"
) {
  const openai = new OpenAI({
    apiKey: key,
    dangerouslyAllowBrowser: true, // defaults to process.env["OPENAI_API_KEY"]
  });

  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: "system", content: getPrompt(template, lng) + prompt }],
    model: "gpt-3.5-turbo",
  });

  return chatCompletion.choices[0].message.content;
}

function getPrompt(template: Template | string, lng: "fr" | "en") {
  if (lng === "en") {
    switch (template) {
      case "para":
        return "Generate a paragraph about ";
      case "blog":
        return "Generate a blog post about ";
      case "email":
        return "Generate an email about ";
      case "ideas":
        return "Generate a list of ideas about ";
    }
  } else {
    switch (template) {
      case "para":
        return "Générer un paragraphe sur ";
      case "blog":
        return "Génère un article de blog sur ";
      case "email":
        return "Générer un email à propos de ";
      case "ideas":
        return "Générer une liste d'idées sur ";
    }
  }
}

export type Template = "para" | "email" | "blog" | "ideas";
