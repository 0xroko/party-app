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
import { Spinner } from "@components/spinner";
import { useFriendRequestCount } from "@hooks/query/useFriendReqestCount";
import { useFriends } from "@hooks/query/useFriends";
import { FriendshipUser, useFriendship } from "@hooks/query/useFriendship";
import { useUser } from "@hooks/query/useUser";
import {
  UserPostListType,
  addFillerPosts,
  useUserPosts,
} from "@hooks/query/useUserPosts";
import { useAuthUser } from "@hooks/useAuthUser";
import { uploadPfp } from "@lib/actions/img";
import { queryKeys } from "@lib/const";
import { formatBio, formatName, formatUserDisplayName } from "@lib/misc";
import { queryClient } from "@lib/queryCache";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";
import { AuthUser } from "@supabase/supabase-js";
import { Image } from "expo-image";
import { styled } from "nativewind";
import { FC, useMemo, useRef, useState } from "react";
import { Pressable, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import colors from "../../../colors";

interface BaseUserListUser {
  id: string;
  displayname: string;
  surname: string;
  name: string;
  imagesId: string;
}
interface UserListUser extends BaseUserListUser {}

interface UserListProps {
  children?: React.ReactNode | React.ReactNode[];
  users: UserListUser[];
  title?: string;
  loading?: boolean;
  emptyText?: string;
  onViewAllPress?: () => void;
  onUserPress?: (user: FriendshipUser) => void;
}

export const StyledScrollDiv = styled(ScrollView);

export const UserList = ({
  users,
  onUserPress,
  title,
  loading = false,
  emptyText,
  onViewAllPress,
}: UserListProps) => {
  const hasFriends = users?.length > 0;

  return (
    <Div
      className={`flex flex-col g-7 px-5 bg-accents-1 rounded-3xl py-6 border-accents-2 border`}
    >
      <Div className={`w-full flex justify-between flex-row`}>
        <Text className={`font-figtree-bold text-accents-12 text-xl`}>
          {title ? title : "Prijatelji"}
        </Text>
        <Pressable onPress={onViewAllPress}>
          <Text className={`font-figtree-semi-bold text-accents-11 text-base`}>
            Vidi sve
          </Text>
        </Pressable>
      </Div>
      {loading ? (
        <Div className={`h-44 flex items-center justify-center`}>
          <Spinner />
        </Div>
      ) : (
        <>
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
                  <Div
                    className={`flex flex-col items-center justify-between g-4`}
                  >
                    <Img
                      className={`w-28 h-28 rounded-full`}
                      source={{
                        uri:
                          user.imagesId ??
                          "https://images.unsplash.com/photo-1657320815727-2512f49f61d5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100&q=60",
                      }}
                    />
                    <Div
                      className={`flex flex-col items-center  justify-center`}
                    >
                      <Text
                        className={`font-figtree-bold text-center text-lg text-accents-12`}
                      >
                        {formatName(user.name, user.surname)}
                      </Text>
                      <Text
                        className={`font-figtree text-accents-11 text-center`}
                      >
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
        </>
      )}
    </Div>
  );
};

export const UserInfoScreen: FC<
  NativeStackScreenProps<StackNavigatorParams, "user">
> = ({ navigation, route }) => {
  const [stickyRendered, setStickyRendered] = useState(false);

  const { data: authUser, isFetched } = useAuthUser();
  const userId = route.params?.id ?? authUser?.user?.id ?? "";
  const {
    data: user,
    isLoading,
    refetch,
    isFetched: isUserFetched,
  } = useUser(userId);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: friends, isLoading: friendLoading } = useFriends(userId);

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
          actionFn: async () => {
            await friendshipMutation.mutateAsync({
              action: "removeFriend",
              authUser,
            });

            queryClient.invalidateQueries(queryKeys.friends(userId, 0));
            queryClient.invalidateQueries(queryKeys.friendship(userId));
            queryClient.invalidateQueries(queryKeys.friendRequestCount);
          },
          text: "Remove friend",
        };
      } else if (friendShipStatus === "accept") {
        return {
          actionFn: async () => {
            await friendshipMutation.mutateAsync({
              action: "acceptRequest",
              authUser,
            });
            queryClient.invalidateQueries(queryKeys.friends(userId, 0));
            queryClient.invalidateQueries(queryKeys.friendship(userId));
            queryClient.invalidateQueries(queryKeys.friendRequestCount);
          },
          secoundaryActionFn: async () => {
            friendshipMutation.mutateAsync({
              action: "declineRequest",
              authUser,
            });
            queryClient.invalidateQueries(queryKeys.friends(userId, 0));
            queryClient.invalidateQueries(queryKeys.friendship(userId));
            queryClient.invalidateQueries(queryKeys.friendRequestCount);
          },
          secoundaryText: "Decline request",
          text: "Accept request",
        };
      } else if (friendShipStatus === "none") {
        return {
          actionFn: async () => {
            friendshipMutation.mutateAsync({ action: "sendRequest", authUser });
            queryClient.invalidateQueries(queryKeys.friends(userId, 0));
            queryClient.invalidateQueries(queryKeys.friendship(userId));
            queryClient.invalidateQueries(queryKeys.friendRequestCount);
          },
          text: "Send friend request",
        };
      } else if (friendShipStatus === "requested") {
        return {
          actionFn: async () => {
            friendshipMutation.mutateAsync({
              action: "unsendRequest",
              authUser,
            });
            queryClient.invalidateQueries(queryKeys.friends(userId, 0));
            queryClient.invalidateQueries(queryKeys.friendship(userId));
            queryClient.invalidateQueries(queryKeys.friendRequestCount);
          },
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
    return handleUserAction(user?.id, authUser?.user);
  }, [friendShipStatus, user, authUser]);

  const { data: friendRequestCount } = useFriendRequestCount(user, isMe);

  const hasBio = user?.bio?.length > 0;

  const { data: posts, isLoading: postLoading } = useUserPosts(userId);

  const headerHeight = useRef<number>(0);

  const postsWithStickyHeader = useMemo<UserPostListType[]>(() => {
    return addFillerPosts(posts);
  }, [posts]);

  return (
    <SafeArea gradient={!stickyRendered}>
      <NavBar
        showBackButton={route.params?.showBackButton}
        showNavBar={route.params?.showNavBar}
        includeDefaultTrailing={isMe}
      >
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
          {isUserFetched ? (
            <FlashList
              stickyHeaderHiddenOnScroll={false}
              ListHeaderComponent={() => {
                return (
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
                                !hasBio ? "text-accents-10" : "text-accents-12"
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
                      <UserList
                        loading={friendLoading}
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
                        <TagIcon size={26} strokeWidth={2} color={"#222"} />
                      </Div>
                    </Div>
                  </Div>
                );
              }}
              numColumns={3}
              stickyHeaderIndices={[0]}
              data={postsWithStickyHeader}
              onScroll={(e) => {
                const scrollY = e.nativeEvent.contentOffset.y;

                if (scrollY > headerHeight.current) {
                  setStickyRendered(true);
                } else {
                  setStickyRendered(false);
                }
              }}
              ListFooterComponent={() => {
                return <Div className={`h-60 bg-black w-full`}></Div>;
              }}
              ListEmptyComponent={() => {
                return (
                  <Div className={`h-60 bg-black`}>
                    <Div
                      className={`flex flex-col items-center justify-center h-full`}
                    >
                      {postLoading ? (
                        <Spinner />
                      ) : (
                        <Text
                          className={`text-lg font-figtree-medium text-accents-11`}
                        >
                          Korisnik nema objava
                        </Text>
                      )}
                    </Div>
                  </Div>
                );
              }}
              renderItem={({ item, index, target }: any) => {
                if (item?.withStickyHeader) {
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
                          <TagIcon size={26} strokeWidth={2} color={"#ddd"} />
                        </Div>
                      </Div>
                    );
                  }
                }

                if (item.type === "filler") {
                  return (
                    <View
                      style={{
                        flex: 1,
                        aspectRatio: 1,
                        backgroundColor: "black",
                      }}
                    />
                  );
                }

                return (
                  <Pressable
                    style={{ flex: 1 }}
                    onPress={() => {
                      navigation.push("post", {
                        id: item.id,
                        previousScreenName: formatUserDisplayName(
                          user?.displayname
                        ),
                      });
                    }}
                  >
                    <Image
                      style={{ aspectRatio: 1, flex: 1 }}
                      // recyclingKey={item.id.toString()}
                      contentFit="cover"
                      source={{
                        uri: item?.Images?.[0]?.pic_url,
                      }}
                    />
                  </Pressable>
                );
              }}
              estimatedItemSize={200}
            />
          ) : (
            <Div className={`flex-1 justify-center items-center flex`}>
              <Spinner />
            </Div>
          )}
        </Div>
      </Div>
      {/* </ScrollView> */}

      {/* </BottomSheet> */}
    </SafeArea>
  );
};
