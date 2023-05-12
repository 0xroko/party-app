import { queryKeys } from "@lib/const";
import { supabase } from "@lib/supabase";
import { useQuery } from "react-query";

export const usePartyAttendanceMe = (partyId?: string, userId?: string) => {
  const q = useQuery(
    queryKeys.partyAttendanceMe(partyId),
    async () => {
      const { data, error } = await supabase
        .from("Attending")
        .select(
          `*, 
        user:userId (id, displayname)`
        )
        .eq("partyId", partyId)
        .eq("userId", userId)
        .single();
      return data;
    },
    {
      enabled: !!partyId && !!userId,
    }
  );

  return q;
};
