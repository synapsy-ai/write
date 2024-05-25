import OpenAI from "openai";
export async function sendToGpt(
  prompt: string,
  key: string,
  template: Template | string,
  lng: "fr" | "en",
  model: string,
  options: OpenAiOptions,
  functions: { setContent: Function; setLoading: Function },
  tone: string,
): Promise<any> {
  functions.setLoading(true);
  let loading = true;
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true, // defaults to process.env["OPENAI_API_KEY"]
  });
  const chatCompletion: OpenAI.Chat.Completions.ChatCompletion | any =
    await openai.chat.completions
      .create({
        messages: [
          { role: "system", content: getSystem(template, lng, tone) },
          { role: "user", content: getPrompt(template, lng, prompt) },
        ],
        model: model,
        temperature: options.temp,
        top_p: options.topP,
        frequency_penalty: options.freqP,
        presence_penalty: options.presP,
        stream: true,
      })
      .catch((err: any) => {
        return err;
      });

  let result = "";
  for await (const chunk of chatCompletion) {
    if (chunk.choices[0].delta.content)
      result += chunk.choices[0].delta.content;
    functions.setContent(result);
    if (loading) {
      functions.setLoading(false);
      loading = false;
    }
  }
  return result;
}

export async function sendToGptCustom(
  system: string,
  prompt: string,
  key: string,
  model: string,
  options: OpenAiOptions,
  content: string,
  functions: { setContent: Function },
): Promise<any> {
  let result = content;
  let c = "";
  console.log(result);
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true, // defaults to process.env["OPENAI_API_KEY"]
  });

  const chatCompletion = await openai.chat.completions
    .create({
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
      model: model,
      temperature: options.temp,
      top_p: options.topP,
      frequency_penalty: options.freqP,
      presence_penalty: options.presP,
      stream: true,
    })
    .catch((err: any) => {
      return err;
    });
  for await (const chunk of chatCompletion) {
    if (chunk.choices[0].delta.content) {
      result += chunk.choices[0].delta.content;
      c += chunk.choices[0].delta.content;
    }
    functions.setContent(result);
  }
  return c;
}

export async function getStandardGeneration(
  system: string,
  prompt: string,
  key: string,
  model: string,
  options: OpenAiOptions,
) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true, // defaults to process.env["OPENAI_API_KEY"]
  });

  const chatCompletion = await openai.chat.completions
    .create({
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
      model: model,
      temperature: options.temp,
      top_p: options.topP,
      frequency_penalty: options.freqP,
      presence_penalty: options.presP,
    })
    .catch((err: any) => {
      return err;
    });
  return chatCompletion.choices[0].message.content;
}

