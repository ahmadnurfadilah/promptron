/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        dark: "#010101",
        primary: {
          DEFAULT: "#a5ff87",
          50: "#f1ffeb",
          100: "#dbffce",
          200: "#c2ffad",
          300: "#a5ff87",
          400: "#8afc66",
          500: "#78f94f",
          600: "#66e646",
          700: "#4cd03b",
          800: "#31bb33",
          900: "#009624",
        },
      },
      keyframes: {
        updown: {
          "0%, 100%": { transform: "translateY(-10px)" },
          "50%": { transform: "translateY(10px)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        updown: "updown 3s ease-in-out infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
