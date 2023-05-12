import { ADiv, Div, Img, PageMargin, PressableDiv, T } from "@components/index";
import { NavBar, NavBarItem } from "@components/navbar";
import { PostHeader } from "@components/post-header";
import { SafeArea } from "@components/safe-area";
import { Spinner } from "@components/spinner";
import { PostImage, usePost } from "@hooks/query/usePost";
import { useUserId } from "@hooks/query/useUser";
import { useAuthUser } from "@hooks/useAuthUser";
import { formatUserDisplayName } from "@lib/misc";
import { supabase } from "@lib/supabase";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Image } from "expo-image";
import { FC, useRef, useState } from "react";
import { Dimensions } from "react-native";
import { Cog6ToothIcon } from "react-native-heroicons/outline";
import { useAnimatedStyle } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import * as DropdownMenu from "zeego/dropdown-menu";

export const PostInfoScreen: FC<
  NativeStackScreenProps<StackNavigatorParams, "post">
> = ({ navigation, route }) => {
  const postId = route.params.id;

  const { data: post, isLoading } = usePost(postId);
  const { data: authUser } = useAuthUser();
  const { data: user } = useUserId(authUser?.user?.id as string);

  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;

  const carRef = useRef<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMyPost = post?.author?.id === authUser?.user?.id;

  return (
    <SafeArea>
      <NavBar includeDefaultTrailing={false}>
        <NavBarItem isDropdown>
          {isMyPost && !isLoading && (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Div className={``}>
                  <Cog6ToothIcon size={24} strokeWidth={2} color={"#fff"} />
                </Div>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content style={{ backgroundColor: "black" }}>
                <DropdownMenu.Label>Delete post</DropdownMenu.Label>
                <DropdownMenu.Item
                  onSelect={async () => {
                    await supabase.from("Post").delete().eq("id", postId);
                    navigation.goBack();
                  }}
                  key="2"
                >
                  Delete post
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          )}
        </NavBarItem>
      </NavBar>
      {isLoading ? (
        <Div className={`flex-1 flex justify-center items-center`}>
          <Spinner />
        </Div>
      ) : (
        <Div className={`flex`}>
          <PostHeader navigation={navigation} post={post} />
          {post?.images && (
            <Div className={`relative`}>
              <Div
                className={`absolute top-0 right-4 z-50 bg-black rounded-full py-1 flex justify-center items-center text-center px-2`}
              >
                <T className={`text-white font-figtree-medium`}>
                  {" "}
                  {`${currentIndex + 1}/${(post?.images as any)?.length}`}
                </T>
              </Div>
              <Carousel
                // onProgressChange={(_, absoluteProgress) =>
                //   (progressValue.value = absoluteProgress)
                // }
                width={width}
                height={height * 0.65}
                ref={carRef}
                mode="horizontal-stack"
                enabled={(post?.images as any)?.length > 1}
                modeConfig={{
                  showLength: 2,
                  moveSize: width * 1.2,
                  stackInterval: 40,
                }}
                scrollAnimationDuration={1000}
                data={post?.images as PostImage[]}
                loop={false}
                onSnapToItem={(index) => {
                  setCurrentIndex(index);
                }}
                renderItem={({ item, index, animationValue }) => {
                  const tagStyles = useAnimatedStyle(() => {
                    return {
                      opacity: 1 - animationValue.value,
                    };
                  });

                  return (
                    <Div
                      style={{
                        flex: 1,
                        position: "relative",
                        // backgroundColor: "red",
                      }}
                    >
                      <Div
                        className={`flex items-center bg-white mt-2`}
                        style={{
                          aspectRatio: 0.8,
                          transform: [{ rotate: "-0.6deg" }],
                        }}
                      >
                        <Image
                          style={{
                            width: "90%",
                            marginTop: "8%",
                            transform: [{ rotate: "0.2deg" }],
                            aspectRatio: 1,
                          }}
                          contentFit="cover"
                          source={{ uri: item.pic_url as string }}
                        ></Image>
                        <Div
                          style={{
                            transform: [{ rotate: "0.2deg" }],
                          }}
                          className={`flex w-[90%] my-auto `}
                        >
                          <T
                            className={`text-accents-2 font-figtree-semi-bold text-xl leading-6`}
                          >
                            {post?.author?.name as string}{" "}
                            {post?.author?.surname as string}{" "}
                            {post?.party?.name && (
                              <>
                                <T className={`text-accents-11`}>na</T>{" "}
                                {post?.party?.name as string}
                              </>
                            )}
                          </T>
                          <T
                            className={`text-accents-7 font-figtree-semi-bold text-xl`}
                          >
                            {formatUserDisplayName(
                              post?.author.displayname as string
                            )}
                          </T>
                        </Div>
                      </Div>
                      {item?.tags?.length > 0 && (
                        <ADiv
                          style={tagStyles}
                          className={`mt-5 ml-4 flex flex-row`}
                        >
                          <T className={`text-accents-11 font-figtree-bold`}>
                            Na slici:{" "}
                          </T>
                          {item?.tags?.map((tag, i) => (
                            <T
                              onPress={() => {
                                navigation.push("user", {
                                  id: tag?.user?.id,
                                  previousScreenName: `${route?.params?.previousScreenName} Post`,
                                });
                              }}
                              key={i}
                              className={`text-white font-figtree-bold`}
                            >
                              {formatUserDisplayName(tag?.user?.displayname)}
                              {`${i === item?.tags?.length - 1 ? "" : ", "}`}
                            </T>
                          ))}
                        </ADiv>
                      )}
                    </Div>
                  );
                }}
              />
            </Div>
          )}
          <Div className={`${PageMargin} mt-5`}>
            <PressableDiv
              onPress={() => {
                navigation.navigate("comments", {
                  postId: post?.id,
                  previousScreenName: "Home",
                  focus: true,
                });
              }}
              className={`flex flex-row items-center g-3`}
            >
              <Img
                className={`w-10 h-10 rounded-full `}
                source={{
                  uri: user?.imagesId,
                }}
              ></Img>
              <T className={`text-white text-base font-figtree-bold`}>
                Komentiraj...
              </T>
            </PressableDiv>
            <PressableDiv
              onPress={() => {
                navigation.push("comments", {
                  postId: post?.id,
                  previousScreenName: "Home",
                });
              }}
              className={`flex g-2 mt-4`}
            >
              {(post?.comment as any)?.length > 0 && (
                <Div className={`flex flex-row`}>
                  <T className={`text-base font-figtree-semi-bold text-white`}>
                    {formatUserDisplayName(
                      post?.comment?.[0]?.author?.displayname
                    )}{" "}
                  </T>
                  <T
                    className={`text-base text-accents-10 ml-0.5 max-w-[80%] font-figtree-semi-bold`}
                  >
                    {post?.comment?.[0]?.content}
                  </T>
                </Div>
              )}
              <T className={`text-base font-figtree-semi-bold text-accents-10`}>
                Vidi sve komentare{" "}
              </T>
            </PressableDiv>
          </Div>
        </Div>
      )}
    </SafeArea>
  );
};
