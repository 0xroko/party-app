import { queryKeys } from "@lib/const";
import { supabase } from "@lib/supabase";
import { User } from "@supabase/supabase-js";
import { useQuery } from "react-query";

export const useUserPosts = (userId?: User["id"], page: number = 0) => {
  return useQuery(
    queryKeys.postsByUser(userId, page),
    async () => {
      // get all record from Images table where postId is same as post id

      const { data, error } = await supabase
        .from("Post")
        .select("*, Images(id, pic_url)")
        .filter("authorId", "eq", userId)
        .order("created_at", { ascending: false });

      console.log(data, error);

      return data;
    },
    {
      enabled: !!userId,
    }
  );
};

export type UserPost = ReturnType<typeof useUserPosts>["data"][number];

export type UserPostListType =
  | UserPost
  | { type: "filler" }
  | (UserPost & { type: "sticky" });

export const addFillerPosts = (posts: UserPost[]) => {
  if (!posts) return [];
  let postsWithStickyHeader: UserPostListType[] = [...posts];

  if (posts?.length > 0)
    postsWithStickyHeader[0] = Object.assign(postsWithStickyHeader[0], {
      withStickyHeader: true,
    });

  // add filler posts to the end
  const remaining = posts?.length % 3;

  if (remaining > 0) {
    for (let i = 0; i <= remaining; i++) {
      postsWithStickyHeader.push({
        type: "filler",
      });
    }
  }
  return postsWithStickyHeader;
};
