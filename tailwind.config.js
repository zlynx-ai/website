/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: "#050505",
          border: "#222222",
          card: "#0a0a0a",
          muted: "#888888",
          text: "#f8f8f8",
          accent: "#0055ff", // Google/DeepMind distinct blue
          accentGlow: "#0055ff40",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
    },
  },
  plugins: [],
};
