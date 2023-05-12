import { Div, T } from "@components/index";
import { NavBar } from "@components/navbar";
import { SafeArea } from "@components/safe-area";
import { Spinner } from "@components/spinner";
import { queryKeys } from "@lib/const";
import { formatUserDisplayName } from "@lib/misc";
import { supabase } from "@lib/supabase";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { formatRelative } from "date-fns";
import { hr } from "date-fns/locale";
import { Image } from "expo-image";
import { FC, useRef, useState } from "react";
import { Dimensions } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import { useQuery } from "react-query";

export const usePost = (postId: string) =>
  useQuery(queryKeys.post(postId), async () => {
    const { data, error } = await supabase
      .from("Post")
      .select(
        `*,
        images:Images(id, pic_url), 
        author:authorId(
          id,
          displayname,
          name,
          surname,
          imagesId
        ),
        party:partyId(
          id,
          name
        )
      `
      )
      .eq("id", postId)
      .single();

    if (error) throw error;
    return data as NonArrayExcept<typeof data, "images">;
  });

type NonArray<T> = T extends Array<infer U> ? U : T;

type NonArrayFields<T> = {
  [K in keyof T]: NonArray<T[K]>;
};

type NonArrayExcept<T, K extends keyof T> = {
  [P in keyof T]: P extends K ? T[P] : NonArray<T[P]>;
};

export const PostInfoScreen: FC<
  NativeStackScreenProps<StackNavigatorParams, "post">
> = ({ navigation, route }) => {
  const postId = route.params.id;

  const { data: post, isLoading } = usePost(postId);

  // 2023-05-01T16:53:25.709
  const parsedDate = Date.parse(post?.created_at ?? new Date().toISOString());
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;
  const carRef = useRef<any>(null);

  const progressValue = useSharedValue<number>(0);

  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <SafeArea>
      <NavBar includeDefaultTrailing={false}></NavBar>
      {isLoading ? (
        <Div className={`flex-1 flex justify-center items-center`}>
          <Spinner />
        </Div>
      ) : (
        <Div className={`flex`}>
          <Div className={`flex flex-row g-4 mx-3 my-3`}>
            <Image
              style={{
                borderRadius: 9999,
                width: 44,
                aspectRatio: 1,
              }}
              source={{
                uri: post?.author?.imagesId as string,
              }}
            />

            <Div className={`flex justify-center g-0.5`}>
              <Div className={`flex flex-row items-center`}>
                <T className={`text-white font-figtree-semi-bold`}>
                  {post?.author.displayname as string}
                </T>
                <T className={`text-accents-11`}> on </T>
                <T
                  onPress={() => {
                    navigation.push("party", {
                      id: post?.party?.id as any,
                      previousScreenName: "User post",
                    });
                  }}
                  className={`text-white font-figtree-semi-bold`}
                >
                  {post?.party?.name as string}
                </T>
              </Div>
              <T className={`text-accents-11 font-figtree-medium`}>
                {formatRelative(parsedDate, new Date(), {
                  locale: hr,
                })}
              </T>
            </Div>
          </Div>

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
                height={height * 0.6}
                ref={carRef}
                mode="horizontal-stack"
                modeConfig={{
                  showLength: 2,
                  moveSize: width * 1.2,
                  stackInterval: 40,
                }}
                scrollAnimationDuration={1000}
                data={
                  post?.images as {
                    id: string;
                    pic_url: string;
                  }[]
                }
                loop={false}
                onSnapToItem={(index) => {
                  setCurrentIndex(index);
                }}
                renderItem={({ item, index }) => {
                  return (
                    <Div
                      style={{
                        flex: 1,
                        position: "relative",
                        justifyContent: "center",
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
                            <T className={`text-accents-11`}>na</T>{" "}
                            {post?.party?.name as string}
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
                    </Div>
                  );
                }}
              />
            </Div>
          )}
        </Div>
      )}
    </SafeArea>
  );
};
