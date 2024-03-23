const formats = [
  {
    category: "regular-category",
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
    category: "essay",
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
    options: [
      { text: "text-analysis-outline", val: "ph_analysis_outline" },
      { text: "text-analysis-introduction", val: "ph_analysis_intro" },
      { text: "text-analysis-dev", val: "ph_analysis_dev" },
      { text: "text-analysis-conclusion", val: "ph_analysis_conclusion" },
      { text: "text-analysis-basic", val: "ph_analysis_basic" },
      { text: "text-analysis-complex", val: "ph_analysis_complex" },
    ],
  },
];
export default formats;

export function typesToString(type: string): string {
  for (let i = 0; i < formats.length; i++) {
    for (let j = 0; j < formats[i].options.length; j++) {
      if (formats[i].options[j].val === type) {
        return formats[i].options[j].text;
      }
    }
  }
  return "";
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
