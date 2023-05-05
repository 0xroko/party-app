import { Div, Img, Text } from "@components/index";
import { SafeArea } from "@components/safe-area";
import {
  EllipsisVerticalIcon,
  Squares2X2Icon,
  TagIcon,
  UserPlusIcon,
} from "react-native-heroicons/outline";

import { MapPinIcon } from "react-native-heroicons/mini";

import { Badge } from "@components/badge";
import { Button } from "@components/button";
import { NavBar, NavBarItem } from "@components/navbar";
import { useAuthUser } from "@hooks/useAuthUser";
import { useUser } from "@hooks/useUser";
import { User } from "@lib/actions";
import { queryKeys } from "@lib/const";
import {
  accept_friend_request,
  checkIfFriend,
  decline_friend_request,
  remove_friend,
  send_friend_request,
  unsend_friend_request,
} from "@lib/frendship/add_friend";
import { formatBio, formatName, formatUserDisplayName } from "@lib/misc";
import { supabase } from "@lib/supabase";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthUser } from "@supabase/supabase-js";
import { styled } from "nativewind";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { useMutation, useQuery } from "react-query";
import colors from "../../../colors";

export type useFriendshipAction =
  | "sendRequest"
  | "acceptRequest"
  | "removeFriend"
  | "unsendRequest"
  | "declineRequest";

export const useFriendship = (id: User["id"]) => {
  const authUser = useAuthUser();

  const q = useQuery(
    queryKeys.friendship(id),
    async () => {
      return await checkIfFriend(id, authUser.data.user);
    },
    {
      enabled: !!authUser.data,
    }
  );

  const m = useMutation({
    mutationFn: async ({
      action,
      authUser,
    }: {
      action: useFriendshipAction;
      authUser: AuthUser;
    }) => {
      switch (action) {
        case "sendRequest":
          return await send_friend_request(id, authUser);
        case "acceptRequest":
          return await accept_friend_request(id, authUser);
        case "removeFriend":
          return await remove_friend(id, authUser);
        case "unsendRequest":
          return await unsend_friend_request(id, authUser);
        case "declineRequest":
          return await decline_friend_request(id, authUser);
      }
    },
  });

  return {
    ...q,
    friendshipMutation: m,
  };
};

export type FriendshipUser = Pick<
  User,
  "id" | "displayname" | "surname" | "name" | "imagesId"
>;

interface UserListProps {
  children?: React.ReactNode | React.ReactNode[];
  users: FriendshipUser[];
  title?: string;
  emptyText?: string;
  onUserPress?: (user: FriendshipUser) => void;
}

export const StyledScrollDiv = styled(ScrollView);

export const UserList = ({
  users,
  onUserPress,
  title,
  emptyText,
}: UserListProps) => {
  const hasFriends = users.length > 0;

  return (
    <Div
      className={`flex flex-col g-7 px-5 bg-accents-1 rounded-3xl py-6 border-accents-2 border`}
    >
      <Text className={`font-figtree-bold text-accents-12 text-xl`}>
        {title ? title : "Prijatelji"}
      </Text>
      {hasFriends ? (
        <ScrollView
          horizontal
          contentContainerStyle={{
            alignItems: "center",
            flexDirection: "row",
            gap: 22,
          }}
        >
          {users.map((user, i) => (
            <Pressable
              key={i.toString()}
              onPress={() => {
                onUserPress?.(user);
              }}
            >
              <Div className={`flex flex-col items-center justify-between g-4`}>
                <Img
                  className={`w-28 h-28 rounded-full`}
                  source={{
                    uri:
                      user.imagesId ??
                      "https://images.unsplash.com/photo-1657320815727-2512f49f61d5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100&q=60",
                  }}
                />
                <Div className={`flex flex-col items-center  justify-center`}>
                  <Text
                    className={`font-figtree-bold text-center text-lg text-accents-12`}
                  >
                    {formatName(user.name, user.surname)}
                  </Text>
                  <Text className={`font-figtree text-accents-11 text-center`}>
                    {formatUserDisplayName(user.displayname)}
                  </Text>
                </Div>
              </Div>
            </Pressable>
          ))}
        </ScrollView>
      ) : (
        <Div className={`h-44 flex items-center justify-center`}>
          <Text className={`text-accents-10 text-base font-figtree-medium`}>
            {emptyText ?? "Korisnik nema prijatelja"}
          </Text>
        </Div>
      )}
    </Div>
  );
};

