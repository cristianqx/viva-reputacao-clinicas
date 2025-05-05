
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
          DEFAULT: "#28A745", // Green from logo
          foreground: "#FFFFFF",
          50: "#E3F7E8",
          100: "#C7F0D2",
          200: "#92E1A7",
          300: "#5DD17B",
          400: "#28A745", // Our main green
          500: "#22903A",
          600: "#1C7930",
          700: "#166325",
          800: "#104C1B",
          900: "#0A3510",
        },
        secondary: {
          DEFAULT: "#FFC107", // Yellow/Gold from logo
          foreground: "#000000",
          50: "#FFF9E0",
          100: "#FFF3C2",
          200: "#FFE985",
          300: "#FFDF49",
          400: "#FFC107", // Our main yellow
          500: "#DBA606",
          600: "#B78A05",
          700: "#946E04",
          800: "#705303",
          900: "#4D3802",
        },
        brand: {
          DEFAULT: "#003366", // Blue from logo
          foreground: "#FFFFFF",
          50: "#E0EAF4",
          100: "#C2D5E9",
          200: "#85ABD3",
          300: "#4782BE",
          400: "#0A58A2",
          500: "#003366", // Our main blue
          600: "#002B57",
          700: "#002347",
          800: "#001B38",
          900: "#001328",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-out",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
