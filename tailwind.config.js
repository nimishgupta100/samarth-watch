/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary design tokens (Samarth Watch design system)
        forest: {
          DEFAULT: "#1F4D3F",
          dark: "#173B30",
          light: "#2B6856",
        },
        sage: {
          DEFAULT: "#6E9A82",
          light: "#A4C2B2",
          dark: "#517764",
        },
        mint: {
          DEFAULT: "#EEF5F1",
          deep: "#E2EEE7",
          border: "#D5E4DB",
        },
        cream: {
          DEFAULT: "#FAFCFA",
          pure: "#FFFFFF",
        },
        ink: {
          DEFAULT: "#14261F",
          muted: "#4A5F55",
          faint: "#73887E",
        },
        alert: {
          red: "#DC2626",
          amber: "#B45309",
          green: "#15803D",
        },
        // Legacy samarth.* tokens kept for backward compat
        samarth: {
          navy: "#0F2642",
          blue: "#1E4F8A",
          teal: "#0D9488",
          amber: "#D97706",
          red: "#DC2626",
          green: "#16A34A",
          cream: "#FAF9F6",
          sand: "#F5F2EB",
          warmGray: "#64748B",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      borderRadius: {
        lg: "0.5rem",
        xl: "0.75rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Noto Sans Devanagari"', 'system-ui', 'sans-serif'],
        hindi: ['"Noto Sans Devanagari"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      lineHeight: {
        // Ensure Hindi Devanagari marks are not clipped
        relaxed: '1.625',
        loose: '2',
      },
    },
  },
  plugins: [],
}