export function getSystem(
  template: Template | string,
  lng: "fr" | "en",
  tone: string,
): string {
  const type = template.length > 3 ? template.substring(0, 3) : template;
  if (lng === "en") {
    if (template === "ideas") {
      return (
        'You are a helpful assistant who gives ideas in a JSON array of ideas ["Idea1","Idea2"] (EXACTLY THIS FORMAT, no object)' +
        (tone === "tones-none" ? "" : " Use the following tone: " + tone)
      );
    }
    if (template === "es_complex_outline") {
      return (
        "You are an expert who writes essays similar to those required for a high school diploma in the United States." +
        (tone === "tones-none" ? "" : " Use the following tone: " + tone)
      );
    }
    if (template === "ph_complex_outline") {
      return (
        "You are an expert who writes philosophy essays similar to those required for a high school diploma in the United States." +
        (tone === "tones-none" ? "" : " Use the following tone: " + tone)
      );
    }
    if (template === "ph_visual_outline") {
      return (
        `You are an expert who writes philosophy essays similar to those required for a high school diploma in the United States. You write outlines without introductions and conclusions. Response format: JSON. Use the following format:
      [{"name": "Part 1 Name",child: ["Subpart A","Subpart B","Subpart C"]},"name": "Part 2 Name",child: ["Subpart A","Subpart B","Subpart C"]},"name": "Part 3 Name",child: ["Subpart A","Subpart B","Subpart C"]}]` +
        (tone === "tones-none" ? "" : "\n\nUse the following tone: " + tone)
      );
    }
    if (template === "ph_analysis_outline") {
      return (
        "You are an expert who writes philosophy text analysis similar to those required for a high school diploma in the United States." +
        (tone === "tones-none" ? "" : " Use the following tone: " + tone)
      );
    }
    if (template === "table")
      return (
        "You are an expert who creates HTML Tables. You help organize data in HTML tables. You ONLY give the code for the HTML Table (body ONLY,no head, no scripts) on a single line." +
        (tone === "tones-none" ? "" : " Use the following tone: " + tone)
      );
    if (template === "motivation-letter")
      return (
        "You are an expert who creates Motivation letters. The letter must be clear, not too long, avoid cliché phrases. Organize and structure the letter, don't criticize the previous employer. If for university, talk about your (academic) qualities." +
        (tone === "tones-none" ? "" : " Use the following tone: " + tone)
      );
    if (template === "rephraser")
      return (
        "You are an expert who rephrases text. Be concise and don't use uncommon vocabulary." +
        (tone === "tones-none" ? "" : " Use the following tone: " + tone)
      );
    if (template === "history_para") {
      return (
        "You're an expert at writing paragraphs in History, you need to follow this method: Start with a sentence stating the general idea of the paragraph. The paragraph must contain: precise dates, specific historical events, important actors and their functions, and key concepts. Be sure to include precise historical references with dates. It should be concise, not overly long, unless explicitly requested by the user." +
        (tone === "tones-none" ? "" : " Use the following tone: " + tone)
      );
    }
    switch (type) {
      case "ph_":
        return (
          "You are an expert who writes philosophy essays similar to those required for a high school diploma in the United States. Response format: HTML (body ONLY,no head, no scripts)" +
          (tone === "tones-none" ? "" : " Use the following tone: " + tone)
        );
      case "es_":
        return (
          "You are an expert who writes essays similar to those required for a high school diploma in the United States. Response format: HTML (body ONLY,no head, no scripts)" +
          (tone === "tones-none" ? "" : " Use the following tone: " + tone)
        );
      case "g_e":
        return (
          "You are an expert who writes essays. Essays should always respond to a problematic, have an introduction, development (2 or 3 parts) and a conclusion. Response format: HTML (body ONLY,no head, no scripts)" +
          (tone === "tones-none" ? "" : " Use the following tone: " + tone)
        );
      default:
        return (
          "You help writing documents. Response format: HTML (body ONLY,no head, no scripts)" +
          (tone === "tones-none" ? "" : " Use the following tone: " + tone)
        );
    }
  } else {
    if (template === "ideas") {
      return (
        'Tu un assistant qui donne des idées dans un array d\'idées JSON ["Idee1","Idee2"] (EXACTEMENT CE FORMAT, pas d\'objet)' +
        (tone === "tones-none" ? "" : " Utilise le ton suivant : " + tone)
      );
    }
    if (template === "es_complex_outline") {
      return (
        "Tu es un expert qui fait des dissertations type bac de français." +
        (tone === "tones-none" ? "" : " Utilise le ton suivant : " + tone)
      );
    }
    if (template === "ph_complex_outline") {
      return (
        "Tu es un expert qui fait des dissertations type bac de philosophie." +
        (tone === "tones-none" ? "" : " Utilise le ton suivant : " + tone)
      );
    }
    if (template === "ph_visual_outline") {
      return (
        `Tu es un expert qui fait des dissertations type bac de philosophie. Tu rédiges des plans de devoir sans introduction ni conclusion, avec trois parties. Format de réponse: JSON. Utilise absolument ce format (si tu ne l'utilise pas ou que tu le modifie, cela serait considéré comme offensant; les champs name et child doivent être inclus):
      [{"name": "Nom de la Partie 1","child": ["Sous-partie A","Sous-partie B","Sous-partie C"]},"name": "Nom de la Partie 2","child": ["Sous-partie A","Sous-partie B","Sous-partie C"]},"name": "Nom de la Partie 3","child": ["Sous-partie A","Sous-partie B","Sous-partie C"]}]` +
        (tone === "tones-none" ? "" : "\n\nUtilise le ton suivant : " + tone)
      );
    }
    if (template === "ph_analysis_outline") {
      return (
        "Tu es un expert qui fait des explications de texte type bac de philosophie." +
        (tone === "tones-none" ? "" : " Utilise le ton suivant : " + tone)
      );
    }
    if (template === "table")
      return (
        "Tu es un expert qui crée des tableaux HTML. Tu aides à organiser les données dans les tableaux HTML. Tu donnes UNIQUEMENT le code du tableau en HTML  (body SEULEMENT, pas de head, pas de scripts) en une seule ligne." +
        (tone === "tones-none" ? "" : " Utilise le ton suivant : " + tone)
      );
    if (template === "motivation-letter")
      return (
        "Tu es un expert qui crée des lettres de motivation. La lettre doit être claire, pas trop longue, éviter les phrases clichées. Organiser et structurer la lettre, ne pas critiquer l'employeur précédent. Si c'est pour l'université/école, parle de tes qualités (académiques)." +
        (tone === "tones-none" ? "" : " Utilise le ton suivant : " + tone)
      );
    if (template === "rephraser")
      return (
        "Tu es un expert qui reformule des textes. Sois concis et n'utilise pas de vocabulaire peu courant." +
        (tone === "tones-none" ? "" : " Utilise le ton suivant : " + tone)
      );
    if (template === "history_para") {
      return (
        "Tu es un expert en rédaction de paragraphe dans la matière Histoire, voici la méthode : Commence par une phrase énonçant l'idée générale du paragraphe. Le paragraphe doit impérativement contenir : des dates précises, des événements historiques spécifiques, des acteurs importants avec leurs fonctions, et des notions clés. Assure-toi d'inclure des références historiques précises avec des dates." +
        (tone === "tones-none" ? "" : " Use the following tone: " + tone)
      );
    }
    switch (type) {
      case "ph_":
        return (
          "Tu es un expert qui fait des dissertations type bac de philosophie. Format de réponse : HTML (SEULEMENT body, pas de head, pas de scripts)" +
          (tone === "tones-none" ? "" : " Utilise le ton suivant : " + tone)
        );
      case "es_":
        return (
          "Tu es un expert qui fait des dissertations type bac de français. Format de réponse : HTML (SEULEMENT body, pas de head, pas de scripts)" +
          (tone === "tones-none" ? "" : " Utilise le ton suivant : " + tone)
        );
      case "g_e":
        return (
          "Tu es un expert qui rédige des dissertations. Les dissertations doivent toujours répondre à une problématique, avoir une introduction, un développement (2 ou 3 parties) et une conclusion. Format de réponse : HTML (SEULEMENT body, pas de head, pas de scripts)" +
          (tone === "tones-none" ? "" : " Utilise le ton suivant : " + tone)
        );
      default:
        return (
          "Tu aides à écrire des documents. Format de réponse : HTML (SEULEMENT body, pas de head, pas de scripts)" +
          (tone === "tones-none" ? "" : " Utilise le ton suivant : " + tone)
        );
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
        return `Generate a JSON array of ideas ["Idea1","Idea2"] (EXACTLY THIS FORMAT, no object) about this topic: ${prompt}`;
      case "es_intro":
        return `Write the introduction (hook, presentation of the subject, problem statement, and plan announcement) for the following topic: ${prompt}`;
      case "es_conclusion":
        return `Write the conclusion (with an opening) for the following topic: ${prompt}`;
      case "es_outline":
        return `Write only the outline of the essay organized in three main parts (I, II, III etc.) each containing at least two subparts containing examples/quotes (A, B, etc.) for the following topic: ${prompt}`;
      case "es_basic":
        return `Write the introduction (introduction, presentation of the subject, issues and outline), the content of the essay organized into at least two main parts (I, II, III etc.) each containing at least two sub-parts (A, B, etc.) (with quotations), and the conclusion of the following subject: ${prompt}`;
      case "g_es_intro":
        return `Write the introduction (hook, presentation of the subject, problem statement, and plan announcement) for the following topic: ${prompt}`;
      case "g_es_conclusion":
        return `Write the conclusion, that resumes what you said in the essay (with an opening) for the following topic: ${prompt}`;
      case "g_es_outline":
        return `Write only the outline of the essay organized in three main parts (I, II, III etc.) each containing at least two subparts with arguments, examples, numbers, stats, quotes (depending on context) for the following topic: ${prompt}`;
      case "es_basic":
        return `Write the introduction (primer, presentation of the subject, problem and announcement of the plan), the content of the essay organized into at least two main parts (I, II, III etc.) each containing at least two sub-parts (A, B, etc.) (with arguments, examples, dates, numbers, quotations, etc.), and the conclusion of the following subject: ${prompt}`;
      case "ph_intro":
        return `Write the introduction to the subject essay, including a hook, a provisional and QUICK definition of the main terms, a problem statement with three paragraphs (On the one hand..., on the other hand..., therefore...), the issues (explaining why this question is being answered), and the plan (Nature, Existence, Value OR Meaning 1, meaning 2, meaning 3). Subject: ${prompt}`;
      case "ph_prob":
        return `Write the problematization of the subject with three paragraphs MAX containing two sentences MAX, the first begins imperatively with "on the one hand", the second with "on the other hand" and the third with "therefore". Structure: 1st paragraph: first answer [R1] based on the analysis of the subject\'s concepts. 2nd paragraph: questioning of the first answer. 3rd paragraph: summary [S] of the problem with a question that clearly formulates the fundamental alternative: "R1 or R2?". Bold the ideas. Subject: ${prompt}`;
      case "ph_outline":
        return `Write the essay plan (no intro or conclusion, only the essay plan); Structure: Nature plan (=in theory), Existence plan (=in practice), Value plan (=morally). Subject: ${prompt}`;
      case "ph_visual_outline":
        return `Write the essay outline of the following subject, without introduction and conclusion: ${prompt}`;
      case "ph_conclusion":
        return `Write the essay conclusion, which should summarize the essay and include an opening. Subject: ${prompt}`;
      case "ph_basic":
        return `Write the introduction (introduction, presentation of the subject, issues and outline), the content of the essay organized into at least three main parts (I, II, III etc.) each containing at least two sub-parts (A, B, etc.) (with examples from life, philosophers), and the conclusion of the following subject: ${prompt}`;
      case "ph_analysis_intro":
        return `Write the introduction of the text analysis using the following structure: introduction, presentation of the text's theme, problematic (on the one hand, on the other, therefore), presentation of the author's thesis, announcement of the text's plan, using the author's arguments for each part. Text: ${prompt}`;
      case "ph_analysis_conclusion":
        return `Write the conclusion of the text analysis, recall the most the most important elements of the development, clearly explaining how the development showed how the author demonstrated his thesis. Text: ${prompt}`;
      case "ph_analysis_basic":
        return `Write the text analysis with Introduction, Development and Conclusion. Use the provided structures. Introduction structure: introduction, presentation of the text's theme, problematic (on the one hand, on the other, therefore), presentation of the author's thesis, announcement of the text's plan, using the author's arguments for each part. Development structure: The explanation is linear, i.e. the assignment must follow the order of the text. Each part corresponds to a part of the extract, and within the part, the various particular explanations (of terms, of sentences in themselves) follow one another as in the text. - For each part, start by giving the main idea. - For each sentence, give its function (premise, explanation, example...) and content, expressed in your own words. An explanation may follow if the sentence is very complex. - Explain the philosophical terms in the sentence, giving definitions, and explain underlying references (you may wish to mention other authors). End with a concrete example illustrating the author's idea. Conclusion structure: recall the most the most important elements of the development, clearly explaining how the development showed how the author demonstrated his thesis. Text: [[${prompt}]]`;
      case "ph_analysis_dev":
        return `Write the text explanation using sentences, no list. The explanation is linear, i.e. the assignment must follow the order of the text. Each part corresponds to a part of the extract, and within the part, the various specific explanations (of terms, of sentences in themselves) follow one another as in the text. Start from the broadest to the most precise: - For each part, start by giving the main idea. - For each sentence, give its function (premise, explanation, example...) and content expressed in your own words. An explanation may follow if the sentence is very complex. - Explain the philosophical terms in the sentence by giving definitions, and make explicit any implied meaning or underlying references (you may wish to mention other authors). - End with a concrete example illustrating the author's idea. Text: [[${prompt}]]`;
      case "ph_analysis_outline":
        return `Write the outline of the text explanation. The explanation is linear, i.e. the assignment must follow the order of the text. Each part corresponds to a part of the extract, and within the part, the various specific explanations (of terms, of sentences in themselves) follow one another as in the text. Start from the broadest to the most precise: - For each part, start by giving the main idea. - For each sentence, give its function (premise, explanation, example...) and content expressed in your own words. An explanation may follow if the sentence is very complex. - Explain the philosophical terms in the sentence by giving definitions, and make explicit any implied meaning or underlying references (you may wish to mention other authors). - End with a concrete example illustrating the author's idea. Text: [[${prompt}]]`;
      case "table":
        return `Give ONLY the corresponding HTML Table about (no other text): ${prompt}`;
      case "motivation-letter":
        return `Write the motivation letter: ${prompt}`;
      case "rephraser":
        return `Rephrase the following text: ${prompt}`;
      case "history_para":
        return `Write a paragraph in history about the following subject: ${prompt}`;
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
        return `Rédige uniquement le plan de la dissertation organisé en trois grandes parties (I, II, III etc.) contenant chacune au moins deux sous-parties contenant des exemples/citations (A, B, etc.) du sujet suivant : ${prompt}`;
      case "es_basic":
        return `Rédige l'introduction (amorce, présentation du sujet, problématique et annonce du plan), le contenu de la dissertation organisé en au moins deux grandes parties (I, II, III etc.) contenant chacune au moins deux sous-parties (A, B, etc.) (avec des citations), et la conclusion du sujet suivant : ${prompt}`;
      case "g_es_intro":
        return `Rédige l'introduction (accroche, présentation du sujet, énoncé du problème et annonce du plan) pour le sujet suivant : ${prompt}`;
      case "g_es_conclusion":
        return `Rédige la conclusion, qui reprend ce que vous avez dit dans la dissertation (avec une ouverture) pour le sujet suivant : ${prompt}`;
      case "g_es_outline":
        return `Rédige seulement le plan de la dissertation organisé en trois parties principales (I, II, III etc.) contenant chacune au moins deux sous-parties, avec arguments, exemples, chiffres, statistiques, citations (selon le contexte) pour le sujet suivant : ${prompt}`;
      case "es_basic":
        return `Rédige l'introduction (amorce, présentation du sujet, problématique et annonce du plan), le contenu de la dissertation organisé en au moins deux grandes parties (I, II, III etc.) contenant chacune au moins deux sous-parties (A, B, etc.) (avec arguments, exemples, dates, chiffres, citations, etc.), et la conclusion du sujet suivant : ${prompt}`;
      case "ph_intro":
        return `Rédige l'introduction de dissertation du sujet avec accroche, définition provisoire et RAPIDE des termes principaux, problématique avec trois paragraphes (D'une part..., d'autre part..., donc...), enjeux (expliquant pourquoi on répond à cette question), annonce du plan (soit Nature, Existence, Valeur OU Sens 1, sens 2, sens 3). Sujet : ${prompt}`;
      case "ph_prob":
        return `Rédige la problématisation du sujet avec trois paragraphes MAX contenu deux phrases MAX, le premier commence impérativement par "d\'une part", le second par "d\'autre part" et le troisième par "donc". Structure: 1er paragraphe : première réponse [R1] argumentée à partir de l\'analyse des notions du sujet. 2e paragraphe : questionnement de la première réponse. 3e paragraphe : reprise synthétique [S] du problème avec une question qui formule clairement l\'alternative fondamentale : "R1 ou bien R2 ?". Mettre en gras les idées. Sujet : ${prompt}`;
      case "ph_outline":
        return `Rédige le plan de dissertation (pas d'intro ou conclusion, seulement le plan) ; Structure : Plan Nature (=en théorie), Existence (=en pratique), Valeur (=moralement). Sujet : ${prompt}`;
      case "ph_visual_outline":
        return `Rédige le plan de dissertation du sujet suivant, sans introduction ni conclusion: ${prompt}`;
      case "ph_conclusion":
        return `Rédige la conclusion de dissertation, qui doit récapituler de manière synthétique la dissertation et inclure une ouverture. Sujet : ${prompt}`;
      case "es_basic":
        return `Rédige l'introduction (amorce, présentation du sujet, problématique et annonce du plan), le contenu de la dissertation organisé en au moins trois grandes parties (I, II, III etc.) contenant chacune au moins deux sous-parties (A, B, etc.) (avec des exemples de la vie courantes, des philosphes), et la conclusion du sujet suivant : ${prompt}`;
      case "ph_analysis_intro":
        return `Rédige l'introduction de l'analyse du texte en utilisant la structure suivante : amorce, présentation du thème du texte, problématique (d'une part, d'autre part, donc), présentation de la thèse de l'auteur, annonce du plan du texte, en utilisant les arguments de l'auteur pour chaque partie. Texte : ${prompt}`;
      case "ph_analysis_conclusion":
        return `Rédigez la conclusion de l'analyse du texte, en rappelant les éléments les plus importants du développement, en expliquant clairement comment le développement a montré comment l'auteur a démontré sa thèse. Texte : ${prompt}`;
      case "ph_analysis_basic":
        return `Rédige l'explication de texte avec Introduction, développement et conclusion. Utilise les structures proposées. Structure de l'introduction : introduction, présentation du thème du texte, problématique (d'une part, d'autre part, donc), présentation de la thèse de l'auteur, annonce du plan du texte, utilisation des arguments de l'auteur pour chaque partie. Structure du développement : L'explication est linéaire, c'est-à-dire que le devoir doit suivre l'ordre du texte. Chaque partie correspond à une partie de l'extrait, et à l'intérieur de la partie, les différentes explications particulières (de termes, de phrases en elles-mêmes) se succèdent comme dans le texte. - Pour chaque partie, commencez par donner l'idée principale. - Pour chaque phrase, donnez sa fonction (prémisse, explication, exemple...) et son contenu, exprimés avec vos propres mots. Une explication peut suivre si la phrase est très complexe. - Expliquez les termes philosophiques de la phrase, en donnant des définitions, et expliquez les références sous-jacentes (vous pouvez éventuellement mentionner d'autres auteurs). Terminez par un exemple concret illustrant l'idée de l'auteur. Structure de la conclusion : rappeler les éléments les plus importants du développement, en expliquant clairement comment le développement a montré comment l'auteur a démontré sa thèse. Texte : [[${prompt}]]`;
      case "ph_analysis_dev":
        return `Rédige le developpement l'explication de texte avec des phrases, pas de listes. L'explication est linéaire, c'est-à-dire que le devoir doit suivre l'ordre du texte. Chaque partie correspond à une partie de l'extrait, et à l'intérieur de la partie, les différentes explications particulières (des termes, des phrases en elles-mêmes) se succèdent comme dans le texte. Partez du plus large pour aller vers le plus précis : - Pour chaque partie, commencez par en donner l'idée principale. - Pour chaque phrase, donnez-en la fonction (postulat, explication, exemple...) et le contenu exprimé avec vos mots. Peut suivre une explication si la phrase est très complexe. - Expliquez les termes philosophiques de la phrase en donnant des définitions, et explicitez les sous-entendus, les références sous-jacentes (vous pouvez alors mentionner d'autres auteurs). - Terminez par un exemple concret illustrant l'idée de l'auteur. Texte : [[${prompt}]]`;
      case "ph_analysis_outline":
        return `Rédige le plan du developpement de l'explication de texte. L'explication est linéaire, c'est-à-dire que le devoir doit suivre l'ordre du texte. Chaque partie correspond à une partie de l'extrait, et à l'intérieur de la partie, les différentes explications particulières (des termes, des phrases en elles-mêmes) se succèdent comme dans le texte. Partez du plus large pour aller vers le plus précis : - Pour chaque partie, commencez par en donner l'idée principale. - Pour chaque phrase, donnez-en la fonction (postulat, explication, exemple...) et le contenu exprimé avec vos mots. Peut suivre une explication si la phrase est très complexe. - Expliquez les termes philosophiques de la phrase en donnant des définitions, et explicitez les sous-entendus, les références sous-jacentes (vous pouvez alors mentionner d'autres auteurs). - Terminez par un exemple concret illustrant l'idée de l'auteur. Texte : [[${prompt}]]`;
      case "table":
        return `Donne SEULEMENT le tableau HTML correspondant au sujet suivant (pas d'autre texte) : ${prompt}`;
      case "motivation-letter":
        return `Rédige la lettte de motivation : ${prompt}`;
      case "rephraser":
        return `Reformule le texte suivant : ${prompt}`;
      case "history_para":
        return `Rédige un paragraphe sur le sujet suivant : ${prompt}`;
      default:
        return prompt;
    }
  }
}

