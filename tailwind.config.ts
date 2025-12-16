import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    'sm:col-span-2', 'lg:col-span-4',
    'sm:col-span-3', 'lg:col-span-6',
    'sm:col-span-4', 'lg:col-span-8',
    'sm:col-span-6', 'lg:col-span-12',
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },

  plugins: [],
} satisfies Config;
