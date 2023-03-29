module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo", "nativewind/babel"],
    // plugins: ["nativewind/babel"],
    plugins: [
      [
        require.resolve("babel-plugin-module-resolver"),
        {
          root: ["./src"],
          alias: {
            "@components": "./src/components",
            "@screens": "./src/screens",
            "@utils": "./src/utils",
            "@hooks": "./src/hooks",
            "@assets": "./src/assets",
            "@features": "./src/features",
            "@navigation": "./src/navigation",
            "@lib": "./src/lib",
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
