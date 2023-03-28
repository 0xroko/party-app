import { UserLoginInfoScreen } from "@features/auth/info-screen";
import { LoginLoginScreen } from "@features/auth/signup";
import { HomeScreen } from "@features/home";
import { UserInfoScreen } from "@features/user/id";
import { supabase } from "@lib/supabase";
import { useAuthStore } from "@navigation/authStore";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef } from "react";

const Stack = createNativeStackNavigator<StackNavigatorParams>();

export const Splash = () => {
  return <></>;
};

export const NativeNavigation = () => {
  const authState = useAuthStore((s) => s.authState);

  const wasSet = useRef(false);

  const onAuthStateChange = useAuthStore((s) => s.onAuthStateChange);

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (c, s) => {
      console.log("onAuthStateChange", c, s?.user?.email);
      onAuthStateChange(c, s);

      if (wasSet.current) return;
      wasSet.current = true;
      setTimeout(async () => {
        await SplashScreen.hideAsync();
      }, 100);
    });

    return () => {};
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        // bilo bi cool ne animirat gradient na home screenu
        // -> move gradient up to parent component???
        // -> (imat Screen.gradient = true/false prop ili nesto)
        animation: "fade",
        animationDuration: 200,
      }}
    >
      {authState === "SIGNED_IN" && (
        // TU idu svi screenovi, home prvi
        <>
          <Stack.Screen
            options={{
              title: "",
              headerShown: false,
            }}
            name="home"
            component={HomeScreen}
          />
          <Stack.Screen
            options={{
              title: "",
              headerShown: false,
            }}
            name="user"
            component={UserInfoScreen}
          />
        </>
      )}
      {authState === "SIGNED_OUT" && (
        <Stack.Screen
          options={{
            title: "",
            animation: "none",
            headerShown: false,
          }}
          name="login-login"
          component={LoginLoginScreen}
        />
      )}
      {authState === "INFO_SCREEN" && (
        <Stack.Screen
          options={{
            title: "",
            headerShown: false,
            animation: "none",
          }}
          name="login-info"
          component={UserLoginInfoScreen}
        />
      )}
      {authState === "LOADING" && (
        <Stack.Screen
          component={Splash}
          options={{
            title: "",
            animation: "none",
            headerShown: false,
          }}
          name="splash"
        />
      )}
    </Stack.Navigator>
  );
};
