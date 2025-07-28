"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Post = {
  filename: string;
  title: string;
  description: string;
  date: Date;
};

type PostWithSpan = {
  item: Post;
  span: number;
};

const TOTAL_COLS=6
const VALID_SPANS = [2, 3, 4, 6]; // valid sm spans that sum up to 6 cols

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

const VALID_COMBINATIONS = findValidCombinations(VALID_SPANS, TOTAL_COLS);

function weightedRandomCombo(combos: number[][]): number[] {
  const firstSpans = combos.map(c => c[0]);
  const mu = firstSpans.reduce((a, b) => a + b, 0) / firstSpans.length;
  const sigma = 1; // adjust for desired tapering

  const weights = firstSpans.map(x => Math.exp(-((x - mu) ** 2) / (2 * sigma ** 2)));

  const weightSum = weights.reduce((a, b) => a + b, 0);
  const probs = weights.map(w => w / weightSum);

  const random = Math.random();
  let cumulative = 0;

  for (let i = 0; i < combos.length; i++) {
    cumulative += probs[i];
    if (random < cumulative) return combos[i];
  }

  return combos[0]; // fallback
}

function assignResponsiveSpans(posts: Post[]): PostWithSpan[] {
  const results: PostWithSpan[] = [];
let remainingCount = posts.length;
    let index =0;
    while(remainingCount != 0){
        // get random line
        const random_comb = weightedRandomCombo(VALID_COMBINATIONS);
        for(let i=0;i<random_comb.length;i++){
            if(remainingCount == 0){
            break;
            }
            results.push({ item: posts[index], span:random_comb[i] })

            index++;
            remainingCount--;
        }
    }

  return results;
}



export default function BlogList() {
  const [postsWithSpans, setPostsWithSpans] = useState<
    { item: Post; span: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const res = await fetch("/api/blog");
      const data: Post[] = await res.json();
      const withSpans = assignResponsiveSpans(data);
      setPostsWithSpans(withSpans);
      setLoading(false);
    }
    fetchPosts();
  }, []);

    const SPAN_MAP = {
        2: "sm:col-span-2 lg:col-span-4",
        3: "sm:col-span-3 lg:col-span-6",
        4: "sm:col-span-4 lg:col-span-8",
        6: "sm:col-span-6 lg:col-span-12",
    };

    type SpanKey = keyof typeof SPAN_MAP; // "2" | "3" | "4" | "6"

  if (loading) {
    return <p className="text-zinc-400 italic text-center">Loading posts...</p>;
  }

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-6 lg:grid-cols-12 gap-6 max-w-7xl w-full px-4">
        {postsWithSpans.map(({ item, span }) => (
          <Link
            href={`/blog/${item.filename}`}
            key={item.filename}
            className={`w-full ${SPAN_MAP[span as SpanKey]}`}
          >
            <div className="h-full bg-zinc-900 border border-zinc-700 rounded-xl p-6 shadow-md hover:shadow-lg hover:border-teal-500 transition">
              <h2 className="text-xl font-semibold text-zinc-100 hover:text-teal-400 transition-colors">
                {item.title}
              </h2>
              <p className="text-sm text-zinc-400 mt-2 line-clamp-3">
                {item.description}
              </p>
              <p className="text-xs text-zinc-500 mt-4 italic">
                {new Date(item.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <p className="text-sm text-zinc-400 mt-2 line-clamp-3">
                Read more &rarr;
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}


