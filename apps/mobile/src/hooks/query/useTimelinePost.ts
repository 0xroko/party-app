import { useAuthUser } from "@hooks/useAuthUser";
import { useInfiniteQuery } from "react-query";

export type Posts = {
  id: string;
  created_at: string | null;
  authorId: string | null;
  description: string | null;
  partyId: string | null;
  author: {
    id: string;
    displayname: string;
    name: string;
    surname: string;
    imagesId: string;
  };
  party: {
    id: string;
    name: string;
  };
  comment: {
    id: string;
    content: string;
    author: {
      id: string;
      displayname: string;
    };
  }[];
  images: {
    id: string;
    pic_url: string;
  }[];
};

const pageLimit = 10;

export const useTimelinePosts = () => {
  const { data: authUser, isFetched, refetch } = useAuthUser();

  const q = useInfiniteQuery(
    "timelinePosts",
    async ({ pageParam = 0 }) => {
      const offset = pageParam * pageLimit;
      const limit = pageLimit;
      const url = `https://party-app-nextjs.vercel.app/api/latest_posts?userId=${authUser?.user?.id}&offset=${offset}&limit=${limit}`;
      console.log("fetching  ", url);

      const r = await fetch(url, {
        method: "GET",
      });

      const data = await r.json();

      const posts = data?.posts as Posts[];

      return {
        data: posts ?? [],
        nextPage: pageParam + 1,
      };
    },
    {
      getNextPageParam: (lastPage) => {
        return lastPage.nextPage ?? 0;
      },
      enabled: !!authUser?.user?.id,
    }
  );

  return q;
};
