import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
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
        // Restaurant-specific colors
        restaurant: {
          emerald: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d',
          },
          amber: {
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309',
            800: '#92400e',
            900: '#78350f',
          },
          heritage: {
            green: '#14532d',
            gold: '#d97706',
            cream: '#fffbeb',
            earth: '#78350f',
            clay: '#92400e',
          }
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Poppins", "system-ui", "sans-serif"],
        playfair: ["Playfair Display", "serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-primary": "linear-gradient(135deg, #8338EC 0%, #3A86FF 50%, #06FFA5 100%)",
        "gradient-secondary": "linear-gradient(135deg, #FF006E 0%, #8338EC 100%)",
        "gradient-mesh": "radial-gradient(at 0% 0%, rgba(131, 56, 236, 0.3) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(58, 134, 255, 0.3) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(6, 255, 165, 0.3) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(255, 0, 110, 0.3) 0px, transparent 50%)",
        // Restaurant gradients
        "gradient-restaurant": "linear-gradient(to bottom right, #14532d, #166534, #d97706)",
        "gradient-lakeside": "linear-gradient(135deg, rgba(20, 83, 45, 0.9) 0%, rgba(217, 119, 6, 0.8) 100%)",
      },
      boxShadow: {
        glow: "0 0 20px rgba(131, 56, 236, 0.5)",
        "glow-pink": "0 0 20px rgba(255, 0, 110, 0.5)",
        "glow-blue": "0 0 20px rgba(58, 134, 255, 0.5)",
        "glow-cyan": "0 0 20px rgba(6, 255, 165, 0.5)",
        "glass": "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        // Restaurant shadows
        "restaurant-soft": "0 4px 20px rgba(20, 83, 45, 0.1)",
        "restaurant-elegant": "0 10px 40px rgba(217, 119, 6, 0.15)",
        "restaurant-card": "0 8px 30px rgba(0, 0, 0, 0.08)",
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
        // Restaurant animations
        "bounce-slow": "bounce 3s infinite",
        "pulse-soft": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
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
          "50%": { transform: "translateY(-20px)" },
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
