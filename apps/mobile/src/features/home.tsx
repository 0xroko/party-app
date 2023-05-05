import { Button } from "@components/button";
import { Div, Img, T } from "@components/index";
import { NavBar } from "@components/navbar";
import { SafeArea } from "@components/safe-area";
import {
  BottomSheetScrollableProps,
  SCROLLABLE_TYPE,
} from "@gorhom/bottom-sheet";
import { useAuthUser } from "@hooks/useAuthUser";
import { useUser } from "@hooks/useUser";
import { User } from "@lib/actions";
import { getRandomUserButNotMe } from "@lib/actions/user";
import { queryKeys } from "@lib/const";
import { supabase } from "@lib/supabase";

import { createBottomSheetScrollableComponent } from "@gorhom/bottom-sheet";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlashListProps } from "@shopify/flash-list";
import { useValue } from "@shopify/react-native-skia";
import { FC, ReactNode, Ref, RefObject, memo } from "react";
import {
  Pressable,
  ScrollView,
  ScrollViewComponent,
  StyleSheet,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { useQuery } from "react-query";

export type BottomSheetFlashListProps<T> = Omit<
  Animated.AnimateProps<FlashListProps<T>>,
  "decelerationRate" | "onScroll" | "scrollEventThrottle"
> &
  BottomSheetScrollableProps & {
    ref?: Ref<BottomSheetFlashListMethods>;
  };

export interface BottomSheetFlashListMethods {
  /**
   * Scrolls to the end of the content. May be janky without `getItemLayout` prop.
   */
  scrollToEnd: (params?: { animated?: boolean | null }) => void;

  /**
   * Scrolls to the item at the specified index such that it is positioned in the viewable area
   * such that viewPosition 0 places it at the top, 1 at the bottom, and 0.5 centered in the middle.
   * Cannot scroll to locations outside the render window without specifying the getItemLayout prop.
   */
  scrollToIndex: (params: {
    animated?: boolean | null;
    index: number;
    viewOffset?: number;
    viewPosition?: number;
  }) => void;

  /**
   * Requires linear scan through data - use `scrollToIndex` instead if possible.
   * May be janky without `getItemLayout` prop.
   */
  scrollToItem: (params: {
    animated?: boolean | null;
    item: any;
    viewPosition?: number;
  }) => void;

  /**
   * Scroll to a specific content pixel offset, like a normal `ScrollView`.
   */
  scrollToOffset: (params: {
    animated?: boolean | null;
    offset: number;
  }) => void;

  /**
   * Tells the list an interaction has occured, which should trigger viewability calculations,
   * e.g. if waitForInteractions is true and the user has not scrolled. This is typically called
   * by taps on items or by navigation actions.
   */
  recordInteraction: () => void;

  /**
   * Displays the scroll indicators momentarily.
   */
  flashScrollIndicators: () => void;

  /**
   * Provides a handle to the underlying scroll responder.
   */
  getScrollResponder: () => ReactNode | null | undefined;

  /**
   * Provides a reference to the underlying host component
   */
  getNativeScrollRef: () =>
    | RefObject<View>
    | RefObject<ScrollViewComponent>
    | null
    | undefined;

  getScrollableNode: () => any;

  // TODO: use `unknown` instead of `any` for Typescript >= 3.0
  setNativeProps: (props: { [key: string]: any }) => void;
}

const AnimatedFlashList =
  Animated.createAnimatedComponent<FlashListProps<any>>(FlashList);

const BottomSheetFlashListComponent = createBottomSheetScrollableComponent<
  BottomSheetFlashListMethods,
  BottomSheetFlashListProps<any>
>(SCROLLABLE_TYPE.FLASHLIST, AnimatedFlashList);

const BottomSheetFlashList = memo(BottomSheetFlashListComponent);
BottomSheetFlashList.displayName = "BottomSheetFlashList";

export default BottomSheetFlashList as <T>(
  props: BottomSheetFlashListProps<T>
) => ReturnType<typeof BottomSheetFlashList>;

import { useImage } from "@shopify/react-native-skia";
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

import { FlashList } from "@shopify/flash-list";

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
