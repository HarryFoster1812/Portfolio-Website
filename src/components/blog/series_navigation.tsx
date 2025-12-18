
"use client";

import { memo, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BlogPostMeta } from "@/lib/blog";

interface SeriesNavigationProps {
  meta: BlogPostMeta;
}

interface SeriesMetaData {
  filename: string;
  title: string;
  description: string;
  date: string;
  series: {
    part: number;
  };
}

const truncate = (text: string, max = 40) =>
  text.length > max ? text.slice(0, max) + "…" : text;


const SkeletonNav = ({ align = "left" }: { align?: "left" | "right" }) => (
  <div className={`p-5 ${align === "right" ? "text-right" : ""}`}>
    <div
      className={`mb-2 h-2 w-20 animate-pulse rounded bg-neutral-800 ${
        align === "right" ? "ml-auto" : ""
      }`}
    />
    <div
      className={`h-4 w-3/4 animate-pulse rounded bg-neutral-700 ${
        align === "right" ? "ml-auto" : ""
      }`}
    />
  </div>
);

const SeriesNavigation = ({ meta }: SeriesNavigationProps) => {
  const [seriesList, setSeriesList] = useState<SeriesMetaData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const currentPart = meta.series?.part;

  useEffect(() => {
    if (!meta.series?.name) return;

    const fetchSeries = async () => {
      try {
        const res = await fetch(
          `/api/blog/series/${encodeURIComponent(meta.series!.name)}`
        );
        const data: SeriesMetaData[] = await res.json();
        setSeriesList(data);
      } catch (err) {
        console.error("Failed to load series data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
  }, [meta.series?.name]);

  const { prev, next, total } = useMemo(() => {
    if (!seriesList || currentPart == null) {
      return {
        prev: null,
        next: null,
        total: "—",
      };
    }

    const index = seriesList.findIndex(
      (p) => p.series.part === currentPart
    );

    return {
      prev: index > 0 ? seriesList[index - 1] : null,
      next: index < seriesList.length - 1 ? seriesList[index + 1] : null,
      total: seriesList.length,
    };
  }, [seriesList, currentPart]);

  return (
    <div className="mt-16 border-t border-neutral-800 pt-10">
      <div className="mb-8 flex items-end justify-between border-b border-neutral-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.6)]" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-teal-500">
              Series Collection
            </span>
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-white">
            {meta.series!.name}
          </h3>
        </div>

        <div className="hidden text-right sm:block">
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 tabular-nums">
            Progress{" "}
            {loading ? (
              <span className="ml-2 inline-block h-3 w-12 animate-pulse rounded bg-neutral-700" />
            ) : (
              <>
                <span className="ml-2 text-white">{currentPart}</span> / {total}
              </>
            )}
          </span>
        </div>
      </div>

      {/*Prev / Next*/}
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-neutral-800 bg-neutral-800">
        {/* Previous */}
        <div className="bg-neutral-950">
          {loading ? (
            <SkeletonNav />
          ) : prev ? (
            <Link
              href={`/blog/${prev.filename}`}
              className="group block p-5 transition-colors hover:bg-neutral-900"
            >
              <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-500 transition-colors group-hover:text-teal-400">
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Previous
              </span>
              <span className="mt-2 block font-semibold text-neutral-100 transition-colors group-hover:text-white">
                {truncate(prev.title)}
              </span>
            </Link>
          ) : (
            <div className="select-none p-5 opacity-30">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-600">
                First Chapter
              </span>
              <span className="mt-2 block font-semibold text-neutral-700">
                —
              </span>
            </div>
          )}
        </div>

        {/* Next */}
        <div className="bg-neutral-950">
          {loading ? (
            <SkeletonNav align="right" />
          ) : next ? (
            <Link
              href={`/blog/${next.filename}`}
              className="group block p-5 text-right transition-colors hover:bg-neutral-900"
            >
              <span className="flex items-center justify-end gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-500 transition-colors group-hover:text-teal-400">
                Next
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
              <span className="mt-2 block font-semibold text-neutral-100 transition-colors group-hover:text-white">
                {truncate(next.title)}
              </span>
            </Link>
          ) : (
            <div className="select-none p-5 text-right opacity-30">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-600">
                Series Finale
              </span>
              <span className="mt-2 block font-semibold text-neutral-700">
                —
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Full List*/}
      <div className="mt-4">
        <button
          onClick={() => setOpen((v) => !v)}
          className={`flex w-full items-center justify-center gap-3 rounded-lg border py-3 text-[11px] font-bold uppercase tracking-widest transition-all ${
            open
              ? "border-teal-500 bg-teal-500/5 text-teal-400"
              : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700 hover:text-white"
          }`}
        >
          {open ? "Hide All Parts" : "Browse All Parts"}
          <svg
            className={`h-4 w-4 transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {open && (
          <div className="mt-2 divide-y divide-neutral-900 overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="h-1 w-24 overflow-hidden rounded-full bg-neutral-800">
                  <div className="h-full w-1/3 animate-pulse bg-teal-500" />
                </div>
              </div>
            ) : (
              seriesList?.map((post) => {
                const isCurrent = post.series.part === currentPart;

                return (
                  <Link
                    key={post.filename}
                    href={`/blog/${post.filename}`}
                    className={`flex items-center gap-4 px-5 py-4 text-sm transition-all ${
                      isCurrent
                        ? "pointer-events-none bg-teal-500 text-black"
                        : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
                    }`}
                  >
                    <span
                      className={`text-xs font-black tabular-nums ${
                        isCurrent ? "text-black/60" : "text-teal-500"
                      }`}
                    >
                      {String(post.series.part).padStart(2, "0")}
                    </span>
                    <span className="flex-1 font-bold">{post.title}</span>
                    {isCurrent && (
                      <span className="rounded bg-black/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter">
                        Now Reading
                      </span>
                    )}
                  </Link>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(SeriesNavigation);
