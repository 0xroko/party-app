import { Button } from "@components/button";
import { Div, Img, T } from "@components/index";
import { NavBar } from "@components/navbar";
import { SafeArea } from "@components/safe-area";
import { UserFriendReqests } from "@features/user/friend-requests";
import { useAuthUser } from "@hooks/useAuthUser";
import { useUser } from "@hooks/useUser";
import { User } from "@lib/actions";
import { getRandomUserButNotMe } from "@lib/actions/user";
import { queryKeys } from "@lib/const";
import { supabase } from "@lib/supabase";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useValue } from "@shopify/react-native-skia";
import { FC } from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import { useQuery } from "react-query";

export const placeHolderBaseImage =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADxSURBVHgB7dFBAQAgDAChaYf1j6o17gEVOLv7how7pAiJERIjJEZIjJAYITFCYoTECIkREiMkRkiMkBghMUJihMQIiRESIyRGSIyQGCExQmKExAiJERIjJEZIjJAYITFCYoTECIkREiMkRkiMkBghMUJihMQIiRESIyRGSIyQGCExQmKExAiJERIjJEZIjJAYITFCYoTECIkREiMkRkiMkBghMUJihMQIiRESIyRGSIyQGCExQmKExAiJERIjJEZIjJAYITFCYoTECIkREiMkRkiMkBghMUJihMQIiRESIyRGSIyQGCExQmKExAiJERLzAWryAgaCD7znAAAAAElFTkSuQmCC";

const useRandomUser = () => {
  const q = useQuery("random-user", async () => {
    return (await getRandomUserButNotMe()) as User;
  });

  return q;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "grey",
  },
  sheetContainer: {
    // add horizontal space
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
});

export const ModalScreen: FC<
  NativeStackScreenProps<StackNavigatorParams, "user-modal">
> = ({ navigation, route }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  // listen to a change event from react-navigation to trigger bottom sheet close method.
  // variables
  const snapPoints = useMemo(() => ["55%"], []);
  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        navigation.goBack();
      }
    },
    [navigation]
  );
  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      backgroundStyle={{
        backgroundColor: "#050505",
      }}
      handleIndicatorStyle={{
        backgroundColor: "#494949",
      }}
      style={{
        backgroundColor: "#fff0ff00",
      }}
      containerStyle={{}}
      backdropComponent={() => (
        <Div className={`bg-glass-1 absolute inset-0`}></Div>
      )}
      // add bottom inset to elevate the sheet
      enablePanDownToClose
      enableOverDrag
      onClose={() => {}}
      enableHandlePanningGesture
      enableContentPanningGesture
      // set `detached` to true
      onChange={handleSheetChanges}
    >
      <Div className={`bg-accents-1 flex-1`}>
        <Div className={`h-16 flex flex-row w-full`}>
          <Div
            className={`flex grow border-b-2 border-b-accents-12  justify-center items-center`}
          >
            <Squares2X2Icon strokeWidth={2} size={26} color={"#fff"} />
          </Div>
          <Div
            className={`flex border-b-2 border-b-accents-1  grow justify-center items-center`}
          >
            <TagIcon size={26} strokeWidth={2} color={"#fff"} />
          </Div>
        </Div>
      </Div>
    </BottomSheet>
  );
};

import { Canvas, Circle, Group } from "@shopify/react-native-skia";

import { useImage } from "@shopify/react-native-skia";
import { withSpring } from "react-native-reanimated";
import { Chats } from "./chat/chats_list";
import { PartyAdd } from "./party/add";
import { UserInfoScreen } from "./user/id";

export const HelloWorld = () => {
  const size = 256;
  const r = size * 0.33;
  return (
    <Canvas style={{ flex: 1 }}>
      <Group blendMode="multiply">
        <Circle cx={r} cy={r} r={r} color="cyan" />
        <Circle cx={size - r} cy={r} r={r} color="magenta" />
        <Circle cx={size / 2} cy={size - r} r={r} color="yellow" />
      </Group>
    </Canvas>
  );
};

