import { onSupabaseError } from "@lib/actions";
import { queryKeys } from "@lib/const";
import { supabase } from "@lib/supabase";
import { useQuery } from "react-query";

export type PostImage = {
  id: string;
  pic_url: string;
  tags: {
    id: string;
    user: {
      displayname: string;
      id: string;
    };
  }[];
};

export const usePost = (postId: string) =>
  useQuery(queryKeys.post(postId), async () => {
    const { data, error } = await supabase
      .from("Post")
      .select(
        `*,
        images:Images(
          id, 
          pic_url,
          tags:TaggedOnImages(
            id,
            user:userId(
              displayname,
              id
            )
          )
        ), 
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
        ),
        comment:Comment(
          id,
          content,
          author:authorId(
            id,
            displayname
          )
        )
      `
      )
      .eq("id", postId)
      .limit(1, { foreignTable: "Comment" })
      .order("createdAt", { ascending: false, foreignTable: "Comment" })
      .single();

    if (error) {
      onSupabaseError(error);
    }
    return data as NonArrayExcept<typeof data, "images">;
  });

type NonArray<T> = T extends Array<infer U> ? U : T;

type NonArrayFields<T> = {
  [K in keyof T]: NonArray<T[K]>;
};

type NonArrayExcept<T, K extends keyof T> = {
  [P in keyof T]: P extends K ? T[P] : NonArray<T[P]>;
};
