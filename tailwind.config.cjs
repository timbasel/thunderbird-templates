/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,css,md,mdx,html,json,scss}"],
  theme: {
    extend: {
      colors: {
        blue: {
          50: "#d6e9ff",
          100: "#a1bdde",
          200: "#6b91bd",
          300: "#36659c",
          400: "#1b4f8c",
          500: "#00387b",
          600: "#002e66",
          700: "#002552",
          800: "#001c3e",
          900: "#001229",
        },
      },
    },
  },
};
