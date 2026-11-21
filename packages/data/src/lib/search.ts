/* Client-safe search helpers (no catalogue imports): synonyms + weighted relevance. */

/** Each group lists interchangeable shopper words. Matching any word matches the whole group. */
const SYNONYM_GROUPS: string[][] = [
  ["fridge", "refrigerator", "refrigerators", "freezer"],
  ["tv", "television", "televisions", "telly", "smart tv", "led tv"],
  ["ac", "air conditioner", "air conditioners", "aircon", "split ac", "cooler"],
  ["sofa", "sofas", "couch", "settee", "loveseat", "sectional"],
  ["wardrobe", "wardrobes", "almirah", "cupboard", "closet"],
  ["washing machine", "washer", "washing machines", "laundry"],
  ["microwave", "oven", "otg"],
  ["mixer", "mixie", "grinder", "mixer grinder", "blender", "juicer"],
  ["purifier", "air purifier", "hepa"],
  ["lamp", "light", "lighting", "pendant"],
  ["rug", "rugs", "carpet", "dhurrie", "kilim"],
  ["bed", "beds", "cot", "bedframe"],
  ["chair", "chairs", "seat", "armchair"],
  ["desk", "study table", "work table", "workstation"],
  ["dishwasher", "dish washer"],
  ["cushion", "cushions", "pillow", "throw"],
  ["vase", "planter", "pot"],
];

export function normaliseSearch(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Expands a query into term groups: every group must match; any alternative in a group may match. */
export function expandQuery(query: string): string[][] {
  const q = normaliseSearch(query);
  if (!q) return [];
  const groups: string[][] = [];
  let rest = ` ${q} `;
  // Multi-word synonyms first ("washing machine", "air conditioner").
  for (const g of SYNONYM_GROUPS) {
    for (const w of [...g].sort((a, b) => b.length - a.length)) {
      if (w.includes(" ") && rest.includes(` ${w} `)) {
        groups.push(g);
        rest = rest.replace(` ${w} `, " ");
        break;
      }
    }
  }
  for (const t of rest.split(" ").filter(Boolean)) {
    const g = SYNONYM_GROUPS.find((grp) => grp.includes(t));
    groups.push(g ?? [t]);
  }
  return groups;
}

function wordMatch(hay: string, term: string) {
  // Word-prefix match ("sof" → "sofa"); short terms (≤ 3 chars, e.g. "ac", "tv") must be whole words
  // so "ac" doesn't match "accent" or "black".
  const t = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(term.length <= 3 ? `(^|\\s)${t}(\\s|$)` : `(^|\\s)${t}`).test(hay);
}

export interface SearchFields {
  name: string;
  /** Category / kind / brand words. */
  keywords: string;
  /** Long text: description, tags, materials. */
  body?: string;
}

/**
 * Relevance score, or -1 when any query group is missing. Name matches weigh most, then
 * category/brand keywords, then body text. Results with a zero score are not matches.
 */
export function scoreSearch(query: string | string[][], f: SearchFields): number {
  const groups = typeof query === "string" ? expandQuery(query) : query;
  if (groups.length === 0) return 0;
  const name = ` ${normaliseSearch(f.name)} `;
  const kw = ` ${normaliseSearch(f.keywords)} `;
  const body = ` ${normaliseSearch(f.body ?? "")} `;
  let score = 0;
  for (const g of groups) {
    let best = 0;
    for (const term of g) {
      if (wordMatch(name, term)) best = Math.max(best, 6);
      else if (wordMatch(kw, term)) best = Math.max(best, 4);
      else if (term.length >= 4 && wordMatch(body, term)) best = Math.max(best, 1);
    }
    if (best === 0) return -1;
    score += best;
  }
  return score;
}