export const useFriendRequestCount = (user: User, isMe: boolean) => {
  const req = useQuery(
    queryKeys.friendRequestCount,
    async () => {
      return await supabase
        .from("Friendship")
        .select("*", { count: "exact", head: true })
        .eq("userBId", user?.id)
        .eq("accepted", false);
    },
    {
      enabled: isMe,
    }
  );

  return req;
};

export const useFriends = (userId: User["id"], page: number = 0) => {
  const req = useQuery(
    queryKeys.friends(userId, page),
    async () => {
      return await supabase
        .from("Friendship")
        .select(
          "id, userAId, userBId, accepted, userB: userBId (id, name, surname, displayname, imagesId)"
        )
        .eq("userAId", userId)
        .eq("accepted", true)
        .order("createdAt", { ascending: false })
        .range(page * 10, (page + 1) * 10);
    },
    {
      enabled: !!userId,
    }
  );

  return req;
};

import BottomSheet from "@gorhom/bottom-sheet";
import { uploadPfp } from "@lib/actions/img";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
} from "react-native";
import {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

export const UserInfoScreen: FC<
  NativeStackScreenProps<StackNavigatorParams, "user">
> = ({ navigation, route }) => {
  const userId = route.params?.id;

  const [stickyRendered, setStickyRendered] = useState(false);

  const { data: authUser, isFetched } = useAuthUser();
  const {
    data: user,
    isLoading,
    refetch,
    isFetched: isUserFetched,
  } = useUser(userId);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: friends } = useFriends(userId);

  const {
    data: friendShipStatus,
    refetch: refetchStatus,
    friendshipMutation,
  } = useFriendship(userId);

  const isMe = authUser?.user?.id === userId;

  const handleDataPress = () => {
    if (!isMe) return;
    navigation.push("user-edit", {
      previousScreenName: formatUserDisplayName(user.displayname),
    });
  };

  const handleUserAction = (userId: string, authUser: AuthUser) => {
    if (!isMe) {
      if (friendShipStatus === "friend") {
        return {
          actionFn: async () =>
            friendshipMutation.mutateAsync({
              action: "removeFriend",
              authUser,
            }),
          text: "Remove friend",
        };
      } else if (friendShipStatus === "accept") {
        return {
          actionFn: async () =>
            friendshipMutation.mutateAsync({
              action: "acceptRequest",
              authUser,
            }),
          secoundaryActionFn: async () =>
            friendshipMutation.mutateAsync({
              action: "declineRequest",
              authUser,
            }),
          secoundaryText: "Decline request",
          text: "Accept request",
        };
      } else if (friendShipStatus === "none") {
        return {
          actionFn: async () =>
            friendshipMutation.mutateAsync({ action: "sendRequest", authUser }),
          text: "Send friend request",
        };
      } else if (friendShipStatus === "requested") {
        return {
          actionFn: async () =>
            friendshipMutation.mutateAsync({
              action: "unsendRequest",
              authUser,
            }),
          text: "Cancel request",
        };
      }
    }
    return {
      actionFn: async () => {
        handleDataPress();
      },
      text: "Edit profile",
    };
  };

  const { actionFn, text, ...actions } = useMemo(() => {
    return handleUserAction(user?.id, authUser.user);
  }, [friendShipStatus, user, authUser]);

  const { data: friendRequestCount } = useFriendRequestCount(user, isMe);

  const imageRef = useRef<typeof Img>(null);

  const hasBio = user?.bio?.length > 0;

  const bottomSheetRef = useRef<BottomSheet>(null);
  // listen to a change event from react-navigation to trigger bottom sheet close method.
  // variables
  // const handleSheetChanges = useCallback((index: number) => {}, [navigation]);

  useEffect(() => {
    bottomSheetRef.current?.snapToIndex(0);
  }, []);

  const { data: posts } = useQuery(
    queryKeys.postsByUser(user?.id, 0),
    async () => {
      const { data, error } = await supabase
        .from("Images")
        .select(`*`)
        .filter("authorId", "eq", user?.id)
        .order("createdAt", { ascending: false });

      return data;
    },
    {
      enabled: !!user?.id,
    }
  );

  const pdn = Dimensions.get("window").height / 3;

  const scrollRef = useRef<ScrollView>(null);

  const am = useSharedValue(0);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const percentageView =
      e.nativeEvent.contentOffset.y /
      (e.nativeEvent.contentSize.height -
        e.nativeEvent.layoutMeasurement.height);

    console.log(percentageView);

    if (percentageView > 0.8) {
      if (animatedIndex.value === 0) bottomSheetRef.current?.snapToIndex(1);
    } else {
      if (animatedIndex.value === 1) bottomSheetRef.current?.snapToIndex(0);
    }

    am.value = percentageView;
  };

  const animatedIndex = useSharedValue(0);

  const backDropStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        animatedIndex.value,
        [1, 2],
        [0, 1],
        Extrapolate.CLAMP
      ),
    };
  });

  const [backDropPointerEvents, setBackDropPointerEvents] =
    useState<string>("none");

  useAnimatedReaction(
    () => animatedIndex,
    (index) => {
      if (index.value > 1) {
        runOnJS(setBackDropPointerEvents)("auto");
      } else {
        runOnJS(setBackDropPointerEvents)("none");
      }
    },
    [animatedIndex]
  );

  const headerHeight = useRef<number>(0);

  const postsWithStickyHeader = useMemo(() => {
    if (!posts) return [];
    let postsWithStickyHeader: any = [...posts];

    if (posts?.length > 0)
      postsWithStickyHeader[0] = Object.assign(postsWithStickyHeader[0], {
        withStickyHeader: true,
      });

    return postsWithStickyHeader;
  }, [posts]) as any;

  return (
    <SafeArea gradient={!stickyRendered}>
      <NavBar includeDefaultTrailing={isMe}>
        {isMe && (
          <NavBarItem
            onPress={() => {
              navigation.push("user-friend-request", {
                previousScreenName: formatUserDisplayName(user.displayname),
              });
            }}
          >
            {friendRequestCount?.count > 0 && (
              <Div
                className={`bg-accents-7 shadow-md rounded-full p-1 absolute min-w-[16px] text-center flex justify-center items-center right-1 top-0 z-30`}
              >
                <Text
                  className={`text-[8px] text-accents-12 font-figtree-black`}
                >
                  {friendRequestCount?.count}
                </Text>
              </Div>
            )}
            <UserPlusIcon strokeWidth={2} size={24} color="#fff" />
          </NavBarItem>
        )}
      </NavBar>

      <Div className={`flex-1`}>
        {/* <Div className={`absolute w-14 z-40   h-15 bg-red-300`} /> */}
        <Div style={{ flex: 1, marginTop: 2 }}>
          {isUserFetched && (
            <FlashList
              stickyHeaderHiddenOnScroll={false}
              ListHeaderComponent={() => {
                return (
                  <>
                    <Div
                      onLayout={(e) => {
                        headerHeight.current = e.nativeEvent.layout.height;
                      }}
                    >
                      <Div className={`flex mx-[18px]`}>
                        <Div className={`flex flex-col  items-center`}>
                          <Pressable
                            onPress={async () => {
                              if (isMe) {
                                await uploadPfp({ userId: user.id });
                                refetch();
                              }
                            }}
                          >
                            <Img
                              className={`rounded-full w-[124px] h-[124px] mt-4`}
                              source={{
                                uri:
                                  user.imagesId ??
                                  "https://images.unsplash.com/photo-1657320815727-2512f49f61d5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100&q=60",
                                width: 100,
                              }}
                            />
                          </Pressable>
                          <Pressable onPress={handleDataPress}>
                            <Div className={`mt-6`}>
                              <Text
                                className={`text-4xl text-center font-figtree-bold text-accents-12`}
                              >
                                {user?.name} {user?.surname}
                              </Text>
                            </Div>
                            <Div className={`mt-1`}>
                              <Text
                                className={`text-2xl text-center font-figtree-medium tracking-tight text-accents-10`}
                              >
                                @{user?.displayname}
                              </Text>
                            </Div>
                          </Pressable>
                          <Pressable onPress={handleDataPress}>
                            <Div
                              className={`mt-6 g-3 flex flex-row items-center justify-center`}
                            >
                              {user?.location ? (
                                <Badge
                                  icon={<MapPinIcon color={"#fff"} size={16} />}
                                  intent="primary"
                                >
                                  {user?.location}
                                </Badge>
                              ) : (
                                <Badge
                                  icon={
                                    <MapPinIcon
                                      color={colors.accents[9]}
                                      size={16}
                                    />
                                  }
                                  intent="disabled"
                                >
                                  ???? grad
                                </Badge>
                              )}
                              {user?.age ? (
                                <Badge intent="primary">{user?.age} god.</Badge>
                              ) : (
                                <Badge intent="disabled">?? god.</Badge>
                              )}
                            </Div>
                          </Pressable>
                          <Pressable onPress={handleDataPress}>
                            <Div className={`mt-10 max-h-[79px]`}>
                              <Text
                                className={`font-figtree-medium text-base text-center ${
                                  !hasBio
                                    ? "text-accents-10"
                                    : "text-accents-12"
                                } tracking-wide leading-7`}
                              >
                                {formatBio(user?.bio)}
                              </Text>
                            </Div>
                          </Pressable>
                          <Div className={`mt-16 flex g-4 flex-row w-full`}>
                            <Div className={`flex grow`}>
                              <Button
                                disabled={isSubmitting}
                                onPress={async () => {
                                  setIsSubmitting(true);
                                  await actionFn();
                                  refetchStatus();
                                  setIsSubmitting(false);
                                }}
                              >
                                {text}
                              </Button>
                            </Div>
                            {actions.secoundaryActionFn && (
                              <Div className={`flex grow`}>
                                <Button
                                  disabled={isSubmitting}
                                  onPress={async () => {
                                    setIsSubmitting(true);
                                    await actions.secoundaryActionFn();
                                    refetchStatus();
                                    setIsSubmitting(false);
                                  }}
                                >
                                  {actions.secoundaryText}
                                </Button>
                              </Div>
                            )}
                            <Div className={`flex grow-0 shrink`}>
                              <Button iconOnly className={`w-10`}>
                                <EllipsisVerticalIcon
                                  strokeWidth={2}
                                  size={20}
                                  color={"#000"}
                                />
                              </Button>
                            </Div>
                          </Div>
                        </Div>
                      </Div>
                      <Div className={`mt-8 mx-2`}>
                        {friends?.data?.length > 0 && (
                          <UserList
                            onUserPress={(u) => {
                              navigation.push("user", {
                                id: u?.id,
                                previousScreenName: formatUserDisplayName(
                                  user.displayname
                                ),
                              });
                            }}
                            users={friends?.data?.map((t) => t.userB) as any}
                          />
                        )}
                      </Div>
                      <Div
                        className={`h-16 bg-black mt-8 rounded-t-2xl flex flex-row w-full`}
                      >
                        <Div
                          className={`flex grow border-b-2 border-b-accents-12  justify-center items-center`}
                        >
                          <Squares2X2Icon
                            strokeWidth={2}
                            size={26}
                            color={"#fff"}
                          />
                        </Div>
                        <Div
                          className={`flex border-b-2 border-b-accents-1  grow justify-center items-center`}
                        >
                          <TagIcon size={26} strokeWidth={2} color={"#fff"} />
                        </Div>
                      </Div>
                    </Div>
                  </>
                );
              }}
              numColumns={3}
              stickyHeaderIndices={[0]}
              data={postsWithStickyHeader}
              onScroll={(e) => {
                const miniheaderHeight = 64;
                const scrollY = e.nativeEvent.contentOffset.y;

                if (scrollY > headerHeight.current) {
                  setStickyRendered(true);
                } else {
                  setStickyRendered(false);
                }
              }}
              ListFooterComponent={() => {
                return (
                  <Div className={`h-60 bg-black`}>
                    {postsWithStickyHeader?.length === 0 && (
                      <Div
                        className={`flex flex-col items-center justify-center h-full`}
                      >
                        <Text
                          className={`text-lg font-figtree-medium text-accents-11`}
                        >
                          Korisnik nema objava
                        </Text>
                      </Div>
                    )}
                  </Div>
                );
              }}
              renderItem={({ item, index, target }: any) => {
                if (item.withStickyHeader) {
                  if (target === "StickyHeader") {
                    return (
                      <Div className={`h-16 bg-black flex flex-row w-full`}>
                        <Div
                          className={`flex grow border-b-2 border-b-accents-12  justify-center items-center`}
                        >
                          <Squares2X2Icon
                            strokeWidth={2}
                            size={26}
                            color={"#fff"}
                          />
                        </Div>
                        <Div
                          className={`flex border-b-2 border-b-accents-1  grow justify-center items-center`}
                        >
                          <TagIcon size={26} strokeWidth={2} color={"#fff"} />
                        </Div>
                      </Div>
                    );
                  }
                }
                return (
                  <Pressable
                    style={{ flex: 1 }}
                    onPress={() => {
                      navigation.push("post", {
                        id: item.id,
                        previousScreenName: "Home",
                      });
                    }}
                  >
                    <Image
                      style={{ aspectRatio: 1, flex: 1 }}
                      // recyclingKey={item.id.toString()}
                      contentFit="cover"
                      source={{
                        uri: item?.pic_url,
                      }}
                    />
                  </Pressable>
                );
              }}
              estimatedItemSize={200}
            />
          )}
        </Div>
      </Div>
      {/* </ScrollView> */}

      {/* </BottomSheet> */}
    </SafeArea>
  );
};
