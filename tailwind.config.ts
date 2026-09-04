import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        midnight: {
          700: "#232A4D",
          800: "#1B1B26",
          900: "#101018",
          950: "#0A0A10",
        },
        charcoal: {
          800: "#1E1E28",
          900: "#15151C",
        },
        lavender: {
          200: "#E7E1F7",
          300: "#D3C9F2",
          400: "#C3B6E8",
          500: "#A997DC",
        },
        moonlight: {
          100: "#F5F1E8",
          200: "#EDE6D6",
          300: "#DDD2B8",
        },
        rose: {
          100: "#F6E4E8",
          200: "#EFCBD3",
          300: "#E3AEBB",
          400: "#D592A3",
          500: "#C67589",
          600: "#B05C72",
        },
        gold: {
          300: "#EDD6A0",
          400: "#E0B45C",
          500: "#C99A3E",
        },
        teal: {
          300: "#A9D4CB",
          400: "#7FBBAE",
          500: "#5B9E90",
          600: "#457A70",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        glow: "0 0 40px rgba(195, 182, 232, 0.25)",
        "glow-gold": "0 0 40px rgba(224, 180, 92, 0.3)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 10s ease-in-out infinite",
        twinkle: "twinkle 3s ease-in-out infinite",
        "seal-pulse": "sealPulse 2.4s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-16px)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "1" },
        },
        sealPulse: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(224,180,92,0.35)" },
          "50%": { boxShadow: "0 0 0 16px rgba(224,180,92,0)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