export const HomeNavigation = () => {
  const Tab = createBottomTabNavigator();
  const { data: authUser, isFetched, refetch } = useAuthUser();

  const { data: authUserData, isFetched: authUserFetched } = useUser(
    authUser?.user.id
  );
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        // keyboardHidesTabBar: true,
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          const { data: authUser, isFetched, refetch } = useAuthUser();
          const { data: authUserData, isFetched: authUserFetched } = useUser(
            authUser?.user.id
          );

          if (route.name === "Home") {
            return focused ? (
              <HomeIcon
                onPress={() => {
                  offset.value = withSpring(Math.random());
                }}
                size={size + 5}
                color={"white"}
                strokeWidth="2"
              />
            ) : (
              <HomeIcon size={size + 2} color={color} />
            );
          } else if (route.name === "Search") {
            return focused ? (
              <MagnifyingGlassIcon
                size={size + 5}
                color={"white"}
                strokeWidth="2"
              />
            ) : (
              <MagnifyingGlassIcon size={size + 2} color={color} />
            );
          } else if (route.name === "Add") {
            return focused ? (
              <PlusCircleIcon size={size + 5} color={"white"} strokeWidth="2" />
            ) : (
              <PlusCircleIcon size={size + 2} color={color} />
            );
          } else if (route.name === "Notifications") {
            return focused ? (
              <BellIcon size={size + 5} color={"white"} strokeWidth="2" />
            ) : (
              <BellIcon size={size + 2} color={color} />
            );
          } else if (route.name === "Profile") {
            return focused ? (
              <Img
                className={`w-7 h-7 rounded-full border-2 border-white`}
                source={{
                  uri: authUserData?.imagesId ?? "",
                }}
              />
            ) : (
              <Img
                className={`w-8 h-8 rounded-full border-3 border-gray-700`}
                source={{
                  uri: authUserData?.imagesId ?? "",
                }}
              />
            );
          }
        },
        tabBarAllowFontScaling: true,
        tabBarActiveBackgroundColor: "black",
        tabBarInactiveBackgroundColor: "black",
        tabBarStyle: {
          backgroundColor: "black",
          borderTopWidth: 0,
        },
        title: "",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={Chats} />
      <Tab.Screen name="Add" component={PartyAdd} />
      <Tab.Screen name="Notifications" component={UserFriendReqests} />
      <Tab.Screen
        name="Profile"
        component={UserInfoScreen}
        initialParams={{ id: authUser?.user.id }}
      />
    </Tab.Navigator>
  );
};

export const HomeScreen: FC<
  NativeStackScreenProps<StackNavigatorParams, "home">
> = ({ navigation, route }) => {
  const { data: authUser, isFetched, refetch } = useAuthUser();

  const { data: authUserData, isFetched: authUserFetched } = useUser(
    authUser?.user.id
  );
  const { data: randomUserData, isFetched: randomUserFetched } =
    useRandomUser();

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

  const { data: parties, isFetched: partiesFetched } = useParties();

  const image1 = useImage(require("../assets/ppp.png"));
  const size = useValue({ width: 0, height: 0 });
  // const Tab = createBottomTabNavigator();

  return (
    <SafeArea gradient>
      <NavBar leadingLogo />
      <Div className={`flex grow-0 mb-12`}>
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
              >
                <Div className={`flex g-3 w-24 h-36 items-center`}>
                  <Img
                    className={`w-20 h-20 rounded-full border-0 border-spacing-2 border-accents-12`}
                    source={{
                      uri: hostAvatar ?? placeHolderBaseImage,
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
      <SafeArea.Content>
        <Div className={`flex flex-col g-2`}>
          <Button
            disabled={!isFetched}
            onPress={() => {
              navigation.navigate("user", {
                id: authUser?.user.id,
                previousScreenName: "Home",
              });
            }}
          >
            My Profile
          </Button>

          <Button
            disabled={!isFetched}
            onPress={() => {
              navigation.navigate("user", {
                id: randomUserData?.id,
                previousScreenName: "Home",
              });
            }}
          >
            @{randomUserData?.displayname} (random user)
          </Button>
          <Button
            // disabled={!isFetched}
            onPress={() => {
              navigation.navigate("party-add");
            }}
          >
            Add party
          </Button>
          <Button
            onPress={() => {
              navigation.navigate("chats");
            }}
          >
            Chats
          </Button>
          <Button
            onPress={() => {
              navigation.navigate("upload-images");
            }}
          >
            Upload Image test
          </Button>

          <Button
            intent="secondary"
            onPress={() => {
              navigation.push("party-add-more", {
                id: parties[0]?.id,
                // previousScreenName: "Home",
              });
            }}
          >
            Random party page
          </Button>
          <Button
            intent="secondary"
            onPress={() => {
              navigation.push("party", {
                id: parties[0]?.id,
                previousScreenName: "Home",
              });
            }}
          >
            Random party page (true)
          </Button>
          <Button
            intent="secondary"
            onPress={() => {
              navigation.push("postAdd", {
                partyId: parties[0]?.id,
                previousScreenName: "Home",
              });
            }}
          >
            post add for {parties?.[0]?.name}
          </Button>
        </Div>
      </SafeArea.Content>
    </SafeArea>
  );
};
