import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Arial", "Helvetica", "sans-serif"]
      },
      colors: {
        invoice: {
          primary: "#0f2547",
          accent: "#1d4ed8",
          surface: "#f8fafc"
        }
      }
    }
  },
  plugins: []
};

export default config;
