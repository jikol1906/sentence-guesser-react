/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Roboto Mono"', "monospace"],
      },
      animation: {
        typewriterReveal: "typewriterReveal 0.6s step-end 15 forwards, reveal 5s forwards",
      },
      keyframes: {
        typewriterReveal: {
          "0%,100%": { borderLeftColor: "transparent" },
          "50%": { borderLeftColor: "theme(colors.white)" },
        },
        reveal: {
          "0%,20%": {
            animationTimingFunction: "steps(4)",
            left: 0,
          },
          "30%": {
            animationTimingFunction: "steps(2)",
            left: 'calc(100% / 16 * 4)',
          },
          "45%": {
            animationTimingFunction: "steps(6)",
            left: 'calc(100% / 16 * 6)',
          },
          "60%": {
            animationTimingFunction: "steps(4)",
            left: 'calc(100% / 16 * 12)',
          },
          "100%": {
            left: '100%',
          },
        },
      },
    },
  },
  plugins: [],
};
