import "expo-dev-client";

import { useFonts } from "expo-font";

import { FC } from "react";
import { Keyboard, KeyboardAvoidingView } from "react-native";

import { NativeNavigation } from "./navigation";
import { Provider } from "./provider";

import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

const App: FC = () => {
  const [loaded] = useFonts({
    figtree: require("./assets/fonts/Figtree-Regular.ttf"),
    figtreeBold: require("./assets/fonts/Figtree-Bold.ttf"),
    figtreeMedium: require("./assets/fonts/Figtree-Medium.ttf"),
    figtreeLight: require("./assets/fonts/Figtree-Light.ttf"),
    figtreeSemiBold: require("./assets/fonts/Figtree-SemiBold.ttf"),
    figtreeBlack: require("./assets/fonts/Figtree-Black.ttf"),
  });

  function handleUnhandledTouches() {
    Keyboard.dismiss();
    return false;
  }

  if (!loaded) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      onStartShouldSetResponder={handleUnhandledTouches}
    >
      <Provider>
        <NativeNavigation />
      </Provider>
    </KeyboardAvoidingView>
  );
};

export default App;
