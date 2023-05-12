import { HomeNavigation } from "@components/home-navigation";
import { UserLoginInfoScreen } from "@features/auth/info-screen";
import { LoginLoginScreen } from "@features/auth/signup";
import { Chat } from "@features/chat/chat";
import { Chats } from "@features/chat/chats_list";
import { CommentsPage } from "@features/comments/id";
import { PartyAdd } from "@features/party/add";
import { PartyAddMore } from "@features/party/add-more";
import { PartyInfo } from "@features/party/id";
import { AddPostScreen } from "@features/posts/add";
import { PostInfoScreen } from "@features/posts/id";
import { TagModal } from "@features/posts/tag";
import { UserEditScreen } from "@features/user/edit";
import { UserFriendReqests } from "@features/user/friend-requests";
import { UserInfoScreen } from "@features/user/id";
import { supabase } from "@lib/supabase";
import { useAuthStore } from "@navigation/authStore";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef } from "react";

const Stack = createNativeStackNavigator<StackNavigatorParams>();

const defaultScreenOptions = {
  title: "",
  headerShown: false,
  animation: "none",
  animationDuration: 0,
} as const;

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
        animation: "none",
        animationDuration: 0,
      }}
    >
      {authState === "SIGNED_IN" && (
        // TU idu svi screenovi, home prvi
        <>
          <Stack.Screen
            // options={defaultScreenOptions}
            name="home"
            component={HomeNavigation}
            options={{ ...defaultScreenOptions, headerShown: false }}
          />
          <Stack.Screen
            options={defaultScreenOptions}
            name="user"
            component={UserInfoScreen}
          />
          {/* <Stack.Screen
            options={{
              ...defaultScreenOptions,
              presentation: "transparentModal",

              animation: "none",
            }}
            name="user-modal"
            component={ModalScreen}
          /> */}
          <Stack.Screen
            options={defaultScreenOptions}
            name="user-edit"
            component={UserEditScreen}
          />
          <Stack.Screen
            options={defaultScreenOptions}
            name="party-add"
            component={PartyAdd}
          />
          <Stack.Screen
            options={defaultScreenOptions}
            name="party-add-more"
            component={PartyAddMore}
          />
          <Stack.Screen
            options={defaultScreenOptions}
            name="postAdd"
            component={AddPostScreen}
          />
          <Stack.Screen
            options={defaultScreenOptions}
            component={PostInfoScreen}
            name="post"
          />
          <Stack.Screen
            name="user-friend-request"
            options={defaultScreenOptions}
            component={UserFriendReqests}
          />
          <Stack.Screen
            name="chats"
            options={defaultScreenOptions}
            component={Chats}
          />
          <Stack.Screen
            name="chat"
            options={defaultScreenOptions}
            component={Chat}
          />

          <Stack.Screen
            name="party"
            options={defaultScreenOptions}
            component={PartyInfo}
          />
          <Stack.Screen
            name="comments"
            options={defaultScreenOptions}
            component={CommentsPage}
          />
          <Stack.Screen
            name="tag-users"
            options={{
              ...defaultScreenOptions,
              presentation: "transparentModal",
            }}
            component={TagModal}
          />
        </>
      )}
      {authState === "SIGNED_OUT" && (
        <Stack.Screen
          options={{
            ...defaultScreenOptions,
            headerShown: false,
          }}
          name="login-login"
          component={LoginLoginScreen}
        />
      )}
      {authState === "INFO_SCREEN" && (
        <Stack.Screen
          options={{
            ...defaultScreenOptions,
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
            ...defaultScreenOptions,
            animation: "none",
          }}
          name="splash"
        />
      )}
    </Stack.Navigator>
  );
};
