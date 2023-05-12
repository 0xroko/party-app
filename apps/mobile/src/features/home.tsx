import { HomePartys } from "@components/home-partys";
import { Div, EmptyPageMessage, Img, PressableDiv, T } from "@components/index";
import { NavBar, NavBarItem } from "@components/navbar";
import { PostHeader } from "@components/post-header";
import { SafeArea, SafeAreaTabbarPadding } from "@components/safe-area";
import { Spinner } from "@components/spinner";
import { useTimelinePosts } from "@hooks/query/useTimelinePost";
import { useUserId } from "@hooks/query/useUser";
import { useAuthUser } from "@hooks/useAuthUser";
import { queryKeys } from "@lib/const";
import { formatUserDisplayName } from "@lib/misc";
import { queryClient } from "@lib/queryCache";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { FC, useMemo } from "react";
import { Dimensions, Pressable, RefreshControl } from "react-native";
import { ChatBubbleBottomCenterIcon } from "react-native-heroicons/outline";
import Carousel from "react-native-reanimated-carousel";
import colors from "../../colors";

export const HomeScreen: FC<
  NativeStackScreenProps<StackNavigatorParams, "home">
> = ({ navigation, route }) => {
  const { data: authUser } = useAuthUser();

  const userId = authUser?.user?.id;

  const { data: user } = useUserId(userId);

  const { data, refetch, isLoading, hasNextPage, fetchNextPage } =
    useTimelinePosts();

  const nextPageFetch = hasNextPage ? fetchNextPage : null;

  const postsFlat = useMemo(() => {
    return data?.pages?.map((page) => page?.data).flat();
  }, [data]);

  const width = Dimensions.get("window").width;

  return (
    <SafeArea midGradient={false} gradient>
      <NavBar leadingLogo>
        <NavBarItem>
          <PressableDiv
            onPress={() => {
              navigation.navigate("chats", {
                previousScreenName: "Home",
              });
            }}
          >
            <ChatBubbleBottomCenterIcon
              size={24}
              color={colors.accents[12]}
              strokeWidth={2}
            />
          </PressableDiv>
        </NavBarItem>
      </NavBar>
      {isLoading ? (
        <Div className={`flex-1 justify-center items-center`}>
          <Spinner />
        </Div>
      ) : (
        <FlashList
          refreshControl={
            <RefreshControl
              progressBackgroundColor={colors.accents[1]}
              colors={[colors.accents[11]]}
              refreshing={isLoading}
              onRefresh={async () => {
                queryClient.invalidateQueries(queryKeys.latestParties);
                await refetch();
              }}
            />
          }
          estimatedItemSize={600}
          keyExtractor={(item) => item?.id ?? ""}
          ListHeaderComponent={() => {
            const memoedHomePartys = useMemo(() => {
              return <HomePartys navigation={navigation} />;
            }, [navigation]);
            return memoedHomePartys;
          }}
          ListFooterComponent={() => {
            return <SafeAreaTabbarPadding />;
          }}
          ListEmptyComponent={() => {
            return (
              <EmptyPageMessage>Nema objava za prikazati</EmptyPageMessage>
            );
          }}
          onEndReached={() => {
            nextPageFetch?.();
          }}
          data={postsFlat}
          renderItem={({ item }) => {
            const postId = item?.id;
            const hasDescription = item?.description !== "";
            return (
              <Div className={`flex mb-2`}>
                <PostHeader navigation={navigation} post={item} />
                {item?.images?.length > 1 ? (
                  <Carousel
                    width={width}
                    height={400}
                    data={item?.images}
                    enabled={item?.images?.length > 1}
                    panGestureHandlerProps={{
                      activeOffsetX: [-10, 10],
                    }}
                    loop={false}
                    scrollAnimationDuration={100}
                    renderItem={({ item, index }) => {
                      return (
                        <PressableDiv
                          onPress={() => {
                            navigation.navigate("post", {
                              id: postId,
                              previousScreenName: "Home",
                            });
                          }}
                          className={`w-full`}
                          style={{
                            aspectRatio: 1,
                          }}
                        >
                          <Image
                            contentFit="cover"
                            style={{
                              width: "100%",
                              height: "100%",
                            }}
                            source={{
                              uri: item?.pic_url,
                            }}
                          ></Image>
                        </PressableDiv>
                      );
                    }}
                  />
                ) : (
                  <PressableDiv
                    onPress={() => {
                      navigation.navigate("post", {
                        id: item?.id,
                        previousScreenName: "Home",
                      });
                    }}
                    className={`w-full mt-1`}
                    style={{
                      aspectRatio: 1,
                    }}
                  >
                    <Image
                      contentFit="cover"
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                      source={{
                        uri: item?.images?.[0]?.pic_url,
                      }}
                    ></Image>
                  </PressableDiv>
                )}

                <Div
                  className={`flex flex-col justify-start g-3 px-4 pt-5 pb-2`}
                >
                  <T
                    className={`${
                      hasDescription ? "text-white" : "text-accents-10"
                    }  text-base font-figtree-bold`}
                    style={{
                      maxWidth: "80%",
                    }}
                  >
                    {!hasDescription ? "Nema opisa" : item?.description}
                  </T>

                  <Pressable
                    onPress={() => {
                      navigation.navigate("comments", {
                        postId: item?.id,
                        previousScreenName: "Home",
                        focus: true,
                      });
                    }}
                  >
                    <Div className={`flex flex-row items-center g-3`}>
                      <Img
                        className={`w-10 h-10 rounded-full `}
                        source={{
                          uri: user?.imagesId,
                        }}
                      ></Img>
                      <T className={`text-white text-base font-figtree-bold`}>
                        Komentiraj...
                      </T>
                    </Div>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      navigation.push("comments", {
                        postId: item?.id,
                        previousScreenName: "Home",
                      });
                    }}
                  >
                    <Div className={`flex g-1`}>
                      {item?.comment?.length > 0 && (
                        <Div className={`flex flex-row`}>
                          <T
                            className={`text-base font-figtree-semi-bold text-white`}
                          >
                            {formatUserDisplayName(
                              item?.comment?.[0]?.author?.displayname
                            )}{" "}
                          </T>
                          <T
                            className={`text-base text-accents-10 ml-0.5 max-w-[80%] font-figtree-semi-bold`}
                          >
                            {item?.comment?.[0]?.content}
                          </T>
                        </Div>
                      )}
                      <T
                        className={`text-base font-figtree-semi-bold text-accents-10`}
                      >
                        Vidi sve komentare{" "}
                      </T>
                    </Div>
                  </Pressable>
                </Div>
              </Div>
            );
          }}
        ></FlashList>
      )}
    </SafeArea>
  );
};
