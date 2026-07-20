/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        primary: "#00288e",
        "primary-container": "#1e40af",
        "on-primary": "#ffffff",

        background: "#f8f9ff",
        surface: "#f8f9ff",
        "surface-bright": "#f8f9ff",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#eff4ff",
        "surface-container": "#e6eeff",
        "surface-container-high": "#dee9fc",
        "surface-container-highest": "#d9e3f6",

        "on-surface": "#121c2a",
        "on-surface-variant": "#444653",

        outline: "#757684",
        "outline-variant": "#c4c5d5",

        secondary: "#0060ac",
        "secondary-container": "#64a8fe",

        "surface-variant": "#d9e3f6",
      },

      spacing: {
        "stack-lg": "24px",
        "stack-md": "16px",
        "stack-sm": "8px",
        gutter: "12px",
        "margin-mobile": "16px",
        "margin-tablet": "24px",
        base: "4px",
      },

      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },

      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
      },

      fontSize: {
        "headline-xl": [
          "32px",
          {
            lineHeight: "40px",
            fontWeight: "700",
          },
        ],

        "headline-lg": [
          "24px",
          {
            lineHeight: "32px",
            fontWeight: "700",
          },
        ],

        "headline-md": [
          "20px",
          {
            lineHeight: "28px",
            fontWeight: "600",
          },
        ],

        "body-lg": [
          "16px",
          {
            lineHeight: "24px",
          },
        ],

        "label-lg": [
          "14px",
          {
            lineHeight: "20px",
            fontWeight: "600",
          },
        ],
      },
    },
  },

  plugins: [],
};
