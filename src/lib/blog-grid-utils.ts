import { BlogPostMeta } from '@/lib/blog'; 

export type PostWithSpan = {
  item: BlogPostMeta;
  span: number;
};

// Constants
export const TOTAL_COLS = 6;
export const VALID_SPANS = [2, 3, 4, 6]; // valid sm spans that sum up to 6 cols
export const SPAN_MAP = {
    2: "sm:col-span-2 lg:col-span-4",
    3: "sm:col-span-3 lg:col-span-6",
    4: "sm:col-span-4 lg:col-span-8",
    6: "sm:col-span-6 lg:col-span-12",
};
export type SpanKey = keyof typeof SPAN_MAP;


function findValidCombinations(
  spans: number[],
  total: number
): number[][] {
  const results: number[][] = [];
  function backtrack(remaining: number, combo: number[]) {
    if (remaining === 0) {
      results.push([...combo]);
      return;
    }
    if (remaining < 0) return;

    for (let i = 0; i < spans.length; i++) {
      combo.push(spans[i]);
      backtrack(remaining - spans[i], combo);
      combo.pop();
    }
  }

  backtrack(total, []);
  return results;
}

export const VALID_COMBINATIONS = findValidCombinations(VALID_SPANS, TOTAL_COLS);

function weightedRandomCombo(combos: number[][]): number[] {
  const firstSpans = combos.map(c => c[0]);
  const mu = firstSpans.reduce((a, b) => a + b, 0) / firstSpans.length;
  const sigma = 1;

  const weights = firstSpans.map(x => Math.exp(-((x - mu) ** 2) / (2 * sigma ** 2)));

  const weightSum = weights.reduce((a, b) => a + b, 0);
  const probs = weights.map(w => w / weightSum);

  const random = Math.random();
  let cumulative = 0;

  for (let i = 0; i < combos.length; i++) {
    cumulative += probs[i];
    if (random < cumulative) return combos[i];
  }

  return combos[0];
}

export function assignResponsiveSpans(posts: BlogPostMeta[]): PostWithSpan[] {
  const results: PostWithSpan[] = [];
  let remainingCount = posts.length;
  let index = 0;

  while(remainingCount > 0){
    const random_comb = weightedRandomCombo(VALID_COMBINATIONS);
    for(let i = 0; i < random_comb.length; i++){
      if(remainingCount === 0){
        break;
      }
      results.push({ item: posts[index], span: random_comb[i] })
      index++;
      remainingCount--;
    }
  }

  return results;
}
