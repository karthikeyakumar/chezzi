/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
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
        border: "var(--color-border)", // light tan
        input: "var(--color-input)", // subtle cream
        ring: "var(--color-ring)", // confident blue
        background: "var(--color-background)", // warm off-white
        foreground: "var(--color-foreground)", // rich dark brown
        primary: {
          DEFAULT: "var(--color-primary)", // warm brown
          foreground: "var(--color-primary-foreground)", // warm off-white
        },
        secondary: {
          DEFAULT: "var(--color-secondary)", // light tan
          foreground: "var(--color-secondary-foreground)", // rich dark brown
        },
        destructive: {
          DEFAULT: "var(--color-destructive)", // muted red
          foreground: "var(--color-destructive-foreground)", // warm off-white
        },
        muted: {
          DEFAULT: "var(--color-muted)", // light tan
          foreground: "var(--color-muted-foreground)", // medium brown
        },
        accent: {
          DEFAULT: "var(--color-accent)", // confident blue
          foreground: "var(--color-accent-foreground)", // warm off-white
        },
        popover: {
          DEFAULT: "var(--color-popover)", // subtle cream
          foreground: "var(--color-popover-foreground)", // rich dark brown
        },
        card: {
          DEFAULT: "var(--color-card)", // subtle cream
          foreground: "var(--color-card-foreground)", // rich dark brown
        },
        success: {
          DEFAULT: "var(--color-success)", // natural green
          foreground: "var(--color-success-foreground)", // warm off-white
        },
        warning: {
          DEFAULT: "var(--color-warning)", // gentle amber
          foreground: "var(--color-warning-foreground)", // rich dark brown
        },
        error: {
          DEFAULT: "var(--color-error)", // muted red
          foreground: "var(--color-error-foreground)", // warm off-white
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        'heading': ['Inter', 'sans-serif'],
        'body': ['Source Sans Pro', 'sans-serif'],
        'caption': ['Roboto', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'subtle': 'var(--shadow-subtle)',
        'moderate': 'var(--shadow-moderate)',
        'prominent': 'var(--shadow-prominent)',
      },
      transitionTimingFunction: {
        'gentle': 'var(--ease-gentle)',
      },
      transitionDuration: {
        'fast': 'var(--duration-fast)',
        'normal': 'var(--duration-normal)',
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
        "gentle-pulse": {
          "0%, 100%": {
            opacity: "1",
            transform: "scale(1)",
          },
          "50%": {
            opacity: "0.8",
            transform: "scale(1.02)",
          },
        },
        "micro-celebration": {
          "0%": {
            transform: "scale(1)",
          },
          "50%": {
            transform: "scale(1.05)",
          },
          "100%": {
            transform: "scale(1)",
          },
        },
        "coaching-fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(-8px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "gentle-pulse": "gentle-pulse 2s cubic-bezier(0.4, 0, 0.2, 1) infinite",
        "micro-celebration": "micro-celebration 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "coaching-fade-in": "coaching-fade-in 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}