export function usingPlan(lng: "fr" | "en") {
  if (lng === "en") {
    return " using this outline: ";
  } else {
    return " en utilisant ce plan : ";
  }
}

export function getComplexEssayPrompts(
  part: number,
  outline: string | null,
  lng: "fr" | "en",
) {
  if (lng === "en") {
    return `ONLY write part ${part} using this outline (no intro nor conclusion): ${outline}`;
  } else {
    switch (part) {
      case 1:
        return `Rédige SEULEMENT la première grande partie (I) du plan (ne pas rédiger d'intro ni de conclusion et fait des phrases complètes) ${outline}`;
      case 2:
        return `Rédige SEULEMENT la deuxième grande partie (II) du plan (ne pas rédiger d'intro ni de conclusion et fait des phrases complètes) ${outline}`;
      case 3:
        return `Rédige SEULEMENT la troisième grande partie (III) du plan (ne pas rédiger d'intro ni de conclusion et fait des phrases complètes) ${outline}`;
      default:
        return `Rédige SEULEMENT la partie ${part} du plan ${outline}`;
    }
  }
}

export async function getModels() {
  return (
    await fetch("/api/models", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
  ).json();
}

export type Template = "para" | "email" | "blog" | "ideas";

export interface OpenAiOptions {
  topP: number;
  freqP: number;
  presP: number;
  temp: number;
}

export function getPromptComplexAnalysis(
  text: string,
  outline: string,
  template: string,
  lng: "fr" | "en",
): string {
  if (lng === "en") {
    switch (template) {
      case "ph_analysis_intro":
        return `Write ONLY the introduction of the text analysis using the following structure: introduction, presentation of the text's theme, problematic (on the one hand, on the other, therefore [question]), quick presentation of the author's thesis, announcement of the text's plan, using the provided outline. OUTLINE=[[${outline}]]\nTEXT=[[${text}]]`;
      case "ph_analysis_dev":
        return `Write the text explanation development (note that the intro and conclusion were previously written using the provided OUTLINE) using sentences, no list, don't show the different parts letters and numbers. The explanation is linear, i.e. the assignment must follow the order of the text. Each part corresponds to a part of the extract, and within the part, the various specific explanations (of terms, of sentences in themselves) follow one another as in the text. Start from the broadest to the most precise: - For each part, start by giving the main idea. - For each sentence, give its function (premise, explanation, example...) and content expressed in your own words. An explanation may follow if the sentence is very complex. - Explain the philosophical terms in the sentence by giving definitions, and make explicit any implied meaning or underlying references (you may wish to mention other authors). - End with a concrete example illustrating the author's idea. TEXT=[[${text}]]\nOUTLINE=[[${outline}]]`;
      case "ph_analysis_conclusion":
        return `Write ONLY the conclusion of the text analysis (which was based on the provided OUTLINE), recall the most the most important elements of the development, clearly explaining how the development showed how the author demonstrated his thesis. OUTLINE=[[${outline}]]\nTEXT=[[${text}]]`;
    }
  } else {
    switch (template) {
      case "ph_analysis_intro":
        return `Rédiger UNIQUEMENT l'introduction de l'analyse de texte selon la structure suivante (pas de développement) : amorce, présentation du thème du texte, problématique (paragraphe avec : d'une part, d'autre part, donc [question]), présentation très rapide en une phrase de la thèse de l'auteur, annonce du plan du texte, en utilisant le plan fourni. PLAN=[[${outline}]]\nTEXTE=[[${text}]]`;
      case "ph_analysis_dev":
        return `Rédiger UNIQUEMENT le développement de l'explication de texte (notez que l'introduction et la conclusion ont été rédigées au préalable à l'aide du schéma fourni) en utilisant des phrases, pas de liste, ne montrez pas les différentes parties sous forme de lettres et de chiffres. L'explication est linéaire, c'est-à-dire que le travail doit suivre l'ordre du texte. Chaque partie correspond à une partie de l'extrait, et à l'intérieur de la partie, les différentes explications spécifiques (des termes, des phrases en elles-mêmes) se succèdent comme dans le texte. Partez du plus large au plus précis : - Pour chaque partie, commencez par donner l'idée principale. - Pour chaque phrase, donnez sa fonction (prémisse, explication, exemple...) et son contenu exprimé avec vos propres mots. Une explication peut suivre si la phrase est très complexe. - Expliquez les termes philosophiques de la phrase en donnant des définitions, et explicitez les sous-entendus ou les références sous-jacentes (vous pouvez citer d'autres auteurs). - Terminez par un exemple concret illustrant l'idée de l'auteur. TEXTE=[[${text}]]\nPLAN=[[${outline}]]`;
      case "ph_analysis_conclusion":
        return `Rédiger UNIQUEMENT la conclusion de l'analyse du texte (qui était basée sur le PLAN fourni), en rappelant les éléments les plus importants du développement, en expliquant clairement comment le développement a montré comment l'auteur a démontré sa thèse. PLAN=[[${outline}]]\nTEXTE=[[${text}]]`;
    }
  }
  return "";
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatConversation {
  messages: ChatMessage[];
  name: string;
}
