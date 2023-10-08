import OpenAI from "openai";
export async function sendToGpt(
  prompt: string,
  key: string,
  template: Template | string,
  lng: "fr" | "en",
) {
  const openai = new OpenAI({
    apiKey: key,
    dangerouslyAllowBrowser: true, // defaults to process.env["OPENAI_API_KEY"]
  });

  const chatCompletion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: getSystem(template, lng) },
      { role: "user", content: getPrompt(template, lng, prompt) },
    ],
    model: "gpt-3.5-turbo",
  });

  return chatCompletion.choices[0].message.content;
}

export function getSystem(
  template: Template | string,
  lng: "fr" | "en",
): string {
  const type = template.length > 3 ? template.substring(0, 3) : template;
  if (lng === "en") {
    switch (type) {
      case "ph_":
        return "You are an expert who writes philosophy essays similar to those required for a high school diploma in the United States. Response format: HTML";
      case "es_":
        return "You are an expert who writes essays similar to those required for a high school diploma in the United States. Response format: HTML";

      default:
        return "You help writing documents. Response format: HTML";
    }
  } else {
    switch (type) {
      case "ph_":
        return "Tu es un expert qui fait des dissertations type bac de philosophie. Format de réponse : HTML";
      case "es_":
        return "Tu es un expert qui fait des dissertations type bac de français. Format de réponse : HTML";
      default:
        return "Tu aides à écrire des documents. Format de réponse : HTML";
    }
  }
}

export function getPrompt(
  template: Template | string,
  lng: "fr" | "en",
  prompt: string,
): string {
  if (lng === "en") {
    switch (template) {
      case "para":
        return `Generate a paragraph about ${prompt}`;
      case "blog":
        return `Generate a blog post about ${prompt}`;
      case "email":
        return `Generate an email about ${prompt}`;
      case "ideas":
        return `Generate a JSON array of ideas ["Idea1","Idea2"] (EXACTLY THUS FORMAT, no object) about this topic: ${prompt}`;
      case "es_intro":
        return `Write the introduction (hook, presentation of the subject, problem statement, and plan announcement) for the following topic: ${prompt}`;
      case "es_conclusion":
        return `Write the conclusion (with an opening) for the following topic: `;
      case "es_outline":
        return `Write only the outline of the essay organized in at least two main parts (I, II, III etc.) each containing at least two subparts containing examples/quotes (A, B, etc.) for the following topic: ${prompt}`;
      case "ph_intro":
        return `Write the introduction to the subject essay, including a hook, a provisional and QUICK definition of the main terms, a problem statement with three paragraphs (On the one hand..., on the other hand..., therefore...), the issues (explaining why this question is being answered), and the plan (Nature, Existence, Value OR Meaning 1, meaning 2, meaning 3). Subject: ${prompt}`;
      case "ph_prob":
        return `Write the problematization of the subject with three paragraphs MAX containing two sentences MAX, the first begins imperatively with "on the one hand", the second with "on the other hand" and the third with "therefore". Structure: 1st paragraph: first answer [R1] based on the analysis of the subject\'s concepts. 2nd paragraph: questioning of the first answer. 3rd paragraph: summary [S] of the problem with a question that clearly formulates the fundamental alternative: "R1 or R2?". Bold the ideas. Subject: ${prompt}`;
      default:
        return prompt;
    }
  } else {
    switch (template) {
      case "para":
        return `Générer un paragraphe sur ${prompt}`;
      case "blog":
        return `Génère un article de blog sur ${prompt}`;
      case "email":
        return `Générer un email à propos de ${prompt}`;
      case "ideas":
        return `Générer un array d\'idées JSON ["Idee1","Idee2"] (EXACTEMENT CE FORMAT, pas d\'objet) sur le sujet : ${prompt}`;
      case "es_intro":
        return `Rédige l'introduction (amorce, présentation du sujet, problématique et annonce du plan) du sujet suivant : ${prompt}`;
      case "es_conclusion":
        return `Rédige la conclusion (avec ouverture) du sujet suivant : ${prompt}`;
      case "es_outline":
        return `Rédige uniquement le plan de la dissertation organisé en au moins deux grandes parties (I, II, III etc.) contenant chacune au moins deux sous-parties contenant des exemples/citations (A, B, etc.) du sujet suivant : ${prompt}`;
      case "ph_intro":
        return `Rédige l'introduction de dissertation du sujet avec accroche, définition provisoire et RAPIDE des termes principaux, problématique avec trois paragraphes (D'une part..., d'autre part..., donc...), enjeux (expliquant pourquoi on répond à cette question), annonce du plan (soit Nature, Existence, Valeur OU Sens 1, sens 2, sens 3). Sujet : ${prompt}`;
      case "ph_prob":
        return `Rédige la problématisation du sujet avec trois paragraphes MAX contenu deux phrases MAX, le premier commence impérativement par "d\'une part", le second par "d\'autre part" et le troisième par "donc". Structure: 1er paragraphe : première réponse [R1] argumentée à partir de l\'analyse des notions du sujet. 2e paragraphe : questionnement de la première réponse. 3e paragraphe : reprise synthétique [S] du problème avec une question qui formule clairement l\'alternative fondamentale : "R1 ou bien R2 ?". Mettre en gras les idées. Sujet : ${prompt}`;
      default:
        return prompt;
    }
  }
}

export type Template = "para" | "email" | "blog" | "ideas";
