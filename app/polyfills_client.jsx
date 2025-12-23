"use client";
import { useEffect } from "react";

export default function PolyfillsClient() {
  useEffect(() => {
    if (typeof window !== "undefined") {
        if (!window.requestIdleCallback) {
        window.requestIdleCallback = function (cb) {
            return setTimeout(() => {
            const start = Date.now();
            cb({
                didTimeout: false,
                timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
            });
            }, 1);
        };
        }

        if (!window.cancelIdleCallback) {
        window.cancelIdleCallback = function (id) {
            clearTimeout(id);
        };
        }
    }
  }, []);

  return <></>;
}
