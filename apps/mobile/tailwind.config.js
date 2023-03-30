const nativewind = require("nativewind/tailwind");
const plugin = require("tailwindcss/plugin");

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
        accents: {
          1: "#050505",
          2: "#151515",
          3: "#191919",
          4: "#232323",
          5: "#282828",
          6: "#323232",
          7: "#424242",
          8: "#494949",
          9: "#545454",
          10: "#626262",
          11: "#A5A5A5",
          12: "#FFFFFF",
        },
        error: {
          primary: "#F0545D",
          third: "#822025",
        },
        success: {
          primary: "#10B3A3",
        },
        glass: {
          1: "#05050566",
        },
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
