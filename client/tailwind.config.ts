import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        page: "var(--page)",
        surface: "var(--surface)",
        sunken: "var(--surface-sunken)",
        ink: "var(--ink)",
        secondary: "var(--ink-secondary)",
        muted: "var(--ink-muted)",
        line: "var(--line)",
        grid: "var(--grid)",
        accent: "var(--accent)",
        positive: "var(--positive)",
        neutral: "var(--neutral)",
        negative: "var(--negative)",
      },
      borderRadius: { card: "10px" },
    },
  },
  plugins: [],
};

export default config;
