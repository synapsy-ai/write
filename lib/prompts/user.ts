export const userPrompts: {
  [key: string]: {
    [key: string]: string;
  };
} = {
  en: {
    para: "Generate a paragraph about [[PROMPT]]",
    blog: "Generate a blog post about [[PROMPT]]",
    email: "Generate an email about [[PROMPT]]",
    ideas:
      'Generate a JSON array of ideas ["Idea1","Idea2"] (EXACTLY THIS FORMAT, no object) about this topic: [[PROMPT]]',
    es_intro:
      "Write the introduction (hook, presentation of the subject, problem statement, and plan announcement) for the following topic: [[PROMPT]]",
    es_conclusion:
      "Write the conclusion (with an opening) for the following topic: [[PROMPT]]",
    es_outline:
      "Write only the outline of the essay organized in three main parts (I, II, III etc.) each containing at least two subparts containing examples/quotes (A, B, etc.) for the following topic: [[PROMPT]]",
    es_basic:
      "Write the introduction (introduction, presentation of the subject, issues and outline), the content of the essay organized into at least two main parts (I, II, III etc.) each containing at least two sub-parts (A, B, etc.) (with quotations), and the conclusion of the following subject: [[PROMPT]]",
    g_es_intro:
      "Write the introduction (hook, presentation of the subject, problem statement, and plan announcement) for the following topic: [[PROMPT]]",
    g_es_conclusion:
      "Write the conclusion, that resumes what you said in the essay (with an opening) for the following topic: [[PROMPT]]",
    g_es_outline:
      "Write only the outline of the essay organized in three main parts (I, II, III etc.) each containing at least two subparts with arguments, examples, numbers, stats, quotes (depending on context) for the following topic: [[PROMPT]]",
    ph_intro:
      "Write the introduction to the subject essay, including a hook, a provisional and QUICK definition of the main terms, a problem statement with three paragraphs (On the one hand..., on the other hand..., therefore...), the issues (explaining why this question is being answered), and the plan (Nature, Existence, Value OR Meaning 1, meaning 2, meaning 3). Subject: [[PROMPT]]",
    ph_prob:
      'Write the problematization of the subject with three paragraphs MAX containing two sentences MAX, the first begins imperatively with "on the one hand", the second with "on the other hand" and the third with "therefore". Structure: 1st paragraph: first answer [R1] based on the analysis of the subject\'s concepts. 2nd paragraph: questioning of the first answer. 3rd paragraph: summary [S] of the problem with a question that clearly formulates the fundamental alternative: "R1 or R2?". Bold the ideas. Subject: [[PROMPT]]',
    ph_outline:
      "Write the essay plan (no intro or conclusion, only the essay plan); Structure: Nature plan (=in theory), Existence plan (=in practice), Value plan (=morally). Subject: [[PROMPT]]",
    ph_visual_outline:
      "Write the essay outline of the following subject, without introduction and conclusion: [[PROMPT]]",
    ph_conclusion:
      "Write the essay conclusion, which should summarize the essay and include an opening. Subject: [[PROMPT]]",
    ph_basic:
      "Write the introduction (introduction, presentation of the subject, issues and outline), the content of the essay organized into at least three main parts (I, II, III etc.) each containing at least two sub-parts (A, B, etc.) (with examples from life, philosophers), and the conclusion of the following subject: [[PROMPT]]",
    ph_analysis_intro: `Write ONLY the introduction of the text analysis using the following structure: introduction, presentation of the text's theme, problematic (on the one hand, on the other, therefore [question]), quick presentation of the author's thesis, announcement of the text's plan, using the provided outline. OUTLINE=[[outline]]\nTEXT=[[PROMPT]]`,
    ph_analysis_dev: `Write the text explanation development (note that the intro and conclusion were previously written using the provided OUTLINE) using sentences, no list, don't show the different parts letters and numbers. The explanation is linear, i.e. the assignment must follow the order of the text. Each part corresponds to a part of the extract, and within the part, the various specific explanations (of terms, of sentences in themselves) follow one another as in the text. Start from the broadest to the most precise: - For each part, start by giving the main idea. - For each sentence, give its function (premise, explanation, example...) and content expressed in your own words. An explanation may follow if the sentence is very complex. - Explain the philosophical terms in the sentence by giving definitions, and make explicit any implied meaning or underlying references (you may wish to mention other authors). - End with a concrete example illustrating the author's idea. TEXT=[[PROMPT]]\nOUTLINE=[[outline]]`,
    ph_analysis_conclusion: `Write ONLY the conclusion of the text analysis (which was based on the provided OUTLINE), recall the most the most important elements of the development, clearly explaining how the development showed how the author demonstrated his thesis. OUTLINE=[[outline]]\nTEXT=[[PROMPT]]`,
    ph_analysis_basic:
      "Write the text analysis with Introduction, Development and Conclusion. Use the provided structures. Introduction structure: introduction, presentation of the text's theme, problematic (on the one hand, on the other, therefore), presentation of the author's thesis, announcement of the text's plan, using the author's arguments for each part. Development structure: The explanation is linear, i.e. the assignment must follow the order of the text. Each part corresponds to a part of the extract, and within the part, the various particular explanations (of terms, of sentences in themselves) follow one another as in the text. - For each part, start by giving the main idea. - For each sentence, give its function (premise, explanation, example...) and content, expressed in your own words. An explanation may follow if the sentence is very complex. - Explain the philosophical terms in the sentence, giving definitions, and explain underlying references (you may wish to mention other authors). End with a concrete example illustrating the author's idea. Conclusion structure: recall the most the most important elements of the development, clearly explaining how the development showed how the author demonstrated his thesis. Text: [[PROMPT]]",
    ph_analysis_outline:
      "Write the outline of the text explanation. The explanation is linear, i.e. the assignment must follow the order of the text. Each part corresponds to a part of the extract, and within the part, the various specific explanations (of terms, of sentences in themselves) follow one another as in the text. Start from the broadest to the most precise: - For each part, start by giving the main idea. - For each sentence, give its function (premise, explanation, example...) and content expressed in your own words. An explanation may follow if the sentence is very complex. - Explain the philosophical terms in the sentence by giving definitions, and make explicit any implied meaning or underlying references (you may wish to mention other authors). - End with a concrete example illustrating the author's idea. Text: [[PROMPT]]",
    table:
      "Give ONLY the corresponding HTML Table about (no other text): [[PROMPT]]",
    "motivation-letter": "Write the motivation letter: [[PROMPT]]",
    rephraser: "Rephrase the following text: [[PROMPT]]",
    history_para:
      "Write a paragraph in history about the following subject: [[PROMPT]]",
    oral_intro:
      "Write the introduction for the oral presentation's subject, including a hook, present the orator and the subject, the problematic (explaining why this question is being answered), and the outline. Subject: [[PROMPT]]",
    oral_outline:
      "Draw up an outline for your oral presentation. Structure: Main sections with sub-sections, links to concepts. Length of presentation: 10 minutes. Subject: [[PROMPT]]",
    oral_conclusion:
      "Write the oral presentation conclusion, which should summarize the presentation and include an opening. Subject: [[PROMPT]]",
    oral_basic:
      "Write the introduction (introduction, presentation of the orator and outline), the developed content of the oral presentation organized into parts (I, II, III etc.) each sub-parts (A, B, etc.), and the conclusion of the subject. Each part and sub-parts must be completely written. Subject: [[PROMPT]]",
  },
  fr: {
    para: "Générer un paragraphe sur [[PROMPT]]",
    blog: "Génère un article de blog sur [[PROMPT]]",
    email: "Générer un email à propos de [[PROMPT]]",
    ideas:
      'Générer un array d\'idées JSON ["Idee1","Idee2"] (EXACTEMENT CE FORMAT, pas d\'objet) sur le sujet : [[PROMPT]]',
    es_intro:
      "Rédige l'introduction (amorce, présentation du sujet, problématique et annonce du plan) du sujet suivant : [[PROMPT]]",
    es_conclusion:
      "Rédige la conclusion (avec ouverture) du sujet suivant : [[PROMPT]]",
    es_outline:
      "Rédige uniquement le plan de la dissertation organisé en trois grandes parties (I, II, III etc.) contenant chacune au moins deux sous-parties contenant des exemples/citations (A, B, etc.) du sujet suivant : [[PROMPT]]",
    es_basic:
      "Rédige l'introduction (amorce, présentation du sujet, problématique et annonce du plan), le contenu de la dissertation organisé en au moins deux grandes parties (I, II, III etc.) contenant chacune au moins deux sous-parties (A, B, etc.) (avec des citations) et la conclusion du sujet suivant : [[PROMPT]]",
    g_es_intro:
      "Rédige l'introduction (amorce, présentation du sujet, problématique et annonce du plan) du sujet suivant : [[PROMPT]]",
    g_es_conclusion:
      "Rédige la conclusion (avec ouverture) du sujet suivant : [[PROMPT]]",
    g_es_outline:
      "Rédige uniquement le plan de la dissertation organisé en trois grandes parties (I, II, III etc.) contenant chacune au moins deux sous-parties avec arguments, exemples, chiffres, stats, citations (selon contexte) du sujet suivant : [[PROMPT]]",
    ph_intro:
      "Rédige l'introduction de la dissertation, comprenant une accroche, une définition des termes, une problématisation en trois paragraphes (D'une part..., d'autre part..., donc...), la problématique (expliquant pourquoi cette question se pose) et le plan (Nature, Existence, Valeur OU Sens 1, sens 2, sens 3). Sujet : [[PROMPT]]",
    ph_prob:
      'Rédige la problématique du sujet en trois paragraphes MAXIMUM de deux phrases MAXIMUM, la première débutant impérativement par "d\'une part", la deuxième par "d\'autre part" et la troisième par "donc". Structure: 1er paragraphe: première réponse [R1] fondée sur l\'analyse des concepts du sujet. 2ème paragraphe: remise en cause de la première réponse. 3ème paragraphe: synthèse [S] du problème avec une question formulant clairement l\'alternative fondamentale: "R1 ou R2?". Met en gras les idées. Sujet : [[PROMPT]]',
    ph_outline:
      "Rédige le plan de dissertation (pas d'intro ni de conclusion, uniquement le plan de dissertation); Structure: Plan de la Nature (=en théorie), Plan de l'Existence (=en pratique), Plan de la Valeur (=moralement). Sujet : [[PROMPT]]",
    ph_visual_outline:
      "Rédige le plan détaillé de la dissertation du sujet suivant, sans introduction ni conclusion: [[PROMPT]]",
    ph_conclusion:
      "Rédige la conclusion de la dissertation, qui résume la dissertation et inclut une ouverture. Sujet : [[PROMPT]]",
    ph_basic:
      "Rédige l'introduction (accroche, présentation du sujet, problématique et annonce du plan), le contenu de la dissertation organisé en au moins trois grandes parties (I, II, III etc.) contenant chacune au moins deux sous-parties (A, B, etc.) (avec des exemples de la vie, des philosophes), et la conclusion du sujet suivant : [[PROMPT]]",
    ph_analysis_intro: `Rédiger UNIQUEMENT l'introduction de l'analyse de texte selon la structure suivante (pas de développement) : amorce, présentation du thème du texte, problématique (paragraphe avec : d'une part, d'autre part, donc [question]), présentation très rapide en une phrase de la thèse de l'auteur, annonce du plan du texte, en utilisant le plan fourni. PLAN=[[outline]]\nTEXT=[[PROMPT]]`,
    ph_analysis_dev: `Rédiger UNIQUEMENT le développement de l'explication de texte (notez que l'introduction et la conclusion ont été rédigées au préalable à l'aide du schéma fourni) en utilisant des phrases, pas de liste, ne montrez pas les différentes parties sous forme de lettres et de chiffres. L'explication est linéaire, c'est-à-dire que le travail doit suivre l'ordre du texte. Chaque partie correspond à une partie de l'extrait, et à l'intérieur de la partie, les différentes explications spécifiques (des termes, des phrases en elles-mêmes) se succèdent comme dans le texte. Partez du plus large au plus précis : - Pour chaque partie, commencez par donner l'idée principale. - Pour chaque phrase, donnez sa fonction (prémisse, explication, exemple...) et son contenu exprimé avec vos propres mots. Une explication peut suivre si la phrase est très complexe. - Expliquez les termes philosophiques de la phrase en donnant des définitions, et explicitez les sous-entendus ou les références sous-jacentes (vous pouvez citer d'autres auteurs). - Terminez par un exemple concret illustrant l'idée de l'auteur. TEXT=[[PROMPT]]\nPLAN=[[outline]]`,
    ph_analysis_conclusion: `Rédiger UNIQUEMENT la conclusion de l'analyse du texte (qui était basée sur le PLAN fourni), en rappelant les éléments les plus importants du développement, en expliquant clairement comment le développement a montré comment l'auteur a démontré sa thèse. PLAN=[[outline]]\nTEXT=[[PROMPT]]`,
    ph_analysis_basic:
      "Rédige l'explication de texte avec Introduction, Développement et Conclusion. Utilise les structures fournies. Structure d'introduction: amorce, présentation du thème du texte, problématique (d'une part, d'autre part, donc), présentation de la thèse de l'auteur, annonce du plan du texte, en utilisant les arguments de l'auteur pour chaque partie. Structure de développement : L'explication est linéaire, c'est-à-dire que la dissertation doit suivre l'ordre du texte. Chaque partie correspond à une partie de l'extrait, et au sein de la partie, les diverses explications particulières (des termes, des phrases en elles-mêmes) se suivent comme dans le texte. - Pour chaque partie, commencez par donner l'idée principale. - Pour chaque phrase, donner sa fonction (prémisse, explication, exemple...) et son contenu, exprimé dans vos propres mots. Une explication peut suivre si la phrase est très complexe. - Expliquez les termes philosophiques de la phrase, en donnant des définitions, et expliquez les références sous-jacentes (vous pouvez mentionner d'autres auteurs). Terminez par un exemple concret illustrant l'idée de l'auteur. Structure de conclusion : rappelant les éléments les plus importants du développement, expliquant clairement comment le développement a montré comment l'auteur a démontré sa thèse. Texte : [[PROMPT]]",
    ph_analysis_outline:
      "Rédige le plan de l'explication de texte. L'explication est linéaire, c'est-à-dire que la dissertation doit suivre l'ordre du texte. Chaque partie correspond à une partie de l'extrait, et au sein de la partie, les diverses explications particulières (des termes, des phrases en elles-mêmes) se suivent comme dans le texte. Commencez par le plus général et terminez par le plus précis : - Pour chaque partie, commencez par donner l'idée principale. - Pour chaque phrase, donner sa fonction (prémisse, explication, exemple...) et son contenu exprimé dans vos propres mots. Une explication peut suivre si la phrase est très complexe. - Expliquez les termes philosophiques de la phrase en donnant des définitions, et explicitez toute signification implicite ou références sous-jacentes (vous pouvez mentionner d'autres auteurs). - Terminez par un exemple concret illustrant l'idée de l'auteur. Texte : [[PROMPT]]",
    table: "Donnez UNIQUEMENT le tableau HTML correspondant à : [[PROMPT]]",
    "motivation-letter": "Rédige la lettre de motivation: [[PROMPT]]",
    rephraser: "Reformule le texte suivant: [[PROMPT]]",
    history_para:
      "Rédige un paragraphe en histoire sur le sujet suivant : [[PROMPT]]",
    oral_intro:
      "Rédige l'introduction du sujet de présentation orale, en comprenant une accroche, présente l'orateur et le sujet, la problématique (expliquant pourquoi cette question se pose) et le plan. Sujet : [[PROMPT]]",
    oral_outline:
      "Dressez un plan pour votre présentation orale. Structure : Sections principales avec sous-sections, liens avec concepts. Durée de la présentation : 10 minutes. Sujet : [[PROMPT]]",
    oral_conclusion:
      "Rédige la conclusion de la présentation orale, qui doit résumer la présentation et inclure une ouverture. Sujet : [[PROMPT]]",
    oral_basic:
      "Rédige l'introduction (introduction, présentation de l'orateur et annonce du plan), le contenu développé de la présentation orale organisée en parties (I, II, III etc.) chacune en sous-parties (A, B, etc.), et la conclusion du sujet. Chaque partie et sous-partie doit être complètement rédigée. Sujet : [[PROMPT]]",
  },
  es: {
    para: "Generar un párrafo sobre [[PROMPT]]",
    blog: "Generar un post de blog sobre [[PROMPT]]",
    email: "Generar un correo electrónico sobre [[PROMPT]]",
    ideas:
      'Generar una matriz JSON de ideas ["Idea1","Idea2"] (EXACTAMENTE ESTE FORMATO, no objeto) sobre este tema: [[PROMPT]]',
    es_intro:
      "Escribe la introducción (enganche, presentación del tema, planteamiento del problema y anuncio del plan) sobre el tema: [[PROMPT]]",
    es_conclusion:
      "Escribe la conclusión (con apertura) del siguiente tema: [[PROMPT]]",
    es_outline:
      "Escribe sólo el esquema de la disertación organizado en tres partes principales (I, II, III, etc.) cada una de ellas con al menos dos subapartados que contengan ejemplos/citas (A, B, etc.) sobre el siguiente tema: [[PROMPT]]",
    es_basic:
      "Escribe la introducción (enganche, presentación del tema, planteamiento del problema y anuncio del plan), el contenido de la disertación organizado en al menos dos partes principales (I, II, III, etc.) cada una de ellas con al menos dos subapartados (A, B, etc.) (con citas) y la conclusión del siguiente tema: [[PROMPT]]",
    g_es_intro:
      "Escribe la introducción (enganche, presentación del tema, planteamiento del problema y anuncio del plan) sobre el tema: [[PROMPT]]",
    g_es_conclusion:
      "Escribe la conclusión (con apertura) sobre el tema: [[PROMPT]]",
    g_es_outline:
      "Escribe sólo el esquema de la disertación organizado en tres partes principales (I, II, III, etc.) cada una de ellas con al menos dos subapartados con argumentos, ejemplos, cifras, estadísticas, citas (dependiendo del contexto) sobre el tema: [[PROMPT]]",
    ph_intro:
      "Escribe la introducción de la disertación, incluyendo un gancho, una definición de términos, un planteamiento del problema en tres párrafos (Por una parte..., por otra parte..., por tanto...), el planteamiento del problema (explicando por qué surge esta pregunta) y el esquema (Naturaleza, Existencia, Valor O Sentido 1, sentido 2, sentido 3). Tema: [[PROMPT]]",
    ph_prob:
      'Escribe la declaración del problema en un máximo de tres párrafos de un máximo de dos frases cada uno, comenzando la primera con "por una parte", la segunda con "por otra parte" y la tercera con "por tanto". Estructura: 1er párrafo: primera respuesta [R1] basada en el análisis de los conceptos del tema. Segundo párrafo: cuestionamiento de la primera respuesta. Tercer párrafo: síntesis [S] del problema con una pregunta formulando claramente la alternativa fundamental: "¿R1 o R2?". Enfatiza las ideas. Tema: [[PROMPT]]',
    ph_outline:
      "Escribe el esquema de la disertación (sin introducción ni conclusión, sólo el esquema de la disertación); Estructura: Esquema de la Naturaleza (=en teoría), Esquema de la Existencia (=en práctica), Esquema del Valor (=moralmente). Tema: [[PROMPT]]",
    ph_visual_outline:
      "Escribe el esquema detallado de la disertación sobre el siguiente tema, sin introducción ni conclusión: [[PROMPT]]",
    ph_conclusion:
      "Escribe la conclusión de la disertación, que resume la disertación e incluye una apertura. Tema: [[PROMPT]]",
    ph_basic:
      "Escribe la introducción (gancho, presentación del tema, planteamiento del problema y anuncio del plan), el contenido de la disertación organizado en al menos tres partes principales (I, II, III, etc.) cada una de ellas con al menos dos subapartados (A, B, etc.) (con ejemplos de la vida, filósofos) y la conclusión del siguiente tema: [[PROMPT]]",
    ph_analysis_intro: `Redactar ÚNICAMENTE la introducción del análisis de texto siguiendo la siguiente estructura (sin desarrollo): introducción, presentación del tema del texto, problemática (párrafo con: por un lado, por otro lado, entonces [pregunta]), presentación muy rápida en una frase de la tesis del autor, anuncio del esquema del texto, utilizando el esquema proporcionado. ESQUEMA=[[outline]]\nTEXTO=[[PROMPT]]`,
    ph_analysis_dev: `Redactar ÚNICAMENTE el desarrollo de la explicación del texto (tenga en cuenta que la introducción y la conclusión ya han sido redactadas previamente utilizando el esquema proporcionado) usando frases, sin listas, no muestre las diferentes partes en forma de letras y números. La explicación es lineal, es decir, el trabajo debe seguir el orden del texto. Cada parte corresponde a una parte del extracto, y dentro de la parte, las diferentes explicaciones específicas (de términos, frases en sí mismas) se suceden como en el texto. Empiece de lo más amplio a lo más preciso: - Para cada parte, comience dando la idea principal. - Para cada frase, indique su función (premisa, explicación, ejemplo...) y su contenido expresado con sus propias palabras. Puede seguir una explicación si la frase es muy compleja. - Explique los términos filosóficos de la frase dando definiciones, y aclare las implicaciones o referencias subyacentes (puede citar otros autores). - Termine con un ejemplo concreto que ilustre la idea del autor. TEXTO=[[PROMPT]]\nESQUEMA=[[outline]]`,
    ph_analysis_conclusion: `Redactar ÚNICAMENTE la conclusión del análisis del texto (que se basó en el ESQUEMA proporcionado), recordando los elementos más importantes del desarrollo, explicando claramente cómo el desarrollo ha mostrado cómo el autor demostró su tesis. ESQUEMA=[[outline]]\nTEXTO=[[PROMPT]]`,
    ph_analysis_basic:
      "Escribe el análisis del texto con Introducción, Desarrollo y Conclusión. Utiliza las estructuras proporcionadas. Estructura de la introducción: gancho, presentación del tema del texto, planteamiento del problema (por una parte, por otra parte, por tanto), presentación de la tesis del autor, anuncio del esquema del texto, utilizando los argumentos del autor para cada parte. Estructura de desarrollo: La explicación es lineal, es decir, la disertación debe seguir el orden del texto. Cada parte corresponde a una parte del extracto, y dentro de la parte, las diversas explicaciones particulares (de términos, frases en sí mismas) se siguen como en el texto. - Para cada parte, comienza dando la idea principal. - Para cada frase, da su función (premisa, explicación, ejemplo...) y su contenido, expresado con tus propias palabras. Puede seguir una explicación si la frase es muy compleja. - Explica los términos filosóficos de la frase, dando definiciones, y explica las referencias subyacentes (puedes mencionar a otros autores). Termina con un ejemplo concreto que ilustre la idea del autor. Estructura de conclusión: recordando los elementos más importantes del desarrollo, explicando claramente cómo el desarrollo ha mostrado cómo el autor ha demostrado su tesis. Texto: [[PROMPT]]",
    ph_analysis_outline:
      "Escribe el esquema del análisis del texto. La explicación es lineal, es decir, la disertación debe seguir el orden del texto. Cada parte corresponde a una parte del extracto, y dentro de la parte, las diversas explicaciones particulares (de términos, frases en sí mismas) se siguen como en el texto. Comienza con lo más general y termina con lo más específico: - Para cada parte, comienza dando la idea principal. - Para cada frase, da su función (premisa, explicación, ejemplo...) y su contenido expresado con tus propias palabras. Puede seguir una explicación si la frase es muy compleja. - Explica los términos filosóficos de la frase, dando definiciones, y explica cualquier significado implícito o referencia subyacente (puedes mencionar a otros autores). - Termina con un ejemplo concreto que ilustre la idea del autor. Texto: [[PROMPT]]",
    table: "Dar SOLO la tabla HTML para: [[PROMPT]]",
    "motivation-letter": "Escribe la carta de motivación: [[PROMPT]]",
    rephraser: "Reformula el siguiente texto: [[PROMPT]]",
    history_para:
      "Escribe un párrafo sobre historia sobre el siguiente tema: [[PROMPT]]",
    oral_intro:
      "Escribe la introducción del tema de la presentación oral, incluyendo un gancho, presenta al orador y el tema, el planteamiento del problema (explicando por qué surge esta pregunta) y el esquema. Tema: [[PROMPT]]",
    oral_outline:
      "Haz un esquema para tu presentación oral. Estructura: Secciones principales con subsecciones, enlaces a conceptos. Duración de la presentación: 10 minutos. Tema: [[PROMPT]]",
    oral_conclusion:
      "Escribe la conclusión de la presentación oral, que debe resumir la presentación e incluir una apertura. Tema: [[PROMPT]]",
    oral_basic:
      "Escribe la introducción (introducción, presentación del orador y anuncio del esquema), el contenido desarrollado de la presentación oral organizado en partes (I, II, III, etc.) cada una en subsecciones (A, B, etc.), y la conclusión sobre el tema. Cada parte y subsección debe estar completamente escrita. Tema: [[PROMPT]]",
  },
};
