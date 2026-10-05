"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface ThemeColors {
  background: string;
  primary: string;
  secondary: string;
  foreground: string;
  mutedText: string;
  card: string;
}

type ThemeColorKey = keyof ThemeColors;

interface ThemeContextType {
  colors: ThemeColors;
  setColors: React.Dispatch<React.SetStateAction<ThemeColors>>;
  updateColor: (key: ThemeColorKey, value: string) => void;
  resetTheme: (theme: ThemeColors) => void;
}

export const themePresets: Record<string, ThemeColors> = {
  Default: {
    background: "#000000",
    primary: "06b6d4",
    secondary: "#6366f1",
    foreground: "#111827",
    mutedText: "#D6D3D1",
    card: "#f9fafb",
  },

  Ocean: {
    background: "#f0f9ff",
    primary: "#0284c7",
    secondary: "#06b6d4",
    foreground: "#0c4a6e",
    mutedText: "#64748b",
    card: "#ffffff",
  },

  Forest: {
    background: "#f0fdf4",
    primary: "#16a34a",
    secondary: "#22c55e",
    foreground: "#14532d",
    mutedText: "#64748b",
    card: "#ffffff",
  },

  Purple: {
    background: "#faf5ff",
    primary: "#9333ea",
    secondary: "#a855f7",
    foreground: "#3b0764",
    mutedText: "#6b7280",
    card: "#ffffff",
  },

  Sunset: {
    background: "#fff7ed",
    primary: "#f97316",
    secondary: "#fb7185",
    foreground: "#431407",
    mutedText: "#78716c",
    card: "#ffffff",
  },

  Dark: {
    background: "#111827",
    foreground: "#f9fafb",
    primary: "#3b82f6",
    secondary: "#6366f1",
    mutedText: "#9ca3af",
    card: "#1f2937",
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Makes sure a saved colour is actually a hex string.
 *
 * This also handles the old react-color ColorResult object:
 *
 * {
 *   hsl: {...},
 *   hex: "#3b82f6",
 *   rgb: {...},
 *   hsv: {...},
 *   ...
 * }
 */
function getValidColor(value: unknown, fallback: string): string {
  // Normal string
  if (typeof value === "string") {
    return value;
  }

  // Old react-color object
  if (
    value &&
    typeof value === "object" &&
    "hex" in value &&
    typeof value.hex === "string"
  ) {
    return value.hex;
  }

  return fallback;
}

/**
 * Sanitise anything loaded from localStorage.
 */
function sanitiseColors(saved: unknown): ThemeColors {
  if (!saved || typeof saved !== "object") {
    return defaultColors;
  }

  const data = saved as Partial<ThemeColors>;

  return {
    background: getValidColor(data.background, defaultColors.background),
    foreground: getValidColor(data.foreground, defaultColors.foreground),
    primary: getValidColor(data.primary, defaultColors.primary),
    secondary: getValidColor(data.secondary, defaultColors.secondary),
    mutedText: getValidColor(data.mutedText, defaultColors.mutedText),
    card: getValidColor(data.card, defaultColors.card),
  };
}

const defaultColors = themePresets["Default"];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colors, setColors] = useState<ThemeColors>(defaultColors);

  const [hasLoaded, setHasLoaded] = useState(false);

  /*
   * Load saved colours.
   */
  useEffect(() => {
    try {
      const saved = localStorage.getItem("themeColors");

      if (saved) {
        const parsed = JSON.parse(saved);

        const cleanedColors = sanitiseColors(parsed);

        setColors(cleanedColors);
      }
    } catch (error) {
      console.error("Failed to load saved theme:", error);

      localStorage.removeItem("themeColors");

      setColors(defaultColors);
    } finally {
      setHasLoaded(true);
    }
  }, []);

  /*
   * Save colours and update CSS variables.
   *
   * We don't save until the initial localStorage
   * load has completed.
   */
  useEffect(() => {
    if (!hasLoaded) {
      return;
    }

    try {
      localStorage.setItem("themeColors", JSON.stringify(colors));
    } catch (error) {
      console.error("Failed to save theme:", error);
    }

    const root = document.documentElement;

    root.style.setProperty("--background", colors.background);

    root.style.setProperty("--foreground", colors.foreground);

    root.style.setProperty("--primary", colors.primary);

    root.style.setProperty("--secondary", colors.secondary);

    root.style.setProperty("--muted-text", colors.mutedText);

    root.style.setProperty("--card", colors.card);
  }, [colors, hasLoaded]);

  /*
   * Update a single colour.
   *
   * The value is always expected to be a string,
   * e.g. "#3b82f6".
   */
  const updateColor = (key: keyof ThemeColors, value: string) => {
    setColors((current) => ({
      ...defaultColors,
      ...current,
      [key]: value,
    }));
  };

  /*
   * Reset everything back to a specific theme.
   */
  const resetTheme = (theme: ThemeColors) => {
    setColors({
      ...theme,
    });
  };

  return (
    <ThemeContext.Provider
      value={{
        colors,
        setColors,
        updateColor,
        resetTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
