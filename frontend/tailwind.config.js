export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        card2: "hsl(var(--card-2))",
        border: "hsl(var(--border))",
        primary: "hsl(var(--primary))",
        secondary: "hsl(var(--secondary))",
        muted: "hsl(var(--muted))",
        accent: "hsl(var(--accent))",
        danger: "hsl(var(--danger))",
        success: "hsl(var(--success))",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Manrope", "sans-serif"],
        serif: ["Plus Jakarta Sans", "Manrope", "sans-serif"],
      },
      boxShadow: {
        soft: "0 18px 48px rgba(15, 23, 42, 0.08)",
        panel: "0 8px 24px rgba(15, 23, 42, 0.05), 0 1px 0 rgba(255, 255, 255, 0.55) inset",
      },
      backgroundImage: {
        hero: "radial-gradient(circle at top left, rgba(88, 101, 242, 0.10), transparent 34%), radial-gradient(circle at bottom right, rgba(148, 163, 184, 0.16), transparent 38%)",
      },
    },
  },
  plugins: [],
};
