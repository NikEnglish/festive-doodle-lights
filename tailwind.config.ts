import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#2F855A",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#D69E2E",
          foreground: "#1a1f2c",
        },
        destructive: {
          DEFAULT: "#E53E3E",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#4A5568",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#D69E2E",
          foreground: "#1a1f2c",
        },
        card: {
          DEFAULT: "#2D3748",
          foreground: "#FFFFFF",
        },
      },
      keyframes: {
        "led-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        "led-pulse": "led-pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;