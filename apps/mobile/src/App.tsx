import { useFonts } from "expo-font";

import { FC, useEffect, useRef, useState } from "react";
import { Keyboard, KeyboardAvoidingView } from "react-native";

import { NativeNavigation } from "./navigation";
import { Provider } from "./provider";

import { registerForPushNotificationsAsync } from "@lib/actions/user";
import { useAuthStore } from "@navigation/authStore";
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import { accept_friend_request, decline_friend_request } from "@lib/frendship/add_friend";
import { useAuthUser } from "@hooks/useAuthUser";
import { supabase } from "@lib/supabase";

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

Notifications.setNotificationCategoryAsync('friendship_request', [
  {
    buttonTitle: `Prihvati`,
    identifier: 'accept-friendship-request',

  },
  {
    buttonTitle: 'Odbij',
    identifier: 'decline-friendship-request',
    // textInput: {
    //   submitButtonTitle: 'Submit button',
    //   placeholder: 'Placeholder text',
    // },
  },
  {
    buttonTitle: 'Otvori u aplikaciji',
    identifier: 'open-friendship-request',
    options: {
      opensAppToForeground: true,
    },
  },
])
  .then((_category) => console.log("Set notification categoryar"))
  .catch((error) => console.warn('Could not have set notification category', error));

Notifications.setNotificationCategoryAsync('new_party_notification', [
  {
    buttonTitle: `Dolazim`,
    identifier: 'accept-party-attendance',
    options: {
      opensAppToForeground: true,
    },

  },
  {
    buttonTitle: 'Ne dolazim',
    identifier: 'decline-party-attendance',

  },
  {
    buttonTitle: 'Pošalji poruku',
    identifier: 'send-message',
    textInput: {
      submitButtonTitle: 'Submit button',
      placeholder: 'Vaša poruka',
    },
  },
])
  .then((_category) => console.log("Set notification categoryar"))
  .catch((error) => console.warn('Could not have set notification category', error));

// Notifications.setNotificationCategoryAsync('generic_party_notification', [
//   {
//     buttonTitle: 'Pošalji poruku',
//     identifier: 'send-message',
//     textInput: {
//       submitButtonTitle: 'Submit button',
//       placeholder: 'Vaša poruka',
//     },
//   },
// ])
//   .then((_category) => console.log("Set notification categoryar"))
//   .catch((error) => console.warn('Could not have set notification category', error));


Notifications.setNotificationCategoryAsync('generic_party_notification', [
  {
    buttonTitle: 'Pošalji poruku',
    identifier: 'send-message',
    textInput: {
      submitButtonTitle: 'Submit button',
      placeholder: 'Vaša poruka',
    },
  },
  {
    buttonTitle: 'Otvori u aplikaciji',
    identifier: 'open-friendship-request',
    options: {
      opensAppToForeground: true,
    },
  },
])
  .then((_category) => console.log("Set notification categoryar"))
  .catch((error) => console.warn('Could not have set notification category', error));



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

    // notificationListener.current =
    //add category to notification
    // Notifications.addNotificationsCategoryAsync()


    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(async (response) => {
        // console.log(response);
        const { actionIdentifier, notification, identifier, trigger } = response;
        console.log(actionIdentifier, notification, identifier, trigger);
        // const { data: authUser, isFetched, refetch } = useQuery(["user-auth"], async () => {
        const { data: authUser, error } = await supabase.auth.getUser();


        // create switch case for each action identifier
        if (actionIdentifier === 'accept-friendship-request') {
          const r = await accept_friend_request(
            notification.request.content.data.userAid,
            authUser?.user
          )
          console.log(r);
        } else if (actionIdentifier === 'decline-friendship-request') {
          await decline_friend_request(notification.request.content.data.userAid);
        } else if (actionIdentifier === 'decline-party-attendance') {
          const { data, error } = await supabase.from('Attending')
            .update({
              accepted: false,
            })
            .eq('partyId', notification.request.content.data.partyId)
            .eq('userId', authUser?.user.id)
          console.log(actionIdentifier, data, error);
        } else if (actionIdentifier === 'accept-party-attendance') {
          console.log(notification.request.content.data.party_id)
          const { data, error } = await supabase.from('Attending')
            .update({
              accepted: true,
            })
            .eq('partyId', notification.request.content.data.partyId)
            .eq('userId', authUser?.user.id)
          console.log(actionIdentifier, data, error);
        }
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
