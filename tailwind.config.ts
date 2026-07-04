import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", "Segoe UI", "Arial", "Helvetica", "sans-serif"]
      },
      colors: {
        invoice: {
          primary: "#071d3d",
          accent: "#102f5d",
          gold: "#d8aa3d",
          goldLight: "#f5d97e",
          goldSoft: "#fff7df",
          surface: "#f8fafc"
        }
      }
    }
  },
  plugins: []
};

export default config;
