import {
  Div,
  Img,
  PlaceHolderUserImage,
  PressableDiv,
  T,
  Text,
} from "@components/index";
import { SafeArea } from "@components/safe-area";
import {
  Squares2X2Icon,
  TagIcon,
  UserPlusIcon,
} from "react-native-heroicons/outline";

import { MapPinIcon, ShareIcon } from "react-native-heroicons/mini";

import { Badge } from "@components/badge";
import { Button } from "@components/button";
import { NavBar, NavBarItem } from "@components/navbar";
import { PostGallery } from "@components/post-gallery";
import { Spinner } from "@components/spinner";
import { PartyList, UserList } from "@components/user-h-list";
import { useFriendRequestCount } from "@hooks/query/useFriendReqestCount";
import { useFriends } from "@hooks/query/useFriends";
import { useFriendship } from "@hooks/query/useFriendship";
import { useUser } from "@hooks/query/useUser";
import {
  UserPostListType,
  addFillerPosts,
  useUserPosts,
} from "@hooks/query/useUserPosts";
import { useAuthUser } from "@hooks/useAuthUser";
import { uploadPfp } from "@lib/actions/img";
import { queryKeys } from "@lib/const";
import { formatBio, formatUserDisplayName } from "@lib/misc";
import { queryClient } from "@lib/queryCache";
import { supabase } from "@lib/supabase";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";
import { AuthUser } from "@supabase/supabase-js";
import { FC, useMemo, useRef, useState } from "react";
import { Platform, Pressable, Share } from "react-native";
import { useQuery } from "react-query";
import colors from "../../../colors";

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
          text: "Ukloni prijatelja",
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
            await friendshipMutation.mutateAsync({
              action: "declineRequest",
              authUser,
            });
            queryClient.invalidateQueries(queryKeys.friends(userId, 0));
            queryClient.invalidateQueries(queryKeys.friendship(userId));
            queryClient.invalidateQueries(queryKeys.friendRequestCount);
          },
          secoundaryText: "Odbij zahtjev",
          text: "Prihvati zahtjev",
        };
      } else if (friendShipStatus === "none") {
        return {
          actionFn: async () => {
            await friendshipMutation.mutateAsync({
              action: "sendRequest",
              authUser,
            });
            queryClient.invalidateQueries(queryKeys.friends(userId, 0));
            queryClient.invalidateQueries(queryKeys.friendship(userId));
            queryClient.invalidateQueries(queryKeys.friendRequestCount);
          },
          text: "Pošalji zahtjev",
        };
      } else if (friendShipStatus === "requested") {
        return {
          actionFn: async () => {
            await friendshipMutation.mutateAsync({
              action: "unsendRequest",
              authUser,
            });
            queryClient.invalidateQueries(queryKeys.friends(userId, 0));
            queryClient.invalidateQueries(queryKeys.friendship(userId));
            queryClient.invalidateQueries(queryKeys.friendRequestCount);
          },
          text: "Otkaži zahtjev",
        };
      }
    }
    return {
      actionFn: async () => {
        handleDataPress();
      },
      text: "Uredi profil",
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

  const { data: partyAttended, isLoading: partysLoading } = useQuery(
    ["party-attended", user?.id],
    async () => {
      const { data } = await supabase
        .from("Attending")
        .select(
          `
          id,
          party:Party(
            id,
            name,
            time_starting,
            imageUrl
          )
          `
        )
        .eq("userId", user?.id)
        .eq("accepted", true)
        .order("time_starting", { ascending: false, foreignTable: "Party" });

      return data;
    }
  );

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
                      <Div className={`flex flex-col relative items-center`}>
                        <PressableDiv
                          className={`rounded-full w-[124px] overflow-hidden h-[124px] mt-4`}
                          onPress={async () => {
                            if (isMe) {
                              await uploadPfp({ userId: user.id });
                              refetch();
                            }
                          }}
                        >
                          {isMe && (
                            <Div
                              pointerEvents="none"
                              className={`absolute z-50 top-[92px] h-36 flex justify-start items-center left-0 right-0 bg-glass-1 rounded-md`}
                            >
                              <Div pointerEvents="none">
                                <T
                                  className={`font-figtree-medium text-white text-sm p-1`}
                                >
                                  Promjeni sliku
                                </T>
                              </Div>
                            </Div>
                          )}
                          <Img
                            className={`w-full h-full rounded-full`}
                            source={
                              user?.imagesId
                                ? {
                                    uri: user.imagesId,
                                    width: 100,
                                  }
                                : PlaceHolderUserImage
                            }
                          />
                        </PressableDiv>
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
                              {formatUserDisplayName(user?.displayname)}
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
                            <Button
                              onPress={() => {
                                Platform.select({
                                  ios: () => {
                                    Share.share({
                                      url:
                                        "https://party-app-nextjs.vercel.app/?user=" +
                                        user.id,
                                      title: "Party App",
                                    });
                                  },
                                  android: () => {
                                    Share.share({
                                      message:
                                        "https://party-app-nextjs.vercel.app/?user=" +
                                        user.id,
                                      title: "Party App",
                                    });
                                  },
                                })();
                              }}
                              iconOnly
                              className={`w-10`}
                            >
                              <ShareIcon
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
                    <Div className={`mt-8 mx-2`}>
                      <PartyList
                        title="Prisustvovao/la"
                        loading={partysLoading}
                        onUserPress={(u) => {
                          navigation.push("party", {
                            id: u?.id,
                            previousScreenName: u.name,
                          });
                        }}
                        partys={partyAttended?.map((t) => t.party) as any}
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
                return (
                  <PostGallery
                    item={item}
                    navigation={navigation}
                    onPress={() => {
                      navigation.push("post", {
                        id: item.id,
                        previousScreenName: formatUserDisplayName(
                          user?.displayname
                        ),
                      });
                    }}
                    target={target}
                  />
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
