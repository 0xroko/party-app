const nativewind = require("nativewind/tailwind");
const plugin = require("tailwindcss/plugin");

const colors = require("./colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    g: ({ theme }) => theme("spacing"),
    extend: {
      fontFamily: {
        "figtree-bold": ["figtreeBold", "sans-serif"],
        "figtree-medium": ["figtreeMedium", "sans-serif"],
        "figtree-light": ["figtreeLight", "sans-serif"],
        "figtree-semi-bold": ["figtreeSemiBold", "sans-serif"],
        figtree: ["figtreeRegular", "sans-serif"],
        "figtree-black": ["figtreeBlack", "sans-serif"],
      },
      colors: {
        ...colors,
      },
    },
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          g: (value) => ({
            gap: value,
          }),
        },
        { values: theme("g") }
      );
    }),
  ],
  presets: [nativewind],
};
