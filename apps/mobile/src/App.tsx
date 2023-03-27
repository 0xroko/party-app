import "expo-dev-client";

import { useFonts } from "expo-font";

import { FC, useEffect, useRef, useState } from "react";
import { Keyboard, KeyboardAvoidingView } from "react-native";

import { NativeNavigation } from "./navigation";
import { Provider } from "./provider";

import { registerForPushNotificationsAsync } from "@lib/actions/user";
import { useAuthStore } from "@navigation/authStore";
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const App: FC = () => {
  const [loaded] = useFonts({
    figtree: require("./assets/fonts/Figtree-Regular.ttf"),
    figtreeBold: require("./assets/fonts/Figtree-Bold.ttf"),
    figtreeMedium: require("./assets/fonts/Figtree-Medium.ttf"),
    figtreeLight: require("./assets/fonts/Figtree-Light.ttf"),
    figtreeSemiBold: require("./assets/fonts/Figtree-SemiBold.ttf"),
    figtreeBlack: require("./assets/fonts/Figtree-Black.ttf"),
  });
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] =
    useState<Notifications.Notification>();
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const authState = useAuthStore((s) => s.authState);

  useEffect(() => {
    if (authState !== "SIGNED_IN") return;
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [authState]);

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
