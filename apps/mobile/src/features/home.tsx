import { Div, Img, T } from "@components/index";
import { NavBar } from "@components/navbar";
import { SafeArea } from "@components/safe-area";
import { UserFriendReqests } from "@features/user/friend-requests";
import { useUser } from "@hooks/query/useUser";
import { useAuthUser } from "@hooks/useAuthUser";
import { User } from "@lib/actions";
import { getRandomUserButNotMe } from "@lib/actions/user";
import { queryKeys } from "@lib/const";
import { supabase } from "@lib/supabase";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { FC } from "react";
import { Pressable, ScrollView } from "react-native";
import { useQuery } from "react-query";

import {
  BellIcon,
  HomeIcon,
  PlusCircleIcon,
} from "react-native-heroicons/mini";

import { LinearGradient } from "expo-linear-gradient";
import {
  BellIcon as BellIconOutline,
  HomeIcon as HomeIconOutline,
  MagnifyingGlassIcon as MagnifyingGlassIconOutline,
  PlusCircleIcon as PlusCircleIconOutline,
} from "react-native-heroicons/outline";
import { useSharedValue, withSpring } from "react-native-reanimated";
import { PartyAdd } from "./party/add";
import { SearchPage } from "./search/page";
import { UserInfoScreen } from "./user/id";
export const placeHolderBaseImage =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADxSURBVHgB7dFBAQAgDAChaYf1j6o17gEVOLv7how7pAiJERIjJEZIjJAYITFCYoTECIkREiMkRkiMkBghMUJihMQIiRESIyRGSIyQGCExQmKExAiJERIjJEZIjJAYITFCYoTECIkREiMkRkiMkBghMUJihMQIiRESIyRGSIyQGCExQmKExAiJERIjJEZIjJAYITFCYoTECIkREiMkRkiMkBghMUJihMQIiRESIyRGSIyQGCExQmKExAiJERIjJEZIjJAYITFCYoTECIkREiMkRkiMkBghMUJihMQIiRESIyRGSIyQGCExQmKExAiJERLzAWryAgaCD7znAAAAAElFTkSuQmCC";

const useRandomUser = () => {
  const q = useQuery("random-user", async () => {
    return (await getRandomUserButNotMe()) as User;
  });

  return q;
};

const useParties = () => {
  const q = useQuery(queryKeys.latestParties, async () => {
    const { data, error } = await supabase
      .from("Party")
      .select(
        `*,
        host: hostId(id, displayname, imagesId)
    `
      )
      .order("id");

    return data;
  });

  return q;
};

interface HomePartysProps {
  children?: React.ReactNode | React.ReactNode[];
  navigation?: NativeStackNavigationProp<
    StackNavigatorParams,
    "home",
    undefined
  >;
}

export const HomePartys = ({ children, navigation }: HomePartysProps) => {
  const { data: authUser, isFetched, refetch } = useAuthUser();

  const { data: parties, isFetched: partiesFetched } = useParties();
  const { data: authUserData, isFetched: authUserFetched } = useUser(
    authUser?.user.id
  );

  return (
    <Div className={`flex grow-0 mb-5`}>
      <ScrollView
        horizontal
        contentContainerStyle={{
          paddingTop: 8,
          alignItems: "center",
          flexDirection: "row",
          paddingHorizontal: 18,
          gap: 8,
        }}
      >
        <Pressable
          key={authUser?.user.id}
          onPress={() => {
            navigation.navigate("party-add");
          }}
        >
          <Div className={`flex g-3 w-24 h-36 items-center`}>
            <Div className={`relative`}>
              <Div
                className={`absolute -right-2 -top-2 w-8 h-8 flex justify-center z-50 items-center rounded-full bg-accents-5`}
              >
                <T
                  className={`font-figtree-semi-bold text-3xl leading-8 text-accents-12`}
                >
                  +
                </T>
              </Div>
              <Img
                className={`w-20 h-20 rounded-full`}
                source={{
                  uri: authUserData?.imagesId ?? placeHolderBaseImage,
                }}
              ></Img>
            </Div>
            <T
              className={`text-center text-accents-12 font-figtree-bold text-sm px-1`}
            >
              Dodaj party
            </T>
          </Div>
        </Pressable>
        {parties?.map((party) => {
          // @ts-ignore
          const hostAvatar = party?.host?.imagesId;
          return (
            <Pressable
              key={party.id}
              onPress={() => {
                navigation.navigate("chat", {
                  id: party.chatId,
                });
              }}
              onLongPress={() => {
                navigation.navigate("party", {
                  id: party.id,
                  previousScreenName: "Home",
                });
              }}
            >
              <Div className={`flex g-3 w-24 h-36 items-center`}>
                <Img
                  className={`w-20 h-20 rounded-full border-0 border-spacing-2 border-accents-12`}
                  source={{
                    uri: party.imageUrl ?? hostAvatar ?? placeHolderBaseImage,
                  }}
                ></Img>
                <T
                  className={`text-center text-accents-12 font-figtree-bold text-sm px-1`}
                >
                  {party.name}
                </T>
              </Div>
            </Pressable>
          );
        })}
      </ScrollView>
    </Div>
  );
};

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
              <BellIcon size={size} color={"white"} strokeWidth="2.5" />
            ) : (
              <BellIconOutline strokeWidth="2.5" size={size} color={color} />
            );
          } else if (route.name === "Profile") {
            return focused ? (
              <Img
                className={`w-7 h-7 rounded-full border-2 border-white`}
                source={{
                  uri: authUserData?.imagesId ?? placeHolderBaseImage,
                }}
              />
            ) : (
              <Img
                className={`w-8 h-8 rounded-full border-3 border-gray-700`}
                source={{
                  uri: authUserData?.imagesId ?? placeHolderBaseImage,
                }}
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
      <Tab.Screen
        name="Add"
        component={PartyAdd}
        initialParams={{
          showBackButton: false,
        }}
      />
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

export const HomeScreen: FC<
  NativeStackScreenProps<StackNavigatorParams, "home">
> = ({ navigation, route }) => {
  const { data: authUser, isFetched, refetch } = useAuthUser();

  return (
    <SafeArea gradient>
      <NavBar leadingLogo />
      <HomePartys navigation={navigation} />
      <SafeArea.ContentScrollView>
        <Div className={`flex flex-col g-2`}>
          <Div className={`w-full h-screen bg-slate-500 mb-4`}>
            <T className={`text-xl text-white`}>- jos ovo!</T>
          </Div>
        </Div>
      </SafeArea.ContentScrollView>
    </SafeArea>
  );
};
