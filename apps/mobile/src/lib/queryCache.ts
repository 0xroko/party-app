import { QueryClient } from "react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 1 min
      cacheTime: 1000 * 60 * 0,
      staleTime: 1000 * 60 * 0,
    },
  },
});
