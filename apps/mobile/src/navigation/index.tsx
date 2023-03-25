import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FC } from "react";
import { LoginLoginScreen } from "../features/auth/signup-screen";


const Stack = createNativeStackNavigator<StackNavigatorParams>();

export const NativeNavigation: FC = () => {
  return (
    <Stack.Navigator>
      {/* <Stack.Screen
        options={{
          title: "Home",
          headerShown: false,
        }}
        name="home"
        component={HomeScreen}
      />
      <Stack.Screen
        options={{
          title: "User Details",
        }}
        name="user-detail"
        component={UserDetailScreen}
      />
      <Stack.Screen
        options={{
          title: "",
          headerShown: false,
        }}
        name="login"
        component={LoginScreen}
      /> */}
      <Stack.Screen
        options={{
          title: "",
          headerShown: false,
        }}
        name="login-login"
        component={LoginLoginScreen}
      />
    </Stack.Navigator>
  );
};
