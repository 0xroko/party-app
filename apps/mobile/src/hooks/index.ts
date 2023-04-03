import { supabase } from "@lib/supabase";
import { useQuery } from "react-query";

export interface BaseQueryHookOptions {
  refetchFocus?: boolean;
}

export const useRandomParty = (options?: BaseQueryHookOptions) => {
  const query = useQuery(["randomParty"], async () => {
    const { data } = await supabase.from("Party").select("*").single();

    return data;
  });
  return query;
};
