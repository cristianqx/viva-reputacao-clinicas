
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
          DEFAULT: "#0E927D", // Verde petróleo
          foreground: "#FFFFFF",
          50: "#E6F7F4",
          100: "#CCEFE8",
          200: "#99DFD2",
          300: "#66CFBB",
          400: "#33BFA5",
          500: "#0E927D", // Our main green
          600: "#0B7562",
          700: "#085846",
          800: "#053A2B",
          900: "#021D15",
        },
        secondary: {
          DEFAULT: "#FFCD3C", // Amarelo ouro
          foreground: "#000000",
          50: "#FFF9E6",
          100: "#FFF3CC",
          200: "#FFE899",
          300: "#FFDC66",
          400: "#FFD033",
          500: "#FFCD3C", // Our main yellow
          600: "#CCA430",
          700: "#997B24",
          800: "#665218",
          900: "#33290C",
        },
        brand: {
          DEFAULT: "#1A1F36", // Azul escuro para titulação e contrastes
          foreground: "#FFFFFF",
          50: "#E8E9ED",
          100: "#D0D3DB",
          200: "#A1A7B7",
          300: "#737B93",
          400: "#44506F",
          500: "#1A1F36", // Our main brand
          600: "#15192C",
          700: "#101321",
          800: "#0A0C16",
          900: "#05060B",
        },
        destructive: {
          DEFAULT: "#DC3545",
          foreground: "#FFFFFF",
          50: "#FCE9EB",
          100: "#F9D2D7",
          200: "#F3A5AF",
          300: "#ED7987",
          400: "#DC3545", // Red
          500: "#BB2D3B",
          600: "#9A2530",
          700: "#7A1E26",
          800: "#59161C",
          900: "#390F13",
        },
        muted: {
          DEFAULT: "#F8F9FA",
          foreground: "#6C757D",
          50: "#F8F9FA",
          100: "#E9ECEF",
          200: "#DEE2E6",
          300: "#CED4DA",
          400: "#ADB5BD",
          500: "#6C757D",
          600: "#495057",
          700: "#343A40",
          800: "#212529",
          900: "#0A0A0A",
        },
        accent: {
          DEFAULT: "#007BFF",
          foreground: "#FFFFFF",
          50: "#E0F0FF",
          100: "#C2E1FF",
          200: "#85C3FF",
          300: "#49A6FF",
          400: "#007BFF", // Info blue
          500: "#0069D9",
          600: "#0057B3",
          700: "#00458D",
          800: "#003468",
          900: "#002242",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "pulse": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-out",
        "slide-up": "slide-up 0.5s ease-out",
        "pulse": "pulse 3s infinite",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
