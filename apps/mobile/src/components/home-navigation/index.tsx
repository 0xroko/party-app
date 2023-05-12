import { Img, PlaceHolderUserImage } from "@components/index";
import { HomeScreen } from "@features/home";
import { SearchPage } from "@features/search/page";
import { UserFriendReqests } from "@features/user/friend-requests";
import { UserInfoScreen } from "@features/user/id";
import { useUser } from "@hooks/query/useUser";
import { useAuthUser } from "@hooks/useAuthUser";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import {
  BellIcon,
  HomeIcon,
  PlusCircleIcon,
} from "react-native-heroicons/mini";
import { useSharedValue, withSpring } from "react-native-reanimated";

import { LinearGradient } from "expo-linear-gradient";
import {
  BellIcon as BellIconOutline,
  HomeIcon as HomeIconOutline,
  MagnifyingGlassIcon as MagnifyingGlassIconOutline,
  PlusCircleIcon as PlusCircleIconOutline,
} from "react-native-heroicons/outline";

export const HomeNavigation = () => {
  const Tab = createBottomTabNavigator();
  const { data: authUser, isFetched, refetch } = useAuthUser();
  const offset = useSharedValue(0);

  const { data: authUserData, isFetched: authUserFetched } = useUser(
    authUser?.user?.id
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        // keyboardHidesTabBar: true,
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === "Home") {
            return focused ? (
              <HomeIcon
                onPress={() => {
                  offset.value = withSpring(Math.random());
                }}
                size={size}
                color={"white"}
                strokeWidth="2.5"
              />
            ) : (
              <HomeIconOutline strokeWidth="2.5" size={size} color={color} />
            );
          } else if (route.name === "Search") {
            return focused ? (
              <MagnifyingGlassIconOutline
                size={size}
                color={"white"}
                strokeWidth="2.5"
              />
            ) : (
              <MagnifyingGlassIconOutline
                strokeWidth="2.5"
                size={size}
                color={color}
              />
            );
          } else if (route.name === "Add") {
            return focused ? (
              <PlusCircleIcon size={size} color={"white"} strokeWidth="2.5" />
            ) : (
              <PlusCircleIconOutline
                size={size}
                color={color}
                strokeWidth="2.5"
              />
            );
          } else if (route.name === "Notifications") {
            return focused ? (
              <BellIcon size={size} color={"white"} strokeWidth="2.3" />
            ) : (
              <BellIconOutline strokeWidth="2.3" size={size} color={color} />
            );
          } else if (route.name === "Profile") {
            return focused ? (
              <Img
                className={`w-7 h-7 rounded-full border-2 border-white`}
                source={
                  authUserData?.imagesId
                    ? {
                        uri: authUserData?.imagesId,
                      }
                    : PlaceHolderUserImage
                }
              />
            ) : (
              <Img
                className={`w-8 h-8 rounded-full border-3 border-gray-700`}
                source={
                  authUserData?.imagesId
                    ? {
                        uri: authUserData?.imagesId,
                      }
                    : PlaceHolderUserImage
                }
              />
            );
          }
        },
        tabBarAllowFontScaling: true,
        tabBarBackground: () => (
          // <Div
          //   className={` absolute top-0 bottom-0 left-0 right-0`}
          // ></Div>
          <LinearGradient
            pointerEvents="none"
            style={{
              position: "absolute",
              borderTopStartRadius: 20,
              borderTopEndRadius: 20,
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}
            locations={[0.0, 0.2, 1.1]}
            colors={["transparent", "rgba(0,0,0,0.1)", "rgba(0,0,0,1)"]}
          />
        ),
        tabBarIconStyle: {
          borderWidth: 0,
          elevation: 0,
          color: "white",
        },

        tabBarStyle: {
          borderWidth: 0,
          elevation: 0,
          zIndex: 100,
          height: 60,
          paddingTop: 10,
          backgroundColor: "transparent",
          borderTopWidth: 0,
          position: "absolute",
        },
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{
          showBackButton: true,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchPage}
        initialParams={{
          showBackButton: false,
          showNavBar: false,
        }}
      />
      {/* <Tab.Screen
        name="Add"
        component={PartyAdd}
        initialParams={{
          showBackButton: false,
        }}
      /> */}
      <Tab.Screen
        name="Notifications"
        component={UserFriendReqests}
        initialParams={{
          showBackButton: false,
          showNavBar: false,
        }}
      />

      <Tab.Screen
        name="Profile"
        component={UserInfoScreen}
        initialParams={{ id: authUserData?.id, showBackButton: false }}
      />
    </Tab.Navigator>
  );
};
