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
        // Pop palette: ink base, bone text, four loud colours.
        background: "#0B0B14",
        backgroundElevated: "rgba(255, 255, 255, 0.05)",
        ink: "#0B0B14",
        surface: "#14142A",
        bone: "#F4F1FF",
        muted: "#A7A3C4",
        lime: "#D4FF3A",
        pink: "#FF3D8B",
        sun: "#FFC83D",
        electric: "#3626FF",
        violet: "#8B5CFF",
        primary: {
          50: "#ECEAFF",
          100: "#D9D5FF",
          200: "#B4ABFF",
          300: "#8F82FF",
          400: "#6B5BFF",
          500: "#3626FF",
          600: "#2B1CE0",
          700: "#2216B8",
          800: "#1A1190",
          900: "#130C6B",
        },
        // Legacy keys (admin + untouched components) now map to the pop palette.
        accent: {
          DEFAULT: "#D4FF3A",
          pink: "#FF3D8B",
          purple: "#8B5CFF",
          blue: "#6F9BFF",
          cyan: "#2CF0C8",
          yellow: "#FFC83D",
        },
        gradient: {
          from: "#D4FF3A",
          via: "#FF3D8B",
          to: "#8B5CFF",
        },
      },
      fontFamily: {
        sans: ["Geist", "system-ui", "sans-serif"],
        display: ["Bricolage Grotesque", "Geist", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-primary": "linear-gradient(100deg, #D4FF3A 0%, #FF3D8B 33%, #8B5CFF 66%, #D4FF3A 100%)",
        "gradient-secondary": "linear-gradient(135deg, #FF3D8B 0%, #8B5CFF 100%)",
        "gradient-mesh": "radial-gradient(at 15% 0%, rgba(54, 38, 255, 0.35) 0px, transparent 55%), radial-gradient(at 90% 100%, rgba(255, 61, 139, 0.25) 0px, transparent 50%)",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(212, 255, 58, 0.4), 0 16px 48px -16px rgba(212, 255, 58, 0.35)",
        "glow-sm": "0 0 0 1px rgba(212, 255, 58, 0.35), 0 8px 24px -10px rgba(212, 255, 58, 0.3)",
        "glow-pink": "0 0 0 1px rgba(255, 61, 139, 0.55), 0 16px 48px -14px rgba(255, 61, 139, 0.5)",
        "glow-blue": "0 0 0 1px rgba(111, 155, 255, 0.5), 0 12px 36px -14px rgba(111, 155, 255, 0.45)",
        "glow-cyan": "0 0 0 1px rgba(44, 240, 200, 0.5), 0 12px 36px -14px rgba(44, 240, 200, 0.4)",
        "glass": "inset 0 1px 0 rgba(255, 255, 255, 0.05)",
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
          "0%, 100%": { "background-size": "200% 200%", "background-position": "left center" },
          "50%": { "background-size": "200% 200%", "background-position": "right center" },
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
