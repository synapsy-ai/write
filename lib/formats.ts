const formats: Format[] = [
  {
    category: "regular-category",
    colorId: 0,
    options: [
      { text: "paragraph", val: "para" },
      { text: "email", val: "email" },
      { text: "blog-post", val: "blog" },
      { text: "ideas", val: "ideas" },
      { text: "table", val: "table" },
      { text: "motivation-letter", val: "motivation-letter" },
      { text: "rephraser", val: "rephraser" },
    ],
  },
  {
    category: "essay-global",
    colorId: 1,
    options: [
      { text: "essay-outline", val: "g_es_outline" },
      { text: "introduction", val: "g_es_intro" },
      { text: "conclusion", val: "g_es_conclusion" },
      { text: "essay-basic", val: "g_es_basic" },
      { text: "essay-complex", val: "g_es_complex" },
    ],
  },
  {
    category: "essay",
    colorId: 2,
    options: [
      { text: "essay-outline", val: "es_outline" },
      { text: "introduction", val: "es_intro" },
      { text: "conclusion", val: "es_conclusion" },
      { text: "essay-basic", val: "es_basic" },
      { text: "essay-complex", val: "es_complex" },
    ],
  },
  {
    category: "philosophy",
    colorId: 3,
    options: [
      { text: "essay-outline", val: "ph_outline" },
      { text: "ph-visual-outline", val: "ph_visual_outline" },
      { text: "introduction", val: "ph_intro" },
      { text: "problematization", val: "ph_prob" },
      { text: "conclusion", val: "ph_conclusion" },
      { text: "essay-basic", val: "ph_basic" },
      { text: "essay-complex", val: "ph_complex" },
    ],
  },
  {
    category: "text-philosophy",
    colorId: 4,
    options: [
      { text: "text-analysis-outline", val: "ph_analysis_outline" },
      { text: "text-analysis-introduction", val: "ph_analysis_intro" },
      { text: "text-analysis-dev", val: "ph_analysis_dev" },
      { text: "text-analysis-conclusion", val: "ph_analysis_conclusion" },
      { text: "text-analysis-basic", val: "ph_analysis_basic" },
      { text: "text-analysis-complex", val: "ph_analysis_complex" },
    ],
  },
  {
    category: "oral-presentation",
    colorId: 5,
    options: [
      { text: "essay-outline", val: "oral_outline" },
      { text: "introduction", val: "oral_intro" },
      { text: "conclusion", val: "oral_conclusion" },
      { text: "oral-basic", val: "oral_basic" },
    ],
  },
  {
    category: "history-format",
    colorId: 6,
    options: [{ text: "history-paragraph", val: "history_para" }],
  },
];
export default formats;

export interface Format {
  category: string;
  colorId: number;
  options: FormatOption[];
}
export interface FormatOption {
  text: string;
  val: string;
}

export function typesToString(type: string): string {
  if (type === "manual") return "manual";
  for (let i = 0; i < formats.length; i++) {
    for (let j = 0; j < formats[i].options.length; j++) {
      if (formats[i].options[j].val === type) {
        return formats[i].options[j].text;
      }
    }
  }
  return type;
}

export const tones = [
  "tones-none",
  "tones-professional",
  "tones-casual",
  "tones-enthusiastic",
  "tones-informative",
  "tones-funny",
];

export interface OutlineItem {
  name: string;
  child: string[];
}
