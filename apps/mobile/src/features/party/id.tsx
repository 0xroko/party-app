import { T } from "@components/index";
import { SafeArea } from "@components/safe-area";
import { queryKeys } from "@lib/const";
import { supabase } from "@lib/supabase";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC } from "react";
import { useQuery } from "react-query";

const useParty = (partyId?: string) => {
  const q = useQuery(
    queryKeys.partyId(partyId),
    async () => {
      const { data, error } = await supabase
        .from("parties")
        .select("*")
        .eq("id", partyId);

      return data;
    },
    {
      enabled: !!partyId,
    }
  );

  return q;
};

export const PartyInfo: FC<
  NativeStackScreenProps<StackNavigatorParams, "party">
> = ({ navigation, route }) => {
  const partyId = route.params.id;

  const { data: party } = useParty(partyId);

  return (
    <SafeArea>
      <T>Party Info</T>
      <T>{JSON.stringify(party, null, 2)}</T>
    </SafeArea>
  );
};
