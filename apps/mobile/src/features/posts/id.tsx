import { Div, T } from "@components/index";
import { NavBar } from "@components/navbar";
import { SafeArea } from "@components/safe-area";
import { queryKeys } from "@lib/const";
import { supabase } from "@lib/supabase";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { formatRelative } from "date-fns";
import { hr } from "date-fns/locale";
import { Image } from "expo-image";
import { FC } from "react";
import { useQuery } from "react-query";

export const usePost = (postId: string) =>
  useQuery(queryKeys.post(postId), async () => {
    const { data, error } = await supabase
      .from("Images")
      .select(
        `*, 
        author:authorId(
          id,
          displayname,
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
    return data as NonArrayFields<NonArrayFields<NonArrayFields<typeof data>>>;
  });

type NonArray<T> = T extends Array<infer U> ? U : T;

type NonArrayFields<T> = {
  [K in keyof T]: NonArray<T[K]>;
};

export const PostInfoScreen: FC<
  NativeStackScreenProps<StackNavigatorParams, "post">
> = ({ navigation, route }) => {
  const postId = route.params.id;

  const { data: post, isLoading } = usePost(postId);

  // 2023-05-01T16:53:25.709
  const parsedDate = Date.parse(post?.createdAt ?? new Date().toISOString());

  return (
    <SafeArea>
      <NavBar includeDefaultTrailing={false}></NavBar>
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
            <T className={`text-white font-figtree-semi-bold`}>
              {post?.author.displayname as string}{" "}
              <T className={`text-accents-11`}>on</T>{" "}
              {post?.party?.name as string}
            </T>
            <T className={`text-accents-11 font-figtree-medium`}>
              {formatRelative(parsedDate, new Date(), {
                locale: hr,
              })}
            </T>
          </Div>
        </Div>
        <Image
          style={{
            height: "70%",
          }}
          source={{ uri: post?.pic_url }}
        ></Image>
      </Div>
    </SafeArea>
  );
};
