import { Button } from "@components/button";
import { Div, EmptyPageMessage, Img, PageMargin, T } from "@components/index";
import { Input } from "@components/input";
import { NavBar } from "@components/navbar";
import { SafeArea } from "@components/safe-area";
import { Spinner } from "@components/spinner";
import { User } from "@lib/actions";
import { queryKeys } from "@lib/const";
import { formatPartyCommentDate } from "@lib/misc";
import { queryClient } from "@lib/queryCache";
import { supabase } from "@lib/supabase";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";
import { Field, Form } from "houseform";
import { FC, useMemo } from "react";
import { Pressable } from "react-native";
import { PaperAirplaneIcon } from "react-native-heroicons/mini";
import { useInfiniteQuery, useMutation } from "react-query";
import { z } from "zod";

const commentsPerPage = 20;

export type Comment = {
  authorId: string;
  content: string;
  createdAt: string;
  id: string;
  postId: string;
  updatedAt: string;
  author: Pick<User, "id" | "displayname" | "name" | "surname" | "imagesId">;
};

const useComments = (postId?: string, page: number = 0) => {
  const q = useInfiniteQuery(
    queryKeys.comments(postId, page),
    async ({ pageParam = 0 }) => {
      const offset = commentsPerPage * pageParam;
      const limit = commentsPerPage;

      const { data } = await supabase
        .from("Comment")
        .select(
          `*,
          author:authorId (
            id,
            displayname,
            name,
            surname,
            imagesId
          )
        `
        )
        .eq("postId", postId)
        .order("createdAt", { ascending: false })
        .range(offset, offset + limit - 1);

      return {
        pages: data as Comment[],
        nextPage: pageParam + 1,
      };
    },
    {
      getNextPageParam: (lastPage, pages) => {
        return lastPage.pages.length === 0 ? undefined : lastPage.nextPage;
      },
    }
  );

  return q;
};

const usePostComment = (postId?: string) => {
  const m = useMutation({
    mutationFn: async (comment: string) => {
      const user = await supabase.auth.getUser();
      const { data } = await supabase.from("Comment").insert({
        postId,
        content: comment,
        authorId: user?.data?.user?.id,
      });
      return data;
    },
  });

  return m;
};

export const CommentsPage: FC<
  NativeStackScreenProps<StackNavigatorParams, "comments">
> = ({ navigation, route }) => {
  const { postId, focus } = route.params;

  const { data: comments, isLoading, refetch } = useComments(postId);

  const commentsFlat = useMemo(() => {
    return comments?.pages?.map((page) => page?.pages).flat();
  }, [comments]);

  const { mutateAsync: postComment, isLoading: posting } =
    usePostComment(postId);

  return (
    <SafeArea>
      <NavBar includeDefaultTrailing={false} />
      <Div
        className={`absolute bottom-0 pb-10 z-50 bg-black rounded-t-3xl p-3  w-full`}
      >
        <Form<{ content: string }>
          onSubmit={async (v, f) => {
            await postComment(v.content);
            queryClient.invalidateQueries(queryKeys.commentsInf(postId));
            queryClient.invalidateQueries("timelinePosts");
            queryClient.invalidateQueries(queryKeys.post(postId));
            f.reset();
          }}
        >
          {({ submit }) => {
            return (
              <Div className={`flex g-3 flex-row items-center`}>
                <Field
                  onSubmitValidate={z.string().max(100, "Maks 100 znakova")}
                  name={`content`}
                >
                  {({ value, setValue, errors }) => {
                    return (
                      <Div className={`flex-1`}>
                        <Input
                          error={errors[0]}
                          disabled={posting}
                          autoFocus={focus}
                          placeholder={`Unesite komentar`}
                          value={value}
                          onChangeText={(e) => setValue(e)}
                        ></Input>
                      </Div>
                    );
                  }}
                </Field>
                <Button
                  className={`w-10 mt-2`}
                  iconOnly
                  onPress={submit}
                  loading={posting}
                >
                  <PaperAirplaneIcon size={20} color={`black`} />
                </Button>
              </Div>
            );
          }}
        </Form>
      </Div>
      <FlashList
        data={commentsFlat}
        ListEmptyComponent={() => {
          return (
            <Div className={`flex-1 justify-center flex items-center`}>
              {isLoading ? (
                <Spinner />
              ) : (
                <EmptyPageMessage>Nema komentara</EmptyPageMessage>
              )}
            </Div>
          );
        }}
        estimatedItemSize={50}
        renderItem={({ item }) => {
          return (
            <Div className={`${PageMargin}`}>
              <Div className={`flex flex-row items-center g-3`}>
                <Pressable
                  onPress={() => {
                    navigation.push("user", {
                      id: item.author?.id,
                      previousScreenName: "Komentari",
                    });
                  }}
                >
                  <Img
                    source={{
                      uri: item.author?.imagesId,
                    }}
                    className={`w-10 h-10 rounded-full`}
                  ></Img>
                </Pressable>
                <Div className={`flex g-1 max-w-[80%]`}>
                  <Pressable
                    onPress={() => {
                      navigation.push("user", {
                        id: item.author?.id,
                      });
                    }}
                  >
                    <T className={`font-figtree-bold text-white`}>
                      {item.author?.name}
                      {"  "}
                      <T className={`text-accents-11 font-figtree-medium`}>
                        {formatPartyCommentDate(item?.createdAt)}
                      </T>
                    </T>
                  </Pressable>
                  <T className={`font-figtree-medium text-white`}>
                    {item.content}
                  </T>
                </Div>
              </Div>
              <Div className={`w-px h-6`}></Div>
            </Div>
          );
        }}
      />
    </SafeArea>
  );
};
