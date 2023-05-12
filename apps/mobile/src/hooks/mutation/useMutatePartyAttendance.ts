import { queryKeys } from "@lib/const";
import { queryClient } from "@lib/queryCache";
import { supabase } from "@lib/supabase";
import { useMutation } from "react-query";

export const useMutatePartyAttendance = (partyId?: string, userId?: string) => {
  const a = useMutation(async (accepted: boolean) => {
    const { data } = await supabase.from("Attending").upsert(
      {
        partyId,
        userId,
        accepted: accepted,
      },
      { onConflict: "partyId, userId" }
    );

    queryClient.invalidateQueries(queryKeys.partyAttendanceMe(partyId));
    queryClient.invalidateQueries(queryKeys.partyAttendance(partyId));
    return data;
  });

  return a;
};
