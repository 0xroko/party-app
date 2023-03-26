import { UserLoginInfoScreen } from "@features/auth/info-screen";
import { LoginLoginScreen } from "@features/auth/signup";
import { UserInfoScreen } from "@features/user/id";
import { checkIfUserHasData } from "@lib/actions/user";
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
  const onFirstSet = useAuthStore((s) => s.onFirstSet);
  const setAuthState = useAuthStore((s) => s.setAuthState);

  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
    }
    // NOT sure if this is even needed since onAuthStateChange is called on app start
    // const checkIfLoggedIn = async () => {
    //   const user = await supabase.auth.getUser();
    //   // TODO: check if user did complete INFO_SCREEN, ie same set onAuthStateChange callback -> move that to zustand someday
    //   if (!user.data?.user) {
    //     setAuthState("SIGNED_OUT");
    //   } else {
    //     setAuthState("SIGNED_IN");
    //   }
    //   // await onFirstSet(async () => {
    //   //   console.log("hide splash");

    //   //   await SplashScreen.hideAsync();
    //   // });
    // };
    // checkIfLoggedIn();

    supabase.auth.onAuthStateChange(async (c, s) => {
      console.log("onAuthStateChange", c, s?.user?.email);

      if (c === "SIGNED_IN" || s !== null) {
        const userHasData = await checkIfUserHasData();
        console.log("userHasData", userHasData);

        if (!userHasData) {
          setAuthState("INFO_SCREEN");
        } else {
          setAuthState("SIGNED_IN");
        }
      } else {
        setAuthState("SIGNED_OUT");
      }
      await onFirstSet(async () => {
        console.log("hide splash");
        setTimeout(async () => {
          await SplashScreen.hideAsync();
        }, 100);
      });
    });

    return () => {};
  }, []);

  return (
    <Stack.Navigator>
      {authState === "SIGNED_IN" && (
        <Stack.Screen
          options={{
            title: "",
            headerShown: false,
          }}
          name="user"
          component={UserInfoScreen}
        />
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
