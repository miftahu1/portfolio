import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      colors: {
        background: "#0A0A0F",
        backgroundElevated: "rgba(255, 255, 255, 0.05)",
        primary: {
          50: "#f0e7ff",
          100: "#e0cfff",
          200: "#c9a5ff",
          300: "#b077ff",
          400: "#9d4eff",
          500: "#8b2eff",
          600: "#7c1aff",
          700: "#6b0aff",
          800: "#5a08e6",
          900: "#4a06cc",
        },
        accent: {
          pink: "#FF006E",
          purple: "#8338EC",
          blue: "#3A86FF",
          cyan: "#06FFA5",
          yellow: "#FFBE0B",
        },
        gradient: {
          from: "#8338EC",
          via: "#3A86FF",
          to: "#06FFA5",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Poppins", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-primary": "linear-gradient(135deg, #8338EC 0%, #3A86FF 50%, #06FFA5 100%)",
        "gradient-secondary": "linear-gradient(135deg, #FF006E 0%, #8338EC 100%)",
        "gradient-mesh": "radial-gradient(at 0% 0%, rgba(131, 56, 236, 0.15) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(58, 134, 255, 0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(6, 255, 165, 0.15) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(255, 0, 110, 0.15) 0px, transparent 50%)",
      },
      boxShadow: {
        glow: "0 0 20px rgba(131, 56, 236, 0.4)",
        "glow-sm": "0 0 10px rgba(131, 56, 236, 0.3)",
        "glow-pink": "0 0 20px rgba(255, 0, 110, 0.4)",
        "glow-blue": "0 0 20px rgba(58, 134, 255, 0.4)",
        "glow-cyan": "0 0 20px rgba(6, 255, 165, 0.4)",
        "glass": "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "gradient": "gradient 8s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "slide-up": "slideUp 0.5s ease-out",
        "fade-in": "fadeIn 0.5s ease-out",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        gradient: {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0.5" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;