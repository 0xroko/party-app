import { queryKeys } from "@lib/const";
import { supabase } from "@lib/supabase";
import { useInfiniteQuery } from "react-query";

export const usePartyPosts = (partyId?: string) => {
  const q = useInfiniteQuery(
    queryKeys.partyPosts(partyId),
    async ({ pageParam = 0 }) => {
      const { data, error } = await supabase
        .from("Post")
        .select("*, Images(id, pic_url)")

        .eq("partyId", partyId)
        .range(pageParam, pageParam + 10)
        .order("created_at", { ascending: false });

      return {
        data,
        next: pageParam + 1,
      };
    },
    {
      getNextPageParam: (lastPage) => {
        return lastPage.next;
      },
      enabled: !!partyId,
    }
  );

  return q;
};
