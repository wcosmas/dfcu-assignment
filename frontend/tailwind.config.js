/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0046AD", // DFCU blue
          dark: "#003A8C",
          light: "#2B72D8",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#FFB81C", // DFCU yellow/gold
          dark: "#E6A100",
          light: "#FFC94D",
          foreground: "#000000",
        },
        destructive: {
          DEFAULT: "#FF4D4F",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#F4F6FA",
          foreground: "#0046AD",
        },
        muted: {
          DEFAULT: "#F5F5F5",
          foreground: "#737373",
        },
        border: "#E2E8F0",
        background: "#FFFFFF",
        foreground: "#0E1724",
        card: "#FFFFFF",
        "card-foreground": "#0E1724",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
