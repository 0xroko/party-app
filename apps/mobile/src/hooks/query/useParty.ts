import { useRefreshOnFocus } from "@hooks/useRefetchOnFocus";
import { queryKeys } from "@lib/const";
import { supabase } from "@lib/supabase";
import { useQuery } from "react-query";

export const useParty = (partyId?: string) => {
  const q = useQuery(
    queryKeys.partyId(partyId),
    async () => {
      const { data, error } = await supabase
        .from("Party")
        .select(
          `*, 
        host:hostId (id, displayname)`
        )
        .eq("id", partyId)
        .single();

      return data;
    },
    {
      enabled: !!partyId,
    }
  );

  useRefreshOnFocus(q.refetch);

  return q;
};
