import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#f7f5fa",
        night: "#08070b",
        panel: "#111017",
        violet: "#a875ff",
        lavender: "#d7c1ff",
        muted: "#9e99aa",
        line: "rgba(255,255,255,.11)"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Arial", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"]
      },
      boxShadow: {
        glow: "0 0 80px rgba(168,117,255,.22)",
        soft: "0 24px 80px rgba(0,0,0,.32)"
      },
      keyframes: {
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        float: { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-12px)" } }
      },
      animation: {
        shimmer: "shimmer 2.4s linear infinite",
        float: "float 6s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
