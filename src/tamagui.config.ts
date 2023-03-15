import { createInterFont } from "@tamagui/font-inter";
import { createMedia } from "@tamagui/react-native-media-driver";
import { shorthands } from "@tamagui/shorthands";
import { themes, tokens } from "@tamagui/themes";
import { createTamagui, createTokens } from "tamagui";

import { animations } from "./constants/animations";

const headingFont = createInterFont({
  size: {
    6: 15,
  },
  transform: {
    6: "uppercase",
    7: "none",
  },
  weight: {
    6: "400",
    7: "700",
  },
  color: {
    6: "$colorFocus",
    7: "$color",
  },
  letterSpacing: {
    5: 2,
    6: 1,
    7: 0,
    8: -1,
    9: -2,
    10: -3,
    12: -4,
    14: -5,
    15: -6,
  },
  face: {
    700: { normal: "InterBold" },
  },
});

const bodyFont = createInterFont(
  {
    face: {
      700: { normal: "InterBold" },
    },
  },
  {
    sizeSize: (size) => Math.round(size * 1.1),
    sizeLineHeight: (size) => Math.round(size * 1.1 + (size > 20 ? 10 : 10)),
  }
);

const accent = {
  accent1: "#050505",
  accent2: "#151515",
  accent3: "#191919",
  accent4: "#232323",
  accent5: "#282828",
  accent6: "#323232",
  accent7: "#424242",
  accent8: "#494949",
  accent9: "#545454",
  accent10: " #626262",
  accent11: "#A5A5A5",
  accent12: "#FFFFFF",
};

const accentTheme = createTokens({
  ...tokens,
  color: {
    accent1: { val: "#050505", name: "accent1", key: "accent1" },
    accent2: { val: "#151515", name: "accent2", key: "accent2" },
    accent3: { val: "#191919", name: "accent3", key: "accent3" },
    accent4: { val: "#232323", name: "accent4", key: "accent4" },
    accent5: { val: "#282828", name: "accent5", key: "accent5" },
    accent6: { val: "#323232", name: "accent6", key: "accent6" },
    accent7: { val: "#424242", name: "accent7", key: "accent7" },
    accent8: { val: "#494949", name: "accent8", key: "accent8" },
    accent9: { val: "#545454", name: "accent9", key: "accent9" },
    accent10: { val: "#626262", name: "accent10", key: "accent10" },
    accent11: { val: "#A5A5A5", name: "accent11", key: "accent11" },
    accent12: { val: "#FFFFFF", name: "accent12", key: "accent12" },
  },
});

const config = createTamagui({
  animations,
  defaultTheme: "light",
  shouldAddPrefersColorThemes: false,
  themeClassNameOnRoot: false,
  shorthands,
  fonts: {
    heading: headingFont,
    body: bodyFont,
  },
  themes: {
    ...themes,
    /* Color styles */
  },
  tokens: {
    ...accentTheme,
  },
  media: createMedia({
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
    xxl: { maxWidth: 1600 },
    gtXs: { minWidth: 660 + 1 },
    gtSm: { minWidth: 800 + 1 },
    gtMd: { minWidth: 1020 + 1 },
    gtLg: { minWidth: 1280 + 1 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: "none" },
    pointerCoarse: { pointer: "coarse" },
  }),
});

export type AppConfig = typeof config;

declare module "tamagui" {
  // overrides TamaguiCustomConfig so your custom types
  // work everywhere you import `tamagui`
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config;
