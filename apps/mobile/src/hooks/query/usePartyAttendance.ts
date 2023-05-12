import { queryKeys } from "@lib/const";
import { supabase } from "@lib/supabase";
import { useQuery } from "react-query";

export const usePartyAttendance = (partyId?: string) => {
  const q = useQuery(
    queryKeys.partyAttendance(partyId),
    async () => {
      const { data, error } = await supabase
        .from("Attending")
        .select(
          `*, 
        user:userId (id, displayname, imagesId, name, surname)`
        )
        .eq("partyId", partyId)
        .eq("accepted", true);

      return data;
    },
    {
      enabled: !!partyId,
    }
  );

  return q;
};
